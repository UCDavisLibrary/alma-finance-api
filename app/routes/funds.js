import express from 'express';
import { requireAuth } from '../util/keycloak-auth.js';
import * as controller from '../controllers/funds.js';

const router = express.Router();
const requirePageAuth = requireAuth();

router.get('/funds', requirePageAuth, controller.getViewFunds);
router.post('/delete-fund/:fundId', requirePageAuth, controller.deleteFundHandler);

export default router;
