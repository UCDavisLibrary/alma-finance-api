import express from 'express';
import { requireAuth } from '../util/keycloak-auth.js';
import * as controller from '../controllers/invoices.js';

const router = express.Router();
const requirePageAuth = requireAuth();

router.get('/', requirePageAuth, controller.getHomepage);
router.get('/preview', requirePageAuth, controller.getPreviewPage);
router.post('/preview', requirePageAuth, controller.sendSelectedInvoices);
router.get('/invoice/:invoiceId', requirePageAuth, controller.getPreviewSingleInvoicePage);
router.get('/oraclestatus', requirePageAuth, controller.getOracleStatus);
router.get('/paidinvoices', requirePageAuth, controller.viewPaidInvoices);
router.get('/review', requirePageAuth, controller.getReviewPage);
router.get('/search', requirePageAuth, controller.getSearchPage);
router.post('/search', requirePageAuth, controller.postSearchForInvoice);
router.get('/background', controller.checkOracleStatusBackground);
export default router;
