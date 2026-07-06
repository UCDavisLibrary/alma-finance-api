import express from 'express';
import {
  getAllInvoicesAdmin,
  getInvoiceById,
  postEditInvoice,
  postUpdateInvoiceStatus,
  deleteInvoice,
} from '../../controllers/dbcalls.js';
import { logMessage } from '../../util/logger.js';
import { requireAdmin } from '../../util/keycloak-auth.js';

const router = express.Router();

router.use(requireAdmin);

// GET /api/admin/invoices — all invoices (admin)
router.get('/admin/invoices', async (req, res) => {
  try {
    const result = await getAllInvoicesAdmin();
    // getAllInvoicesAdmin returns raw mysql2 result [rows, fields]
    res.json({ invoices: result[0] || [] });
  } catch (error) {
    logMessage('DEBUG', 'api/admin GET /invoices', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/invoices/:id — single invoice (admin)
router.get('/admin/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getInvoiceById(id);
    const invoice = result?.[0]?.[0];
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json({ invoice });
  } catch (error) {
    logMessage('DEBUG', 'api/admin GET /invoices/:id', error.message);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/admin/invoices/:id — update invoice (admin)
router.put('/admin/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { invoicenumber, invoiceid, consumerTrackingId, status, library, responsebody, datetime } = req.body;
    const result = await postEditInvoice(invoicenumber, invoiceid, consumerTrackingId, library, status, responsebody, datetime, id);
    if (!result) return res.status(500).json({ error: 'Failed to update invoice' });
    res.json({ ok: true });
  } catch (error) {
    logMessage('DEBUG', 'api/admin PUT /invoices/:id', error.message);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/admin/invoices/:id/status — update invoice status only
router.patch('/admin/invoices/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await postUpdateInvoiceStatus(status, id);
    if (!result) return res.status(500).json({ error: 'Failed to update status' });
    res.json({ ok: true });
  } catch (error) {
    logMessage('DEBUG', 'api/admin PATCH /invoices/:id/status', error.message);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/admin/invoices/:id — delete invoice (admin)
router.delete('/admin/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteInvoice(id);
    if (!result) return res.status(500).json({ error: 'Failed to delete invoice' });
    res.json({ ok: true });
  } catch (error) {
    logMessage('DEBUG', 'api/admin DELETE /invoices/:id', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
