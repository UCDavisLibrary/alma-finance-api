import { fetchAllVendors, deleteVendor } from './dbcalls.js';
import { logMessage } from '../util/logger.js';

export async function getViewVendors(req, res) {
  try {
    const vendors = await fetchAllVendors();
    res.render('vendor-list', { title: 'View All Vendors', vendors, isUser: true, isAdmin: false });
  } catch (error) {
    logMessage('DEBUG', 'vendors: getViewVendors()', error);
    res.redirect('/');
  }
}

export async function deleteVendorHandler(req, res) {
  const id = req.body.id ?? req.params.vendorId;
  try {
    const result = await deleteVendor(id);
    if (result) {
      logMessage('INFO', `vendors: deleteVendorHandler(). Deleted vendor ${id}`);
      res.redirect('/vendors');
    }
  } catch (error) {
    logMessage('DEBUG', 'vendors: deleteVendorHandler()', error);
  }
}
