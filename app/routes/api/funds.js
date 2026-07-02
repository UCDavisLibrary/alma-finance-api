import express from 'express';
import { fetchAllFunds, deleteFund } from '../../controllers/dbcalls.js';
import { logMessage } from '../../util/logger.js';
import { requireAdmin } from '../../util/keycloak-auth.js';

const router = express.Router();

router.use(requireAdmin);

// GET /api/funds
router.get('/funds', async (req, res) => {
  try {
    const funds = await fetchAllFunds();
    // fetchAllFunds already returns the rows array
    res.json({ funds: funds || [] });
  } catch (error) {
    logMessage('DEBUG', 'api/funds GET /', error.message);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/funds/:id
router.delete('/funds/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteFund(id);
    if (!result) return res.status(500).json({ error: 'Failed to delete fund' });
    res.json({ ok: true });
  } catch (error) {
    logMessage('DEBUG', 'api/funds DELETE /:id', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
