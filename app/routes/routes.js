const express = require('express');
const app = express();
var session = require('express-session');
var CASAuthentication = require('node-cas-authentication');
const controller = require('../controllers/route-controllers');

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

router.get('/', cas.bounce, controller.getHomepage );

// router.get('/checkstatus', cas.bounce, controller.getCheckStatus);

router.get('/oraclestatus', cas.bounce, controller.getOracleStatus);

router.get('/paidinvoices', cas.bounce, controller.viewPaidInvoices);
  
router.get('/preview', cas.bounce, controller.getPreviewPage);

router.post('/preview', cas.bounce, controller.sendSelectedInvoices);

router.get('/invoice/:invoiceId', cas.bounce, controller.getPreviewSingleInvoicePage);

// router.get('/previewcomplete', cas.bounce, controller.getPreviewCompletePage);
  
// router.get('/previewjson', cas.bounce, controller.getPreviewJSON);

router.get('/review', cas.bounce, controller.getReviewPage);

router.get('/token', cas.bounce, controller.getAdminCheckToken);

router.get('/roles', cas.bounce, controller.getAdmincheckERPRoles);

// router.get('/logout', cas.logout, controller.getLogout);

// router.get('/login', cas.bounce, controller.getLogin);

// router.get('/loginfailed', cas.bounce, controller.getLoginFailed);

router.get('/admin', cas.bounce, controller.getAdminView);

// router.get('/admin/manageusers', cas.bounce, controller.getAdminManageUsers);

router.get('/admin/users', cas.bounce, controller.getAdminViewUsers);

router.get('/admin/add-user', cas.bounce, controller.getAdminAddUser);

router.post('/admin/add-user', controller.postAdminAddUser);

router.get('/background', controller.checkOracleStatusBackground);

router.get(
  '/admin/edit-user/:userId',
  cas.bounce,
  controller.getAdminEditUser
);

router.post('/admin/edit-user/', controller.postAdminEditUser);

router.get('/admin/funds', cas.bounce, controller.getAdminViewFunds);

router.post('/admin/delete-fund/:fundId', controller.adminDeleteFund);

router.get('/admin/vendors', cas.bounce, controller.getAdminViewVendors);

router.post('/admin/delete-vendor/:vendorId', controller.adminDeleteVendor);

router.get('*', controller.get404);

module.exports = router;