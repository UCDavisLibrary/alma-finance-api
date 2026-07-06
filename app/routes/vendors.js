import express from 'express';
import { requireAuth } from '../util/keycloak-auth.js';
import * as controller from '../controllers/vendors.js';

const router = express.Router();
const requirePageAuth = requireAuth();

router.get('/vendors', requirePageAuth, controller.getViewVendors);
router.post('/delete-vendor/:vendorId', requirePageAuth, controller.deleteVendorHandler);

export default router;
