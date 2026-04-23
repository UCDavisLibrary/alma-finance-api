import express from 'express';
import cas from '../util/cas.js';
import * as controller from '../controllers/invoices.js';

const router = express.Router();

router.get('/', cas.bounce, controller.getHomepage);
router.get('/preview', cas.bounce, controller.getPreviewPage);
router.post('/preview', cas.bounce, controller.sendSelectedInvoices);
router.get('/invoice/:invoiceId', cas.bounce, controller.getPreviewSingleInvoicePage);
router.get('/oraclestatus', cas.bounce, controller.getOracleStatus);
router.get('/paidinvoices', cas.bounce, controller.viewPaidInvoices);
router.get('/review', cas.bounce, controller.getReviewPage);
router.get('/search', cas.bounce, controller.getSearchPage);
router.post('/search', cas.bounce, controller.postSearchForInvoice);
router.get('/background', controller.checkOracleStatusBackground);
export default router;
