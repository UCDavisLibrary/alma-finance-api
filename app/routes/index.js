import express from 'express';
import session from 'express-session';
import { fetchUser } from '../controllers/dbcalls.js';
import cas from '../util/cas.js';
import config from '../util/config.js';
import apiInvoiceRoutes from './api/invoices.js';
import apiAdminRoutes from './api/admin.js';
import apiFundRoutes from './api/funds.js';
import apiVendorRoutes from './api/vendors.js';

const router = express.Router();

// Session (required for CAS)
router.use(session({
  secret: config.app.session,
  resave: false,
  saveUninitialized: true,
}));

// Load current user into res.locals for all routes
router.use(async (req, res, next) => {
  const cas_user = req.session[cas.session_name];
  if (cas_user) {
    res.locals.userdata = await fetchUser(cas_user);
    res.locals.isAdmin = false; // role-based gate goes here in Phase 2
  }
  next();
});

// JSON API routes — all require CAS auth; respond with 401 if unauthenticated
router.use('/api', (req, res, next) => {
  const cas_user = req.session[cas.session_name];
  if (!cas_user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
router.use('/api', apiInvoiceRoutes);
router.use('/api', apiAdminRoutes);
router.use('/api', apiFundRoutes);
router.use('/api', apiVendorRoutes);

export default router;
