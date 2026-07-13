import express from 'express';
import { fetchAllVendors, deleteVendor } from '../../controllers/dbcalls.js';
import { logMessage } from '../../util/logger.js';

const router = express.Router();

// GET /api/vendors
router.get('/vendors', async (req, res) => {
  try {
    const vendors = await fetchAllVendors();
    // fetchAllVendors already returns the rows array
    res.json({ vendors: vendors || [] });
  } catch (error) {
    logMessage('DEBUG', 'api/vendors GET /', error.message);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/vendors/:id
router.delete('/vendors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteVendor(id);
    if (!result) return res.status(500).json({ error: 'Failed to delete vendor' });
    res.json({ ok: true });
  } catch (error) {
    logMessage('DEBUG', 'api/vendors DELETE /:id', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
