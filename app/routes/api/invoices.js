import express from 'express';
import { getAlmaInvoicesReadyToBePaid, getAlmaIndividualInvoiceData, setSelectedData, getSingleInvoiceData, getVendorData, getVendorPoLines } from '../../controllers/almaapicalls.js';
import { reformatAlmaInvoiceforAPI, filterOutSubmittedInvoices, changeFundIDtoCode } from '../../controllers/formatdata.js';
import { aggieEnterprisePaymentRequest, checkStatusInOracle, checkPayments } from '../../controllers/graphqlcalls.js';
import { postAddInvoice, getPaidInvoices, getAllUnpaidInvoices, getInvoiceBySearchTerm, fetchInvoiceByInvoiceId } from '../../controllers/dbcalls.js';
import { archivePaidInvoices, checkOracleStatus } from '../../controllers/background-scripts.js';
import { logMessage } from '../../util/logger.js';
import { setActiveLibrary } from '../../util/keycloak-auth.js';

const router = express.Router();

async function fetchAllInvoices(library) {
  const [data1, data2] = await Promise.all([
    getAlmaInvoicesReadyToBePaid(library, 0),
    getAlmaInvoicesReadyToBePaid(library, 100),
  ]);
  return { invoice: [...data1.invoice, ...data2.invoice] };
}

async function enrichInvoiceFunds(data, library) {
  const fundCache = new Map();

  const invoices = await Promise.all((data.invoice || []).map(async (invoice) => {
    const lines = invoice.invoice_lines?.invoice_line || [];
    const invoiceLines = await Promise.all(lines.map(async (line) => {
      const distributions = await Promise.all((line.fund_distribution || []).map(async (dist) => {
        const fundId = typeof dist.fund_code?.value === 'string'
          ? dist.fund_code.value.trim()
          : dist.fund_code?.value;

        if (!fundId) return dist;

        if (!fundCache.has(fundId)) {
          fundCache.set(fundId, changeFundIDtoCode(fundId, library));
        }

        const externalId = await fundCache.get(fundId);
        return {
          ...dist,
          fund_external_id: { value: externalId || '' },
        };
      }));

      return {
        ...line,
        fund_distribution: distributions,
      };
    }));

    return {
      ...invoice,
      invoice_lines: {
        ...invoice.invoice_lines,
        invoice_line: invoiceLines,
      },
    };
  }));

  return { ...data, invoice: invoices };
}

function poLineValue(line) {
  if (typeof line?.po_line === 'string') return line.po_line.trim();
  return line?.po_line?.value || line?.po_line?.number || '';
}

function enrichInvoiceLineTitles(invoice, poLineData) {
  const poLineTitles = new Map(
    (poLineData?.po_line || [])
      .filter((poLine) => poLine.number)
      .map((poLine) => [poLine.number, poLine.resource_metadata?.title || ''])
  );

  return {
    ...invoice,
    invoice_lines: {
      ...invoice.invoice_lines,
      invoice_line: (invoice.invoice_lines?.invoice_line || []).map((line) => {
        const title = poLineTitles.get(poLineValue(line));
        return {
          ...line,
          po_line_title: title || '',
        };
      }),
    },
  };
}

// GET /api/me — current user info
router.get('/me', (req, res) => {
  const { userdata } = res.locals;
  if (!userdata) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ user: userdata });
});

// POST /api/me/library — admin-only active library switch
router.post('/me/library', (req, res) => {
  const result = setActiveLibrary(req, req.body?.library);
  if (result.error) return res.status(result.status).json({ error: result.error });
  res.json({ user: result.user });
});

