import express from 'express';
import { getAlmaInvoicesReadyToBePaid, getAlmaIndividualInvoiceData, getSingleInvoiceData, getVendorData } from '../../controllers/almaapicalls.js';
import { filterOutSubmittedInvoices, changeFundIDtoCode } from '../../controllers/formatdata.js';
import { checkStatusInOracle, checkPayments } from '../../controllers/graphqlcalls.js';
import { getPaidInvoices, getAllUnpaidInvoices, getInvoiceBySearchTerm, fetchInvoiceByInvoiceId } from '../../controllers/dbcalls.js';
import { enrichInvoiceLineTitles } from '../../controllers/po-lines.js';
import { archivePaidInvoices, checkOracleStatus } from '../../controllers/background-scripts.js';
import { logMessage } from '../../util/logger.js';
import { setActiveLibrary } from '../../util/keycloak-auth.js';

import db from '../../util/database.js';
import { submitInvoice } from '../../controllers/submit-invoices.js';

import { createAttentionScanner } from '../../controllers/scan-attention.js';
import { createLoginAttentionHandler } from '../../controllers/login-attention.js';

const router = express.Router();
router.post('/invoices/attention-check', createLoginAttentionHandler({
  scan: createAttentionScanner({ db, checkPayments, logMessage }),
  count: async library => {
    const [[row]] = await db.execute("SELECT COUNT(*) AS count FROM invoices WHERE `library` = ? AND status = 'NEEDS_ATTENTION'", [library]);
    return row.count;
  },
  logMessage,
}));

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

// Both send paths enforce the active library and serialize requests per invoice.
async function sendInvoices(req, res, resubmit = false) {
  try {
    const library = res.locals.userdata?.library;
    if (!library) return res.status(403).json({ error: 'No library assigned to user' });
    const invoiceids = resubmit ? [req.params.invoiceId] : req.body?.invoiceids;
    if (!Array.isArray(invoiceids) || !invoiceids.length || invoiceids.some(id => typeof id !== 'string' || !/^\d+$/.test(id))) {
      return res.status(400).json({ error: 'Provide an array of Alma invoice IDs' });
    }
    const results = [];
    for (const id of new Set(invoiceids)) results.push(await submitInvoice(id, library, resubmit));
    const failed = results.some(result => result.error);
    res.status(failed ? 502 : 200).json({ ...(failed ? { error: 'One or more invoices failed to submit' } : {}), results });
  } catch (error) {
    logMessage('WARNING', 'Invoice submission failed', error.message);
    res.status(500).json({ error: error.message });
  }
}
router.post('/invoices/send', (req, res) => sendInvoices(req, res));
router.post('/invoices/:invoiceId/resubmit', (req, res) => sendInvoices(req, res, true));

router.get('/invoices/needs-attention', async (req, res) => {
  try {
    const library = res.locals.userdata?.library;
    if (!library) return res.status(403).json({ error: 'No library assigned to user' });
    const [invoices] = await db.execute("SELECT * FROM invoices WHERE `library` = ? AND status = 'NEEDS_ATTENTION' ORDER BY failureDetectedAt DESC", [library]);
    res.json({ invoices });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get('/invoices/:invoiceId/attempts', async (req, res) => {
  try {
    const library = res.locals.userdata?.library;
    if (!library) return res.status(403).json({ error: 'No library assigned to user' });
    const [attempts] = await db.execute('SELECT * FROM invoice_submission_attempts WHERE invoiceid = ? AND `library` = ? ORDER BY id DESC', [req.params.invoiceId, library]);
    res.json({ attempts });
  } catch (error) { res.status(500).json({ error: error.message }); }
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
    await archivePaidInvoices();
    await checkOracleStatus();
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

    const [vendor, enrichedInvoice] = await Promise.all([
      invoice.vendor?.value ? getVendorData(invoice.vendor.value) : Promise.resolve(null),
      enrichInvoiceLineTitles(invoice),
    ]);

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
