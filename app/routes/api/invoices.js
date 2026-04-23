import express from 'express';
import { getAlmaInvoicesReadyToBePaid, getAlmaIndividualInvoiceData, setSelectedData, getSingleInvoiceData, getVendorData } from '../../controllers/almaapicalls.js';
import { reformatAlmaInvoiceforAPI, filterOutSubmittedInvoices } from '../../controllers/formatdata.js';
import { aggieEnterprisePaymentRequest, checkStatusInOracle, checkPayments } from '../../controllers/graphqlcalls.js';
import { postAddInvoice, getPaidInvoices, getAllUnpaidInvoices, getInvoiceBySearchTerm, fetchInvoiceByInvoiceId } from '../../controllers/dbcalls.js';
import { archivePaidInvoices, checkOracleStatus } from '../../controllers/background-scripts.js';
import { logMessage } from '../../util/logger.js';

const router = express.Router();

async function fetchAllInvoices(library) {
  const [data1, data2] = await Promise.all([
    getAlmaInvoicesReadyToBePaid(library, 0),
    getAlmaInvoicesReadyToBePaid(library, 100),
  ]);
  return { invoice: [...data1.invoice, ...data2.invoice] };
}

// GET /api/me — current user info
router.get('/me', (req, res) => {
  const { userdata } = res.locals;
  if (!userdata) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ user: userdata });
});

// GET /api/invoices/pending — invoices ready to be paid from Alma (filtered)
router.get('/invoices/pending', async (req, res) => {
  try {
    const { userdata } = res.locals;
    if (!userdata?.library) return res.status(403).json({ error: 'No library assigned to user' });

    const totaldata = await fetchAllInvoices(userdata.library);
    const data = await filterOutSubmittedInvoices(totaldata, userdata.library);
    res.json(data);
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
    const step1 = await setSelectedData(invoiceids);
    const variableInputs = await reformatAlmaInvoiceforAPI(step1);
    const consumerTrackingIds = variableInputs.map((v) => v.data.header.consumerTrackingId);
    const requestresults = await aggieEnterprisePaymentRequest(variableInputs);

    if (!requestresults) return res.status(500).json({ error: 'No response from payment system' });

    const invoicedata = await getAlmaIndividualInvoiceData(invoiceids);
    const results = [];

    for (let i = 0; i < invoicedata.invoice.length; i++) {
      const invoice = invoicedata.invoice[i];
      const request = requestresults[i];

      if (request?.errors?.length > 0) {
        logMessage('DEBUG', 'api/invoices POST /send error', request.errors);
        results.push({ invoice, error: request.errors });
        continue;
      }

      if (
        request?.data?.scmInvoicePaymentCreate?.requestStatus?.requestStatus === 'PENDING' ||
        request?.data?.scmInvoicePaymentCreate?.validationResults?.errorMessages[0]?.includes('A request already exists for your consumerId and consumerTrackingId')
      ) {
        postAddInvoice(invoice.number, invoice.id, consumerTrackingIds[i], library, request.data);
      }

      results.push({ invoice, request: request?.data });
    }

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
    if (invoice.vendor?.value) {
      vendor = await getVendorData(invoice.vendor.value);
    }

    res.json({ invoice, vendor });
  } catch (error) {
    logMessage('DEBUG', 'api/invoices GET /:invoiceId/alma', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/invoices/:invoiceId/payment-status — live payment status from Aggie Enterprise
router.get('/invoices/:invoiceId/payment-status', async (req, res) => {
  try {
    const dbdata = await fetchInvoiceByInvoiceId(req.params.invoiceId);
    if (!dbdata?.consumertrackingid) return res.status(404).json({ error: 'No tracking ID found for this invoice' });
    const results = await checkPayments([{ consumerTrackingId: dbdata.consumertrackingid }]);
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
