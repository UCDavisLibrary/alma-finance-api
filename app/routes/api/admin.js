import express from 'express';
import {
  fetchAllUsers,
  postAddUser,
  postEditUser,
  deleteUser,
  getAllInvoicesAdmin,
  getInvoiceById,
  postEditInvoice,
  postUpdateInvoiceStatus,
  deleteInvoice,
} from '../../controllers/dbcalls.js';
import User from '../../models/user.js';
import { logMessage } from '../../util/logger.js';
import { requireAdmin } from '../../util/keycloak-auth.js';

const router = express.Router();

router.use(requireAdmin);

// GET /api/admin/users — all users
router.get('/admin/users', async (req, res) => {
  try {
    const users = await fetchAllUsers();
    res.json({ users: users || [] });
  } catch (error) {
    logMessage('DEBUG', 'api/admin GET /users', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/users — create user
router.post('/admin/users', async (req, res) => {
  try {
    const { firstname, lastname, email, kerberos, library } = req.body;
    const result = await postAddUser(firstname, lastname, email, kerberos, library);
    if (!result) return res.status(500).json({ error: 'Failed to add user' });
    res.json({ ok: true });
  } catch (error) {
    logMessage('DEBUG', 'api/admin POST /users', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/users/:userId — single user
router.get('/admin/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await User.findByID(userId);
    const user = result?.[0]?.[0];
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (error) {
    logMessage('DEBUG', 'api/admin GET /users/:userId', error.message);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/admin/users/:userId — update user
router.put('/admin/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstname, lastname, email, kerberos, library } = req.body;
    const result = await postEditUser(firstname, lastname, email, kerberos, library, userId);
    if (!result) return res.status(500).json({ error: 'Failed to update user' });
    res.json({ ok: true });
  } catch (error) {
    logMessage('DEBUG', 'api/admin PUT /users/:userId', error.message);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/admin/users/:userId — delete user
router.delete('/admin/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await deleteUser(userId);
    if (!result) return res.status(500).json({ error: 'Failed to delete user' });
    res.json({ ok: true });
  } catch (error) {
    logMessage('DEBUG', 'api/admin DELETE /users/:userId', error.message);
    res.status(500).json({ error: error.message });
  }
});

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
