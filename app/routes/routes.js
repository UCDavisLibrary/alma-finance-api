const express = require('express');
const app = express();
var session = require('express-session');
var CASAuthentication = require('node-cas-authentication');
const controller = require('../controllers/controller')

const router = express.Router();

// Set up an Express session, which is required for CASAuthentication.
router.use(
    session({
      secret: process.env.EXPRESS_SESSION,
      resave: false,
      saveUninitialized: true,
    })
  );
  
// set cas variables
var cas = new CASAuthentication({
cas_url: process.env.CAS_URL,
service_url: process.env.APP_URL,
// cas_version: '3.0',
// renew: false,
// is_dev_mode: false,
// dev_mode_user: '',
// dev_mode_info: {},
// session_name: 'cas_user',
// session_info: 'cas_userinfo',
// destroy_session: false,
// return_to: 'http://localhost:9999',
});



router.get('/', controller.getHomepage );

router.get('/checkstatus', controller.getCheckStatus);

router.get('/datasent', controller.getDataSentPage);
  
// router.get('/preview', controller.getPreviewPage);

// router.post('/preview', controller.sendSelectedInvoices);

router.get('/preview/:invoiceId', controller.getPreviewSingleInvoicePage);

router.get('/previewcomplete', controller.getPreviewCompletePage);
  
router.get('/previewjson', controller.getPreviewJSON);

// router.get('/review', controller.getReviewPage);

// router.get('/senddata', controller.getSendPage);


module.exports = router;