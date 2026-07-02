import express from 'express';
import { requireAdmin, requireAuth } from '../util/keycloak-auth.js';
import * as controller from '../controllers/admin.js';

const router = express.Router();
const requirePageAuth = requireAuth();

router.use('/admin', requirePageAuth, requireAdmin);
router.get('/admin', controller.getAdminView);
router.get('/admin/users', controller.getAdminViewUsers);
router.get('/admin/add-user', controller.getAdminAddUser);
router.post('/admin/add-user', controller.postAdminAddUser);
router.get('/admin/edit-user/:userId', controller.getAdminEditUser);
router.post('/admin/edit-user/', controller.postAdminEditUser);
router.post('/admin/delete-user/:userId', controller.adminDeleteUser);
router.get('/admin/invoices', controller.getAdminViewInvoices);
router.get('/admin/edit-invoice/:id', controller.getAdminEditInvoice);
router.post('/admin/edit-invoice', controller.postAdminEditInvoice);
router.post('/admin/update-invoice-status', controller.postAdminUpdateInvoiceStatus);
router.post('/admin/delete-invoice/:id', controller.adminDeleteInvoice);
router.get('/token', requirePageAuth, requireAdmin, controller.getAdminCheckToken);
router.get('/roles', requirePageAuth, requireAdmin, controller.getAdmincheckERPRoles);

export default router;
