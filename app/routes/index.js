import express from 'express';
import session from 'express-session';
import config from '../util/config.js';
import { attachUser, authRouter, requireAuth } from '../util/keycloak-auth.js';
import apiInvoiceRoutes from './api/invoices.js';
import apiAdminRoutes from './api/admin.js';
import apiFundRoutes from './api/funds.js';
import apiVendorRoutes from './api/vendors.js';

const router = express.Router();

// Session (required for Keycloak OIDC login state)
router.use(session({
  secret: config.app.session,
  resave: false,
  saveUninitialized: true,
}));

router.use(authRouter);

// Load current Keycloak user into res.locals for all routes.
router.use(attachUser);

// JSON API routes all require Keycloak auth; respond with 401 if unauthenticated.
router.use('/api', requireAuth({ api: true }));
router.use('/api', apiInvoiceRoutes);
router.use('/api', apiFundRoutes);
router.use('/api', apiVendorRoutes);
router.use('/api', apiAdminRoutes);

export default router;
