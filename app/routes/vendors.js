import express from 'express';
import cas from '../util/cas.js';
import * as controller from '../controllers/vendors.js';

const router = express.Router();

router.get('/vendors', cas.bounce, controller.getViewVendors);
router.post('/delete-vendor/:vendorId', cas.bounce, controller.deleteVendorHandler);

export default router;