// GET /api/invoices/pending — invoices ready to be paid from Alma (filtered)
router.get('/invoices/pending', async (req, res) => {
  try {
    const { userdata } = res.locals;
    if (!userdata?.library) return res.status(403).json({ error: 'No library assigned to user' });

    const totaldata = await fetchAllInvoices(userdata.library);
    const data = await filterOutSubmittedInvoices(totaldata, userdata.library);
    const enrichedData = await enrichInvoiceFunds(data, userdata.library);
    res.json(enrichedData);
  } catch (error) {
    logMessage('DEBUG', 'api/invoices GET /pending', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/invoices/send — submit selected invoices to Aggie Enterprise
router.post('/invoices/send', async (req, res) => {
  try {
    const { userdata } = res.locals;
    if (!userdata?.library) return res.status(403).json({ error: 'No library assigned to user' });

    const { invoiceids } = req.body;
    if (!invoiceids?.length) return res.status(400).json({ error: 'No invoice IDs provided' });

    const { library } = userdata;
    logMessage('INFO', 'api/invoices POST /send started', { invoiceids, library });
    const step1 = await setSelectedData(invoiceids);
    const variableInputs = await reformatAlmaInvoiceforAPI(step1, library);
    logMessage('INFO', 'api/invoices POST /send payloads formatted', {
      invoiceCount: invoiceids.length,
      payloadCount: variableInputs.length,
      invoiceLineCounts: variableInputs.map((v) => v.data.payload.invoiceLines.length),
    });
    const consumerTrackingIds = variableInputs.map((v) => v.data.header.consumerTrackingId);
    const requestresults = await aggieEnterprisePaymentRequest(variableInputs);
    logMessage('INFO', 'api/invoices POST /send payment responses received', {
      responseCount: requestresults?.length || 0,
      statuses: requestresults?.map((r) => r?.data?.scmInvoicePaymentCreate?.requestStatus?.requestStatus || r?.httpStatus || 'ERROR') || [],
    });

    if (!requestresults) return res.status(500).json({ error: 'No response from payment system' });

    const invoicedata = await getAlmaIndividualInvoiceData(invoiceids);
    const results = [];

    for (let i = 0; i < invoicedata.invoice.length; i++) {
      const invoice = invoicedata.invoice[i];
      const request = requestresults[i];

      if (!request || request?.errors?.length > 0) {
        const errors = request?.errors || [{ message: 'No response from payment system' }];
        logMessage('DEBUG', 'api/invoices POST /send error', errors);
        results.push({ invoice, error: errors });
        continue;
      }

      const paymentCreate = request?.data?.scmInvoicePaymentCreate;
      const validationErrors = paymentCreate?.validationResults?.errorMessages || [];
      const alreadyExists = validationErrors.some((message) =>
        message?.includes('A request already exists for your consumerId and consumerTrackingId')
      );
      const isPending = paymentCreate?.requestStatus?.requestStatus === 'PENDING';

      if (validationErrors.length && !alreadyExists) {
        results.push({ invoice, error: validationErrors.map((message) => ({ message })) });
        continue;
      }

      if (isPending || alreadyExists) {
        const saved = await postAddInvoice(invoice.number, invoice.id, consumerTrackingIds[i], library, request.data);
        if (!saved) {
          results.push({ invoice, error: [{ message: 'Payment request was accepted, but local invoice record was not saved.' }] });
          continue;
        }
      } else {
        results.push({ invoice, error: [{ message: 'Payment request did not return PENDING status.' }] });
        continue;
      }

      results.push({ invoice, request: request?.data });
    }

    const hasErrors = results.some((result) => result.error);
    if (hasErrors) return res.status(502).json({ error: 'One or more invoices failed to submit', results });
    res.json({ results });
  } catch (error) {
    logMessage('DEBUG', 'api/invoices POST /send', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/invoices/paid — paid invoices from DB
router.get('/invoices/paid', async (req, res) => {
  try {
    const { userdata } = res.locals;
    if (!userdata?.library) return res.status(403).json({ error: 'No library assigned to user' });

    const paiddata = await getPaidInvoices(userdata.library);
    res.json({ invoices: paiddata[0] });
  } catch (error) {
    logMessage('DEBUG', 'api/invoices GET /paid', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/invoices/search?q= — search by invoice number or vendor
router.get('/invoices/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Missing search term' });

    const result = await getInvoiceBySearchTerm(q);
    const invoices = result[0];
    res.json({ invoices });
  } catch (error) {
    logMessage('DEBUG', 'api/invoices GET /search', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/invoices/oracle-status — check status of unpaid invoices in Oracle
router.get('/invoices/oracle-status', async (req, res) => {
  try {
    const { userdata } = res.locals;
    if (!userdata?.library) return res.status(403).json({ error: 'No library assigned to user' });

    const getinvoicedata = await getAllUnpaidInvoices(userdata.library);
    if (!getinvoicedata || getinvoicedata.length === 0) {
      return res.json({ invoices: [] });
    }

    const thisinvoicedata = getinvoicedata[0];
    if (!thisinvoicedata?.length) return res.json({ invoices: [] });

    const invoicenumbers = thisinvoicedata.map((invoice) => ({
      filter: { invoiceNumber: { contains: invoice.invoicenumber } },
    }));
    const invoiceids = thisinvoicedata.map((invoice) => invoice.invoiceid);

    const [requestresults, invoicedata] = await Promise.all([
      checkStatusInOracle(invoicenumbers),
      getAlmaIndividualInvoiceData(invoiceids),
    ]);

    if (!invoicedata?.invoice?.length) return res.json({ invoices: [] });

    const combined = invoicedata.invoice
      .map((invoice, index) => (requestresults[index] ? { ...invoice, ...requestresults[index] } : null))
      .filter(Boolean);

    res.json({ invoices: combined });
  } catch (error) {
    logMessage('DEBUG', 'api/invoices GET /oracle-status', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/invoices/oracle-update — trigger background oracle status check
router.post('/invoices/oracle-update', async (req, res) => {
  try {
    const archiveClean = await archivePaidInvoices();
    if (archiveClean) {
      checkOracleStatus();
    }
    res.json({ ok: true });
  } catch (error) {
    logMessage('DEBUG', 'api/invoices POST /oracle-update', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/invoices/:invoiceId/alma — full Alma invoice data + vendor details
router.get('/invoices/:invoiceId/alma', async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const invoice = await getSingleInvoiceData(invoiceId);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found in Alma' });

    let vendor = null;
    let poLineData = null;
    if (invoice.vendor?.value) {
      [vendor, poLineData] = await Promise.all([
        getVendorData(invoice.vendor.value),
        // getVendorPoLines(invoice.vendor.value),
      ]);
    }

    const enrichedInvoice = enrichInvoiceLineTitles(invoice, poLineData);
    res.json({ invoice: enrichedInvoice, vendor });
  } catch (error) {
    logMessage('DEBUG', 'api/invoices GET /:invoiceId/alma', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/invoices/:invoiceId/payment-status — live payment status from Aggie Enterprise
router.get('/invoices/:invoiceId/payment-status', async (req, res) => {
  try {
    const dbdata = await fetchInvoiceByInvoiceId(req.params.invoiceId);
    const consumerTrackingId = dbdata?.consumerTrackingId || dbdata?.consumertrackingid;
    if (!consumerTrackingId) return res.status(404).json({ error: 'No tracking ID found for this invoice' });
    const results = await checkPayments([{ consumerTrackingId }]);
    res.json({ data: results?.[0] || null });
  } catch (error) {
    logMessage('DEBUG', 'api/invoices GET /:invoiceId/payment-status', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/invoices/:invoiceId/oracle-status — live Oracle payment record
router.get('/invoices/:invoiceId/oracle-status', async (req, res) => {
  try {
    const dbdata = await fetchInvoiceByInvoiceId(req.params.invoiceId);
    if (!dbdata?.invoicenumber) return res.status(404).json({ error: 'Invoice not found in DB' });
    const results = await checkStatusInOracle([{ filter: { invoiceNumber: { contains: dbdata.invoicenumber } } }]);
    res.json({ data: results?.[0]?.data?.scmInvoicePaymentSearch || null });
  } catch (error) {
    logMessage('DEBUG', 'api/invoices GET /:invoiceId/oracle-status', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/invoices/:invoiceId — full invoice detail from DB
router.get('/invoices/:invoiceId', async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const dbdata = await fetchInvoiceByInvoiceId(invoiceId);
    if (!dbdata) return res.status(404).json({ error: 'Invoice not found' });
    res.json({ invoice: dbdata });
  } catch (error) {
    logMessage('DEBUG', 'api/invoices GET /:invoiceId', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
