import express from 'express';
import cas from '../util/cas.js';
import * as controller from '../controllers/admin.js';

const router = express.Router();

router.get('/admin', cas.bounce, controller.getAdminView);
router.get('/admin/users', cas.bounce, controller.getAdminViewUsers);
router.get('/admin/add-user', cas.bounce, controller.getAdminAddUser);
router.post('/admin/add-user', cas.bounce, controller.postAdminAddUser);
router.get('/admin/edit-user/:userId', cas.bounce, controller.getAdminEditUser);
router.post('/admin/edit-user/', cas.bounce, controller.postAdminEditUser);
router.post('/admin/delete-user/:userId', cas.bounce, controller.adminDeleteUser);
router.get('/admin/invoices', cas.bounce, controller.getAdminViewInvoices);
router.get('/admin/edit-invoice/:id', cas.bounce, controller.getAdminEditInvoice);
router.post('/admin/edit-invoice', cas.bounce, controller.postAdminEditInvoice);
router.post('/admin/update-invoice-status', cas.bounce, controller.postAdminUpdateInvoiceStatus);
router.post('/admin/delete-invoice/:id', cas.bounce, controller.adminDeleteInvoice);
router.get('/token', cas.bounce, controller.getAdminCheckToken);
router.get('/roles', cas.bounce, controller.getAdmincheckERPRoles);

export default router;
