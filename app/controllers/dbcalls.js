import Invoice from '../models/invoice.js';
import Token from '../models/token.js';
import Fund from '../models/fund.js';
import Vendor from '../models/vendor.js';
import { logMessage } from '../util/logger.js';

export async function postAddInvoice(number, id, trackingid, library, requestbody) {
  try {
    const responsebody = typeof requestbody === 'string' ? requestbody : JSON.stringify(requestbody);
    const invoice = new Invoice(number, id, trackingid, library, responsebody);
    await invoice.save();
    logMessage('INFO', `dbcalls: postAddInvoice(). Invoice ${id} added`);
    return true;
  } catch (err) {
    logMessage('DEBUG', 'dbcalls: postAddInvoice()', err.message);
    return false;
  }
}

export function getSubmittedInvoices(library) {
  return Invoice.fetchAll(library);
}

export function getInvoiceIDs(library) {
  return Invoice.fetchInvoiceIDs(library);
}

export function getInvoiceNumbers(library) {
  return Invoice.fetchInvoiceNumbers(library);
}

export function getUnpaidInvoiceNumbers(library) {
  return Invoice.fetchUnpaidInvoiceNumbers(library);
}

export function getAllUnpaidInvoices(library) {
  return Invoice.fetchAllUnpaidInvoices(library);
}

export function getAllInvoiceNumbers() {
  return Invoice.fetchAllInvoiceNumbers();
}

export function getAllUnpaidInvoiceNumbers() {
  return Invoice.fetchAllUnpaidInvoices();
}

export function getPaidInvoices(library) {
  return Invoice.fetchPaidInvoices(library);
}

export function getAllInvoicesAdmin() {
  return Invoice.fetchAllAdmin();
}

export function getInvoiceBySearchTerm(searchterm) {
  return Invoice.fetchBySearchTerm(searchterm);
}

export function getInvoiceById(id) {
  try {
    return Invoice.findById(id);
  } catch (error) {
    logMessage('DEBUG', 'dbcalls: getInvoiceById()', error.message);
  }
}

export function postSaveTodaysToken(token) {
  const tokenObj = new Token(token);
  tokenObj.save()
    .then(() => logMessage('INFO', 'Saved Token'))
    .catch((err) => logMessage('DEBUG', 'dbcalls: postSaveTodaysToken()', err.message));
}

export async function fetchTodaysToken() {
  try {
    const response = await Token.fetchOne();
    if (response) {
      return response[0][0].token;
    }
  } catch (error) {
    logMessage('DEBUG', 'dbcalls: fetchTodaysToken()', error.message);
  }
}

export async function fetchAllFunds() {
  try {
    const response = await Fund.fetchAll();
    if (response) return response[0];
  } catch (error) {
    logMessage('DEBUG', 'dbcalls: fetchAllFunds()', error.message);
  }
}

export async function deleteFund(id) {
  try {
    const response = await Fund.deleteById(id);
    if (response) {
      logMessage('INFO', `dbcalls: deleteFund(). Fund ${id} deleted`);
      return true;
    }
  } catch (error) {
    logMessage('DEBUG', 'dbcalls: deleteFund()', error.message);
  }
}

export async function deleteFundByFundId(id) {
  try {
    const response = await Fund.deleteByFundId(id);
    if (response) {
      logMessage('INFO', `dbcalls: deleteFundByFundId(). Fund ${id} deleted`);
      return true;
    }
  } catch (error) {
    logMessage('DEBUG', 'dbcalls: deleteFundByFundId()', error.message);
  }
}

export async function fetchAllVendors() {
  try {
    const response = await Vendor.fetchAll();
    if (response) return response[0];
  } catch (error) {
    logMessage('DEBUG', 'dbcalls: fetchAllVendors()', error.message);
  }
}

export async function deleteVendor(id) {
  try {
    const response = await Vendor.deleteById(id);
    if (response) {
      logMessage('INFO', `dbcalls: deleteVendor(). Vendor ${id} deleted`);
      return true;
    }
  } catch (error) {
    logMessage('DEBUG', 'dbcalls: deleteVendor()', error.message);
  }
}

export async function deleteInvoice(id) {
  try {
    const response = await Invoice.deleteById(id);
    if (response) {
      logMessage('INFO', `dbcalls: deleteInvoice(). Invoice ${id} deleted`);
      return true;
    }
  } catch (error) {
    logMessage('DEBUG', 'dbcalls: deleteInvoice()', error.message);
  }
}

export async function postEditInvoice(invoicenumber, invoiceid, consumerTrackingId, library, status, responsebody, datetime, id) {
  try {
    const responsebodyjson = JSON.parse(responsebody);
    const invoiceupdated = await Invoice.update(invoicenumber, invoiceid, consumerTrackingId, library, status, responsebodyjson, datetime, id);
    if (invoiceupdated) {
      logMessage('INFO', `dbcalls: postEditInvoice(). Invoice ${invoicenumber} updated`);
      return true;
    }
  } catch (error) {
    logMessage('DEBUG', 'dbcalls: postEditInvoice()', error.message);
  }
}

export async function postUpdateInvoiceStatus(status, id) {
  try {
    const response = await Invoice.updateInvoiceStatus(status, id);
    if (response) return true;
  } catch (error) {
    logMessage('DEBUG', 'dbcalls: postUpdateInvoiceStatus()', error.message);
  }
}

export async function updateStatus(status, responsebody, invoiceid) {
  try {
    const response = await Invoice.updateStatus(status, responsebody, invoiceid);
    if (response) return true;
  } catch (error) {
    logMessage('DEBUG', 'dbcalls: updateStatus()', error.message);
  }
}

export async function fetchFundCodeFromId(id) {
  try {
    const response = await Fund.findCodeById(id);
    if (!response || !response[0] || response[0].length === 0) return null;
    return response[0][0].fundCode;
  } catch (error) {
    logMessage('DEBUG', 'dbcalls: fetchFundCodeFromId()', error.message);
    return null;
  }
}

export async function saveFund(fundId, fundCode) {
  try {
    const fund = new Fund(fundId, fundCode);
    const fundsaved = await fund.save();
    if (fundsaved) {
      logMessage('INFO', `dbcalls: saveFund(). Fund ${fundId} saved`);
      return true;
    }
  } catch (error) {
    logMessage('DEBUG', 'dbcalls: saveFund()', error.message);
  }
}

export async function fetchVendorDataFromId(vendorId) {
  try {
    const response = await Vendor.fetchVendorDataFromId(vendorId);
    if (!response || !response[0] || response[0].length === 0) return undefined;
    return response[0][0].vendorData;
  } catch (error) {
    logMessage('DEBUG', 'dbcalls: fetchVendorDataFromId()', error.message);
  }
}

export async function saveVendor(vendorId, vendorData) {
  try {
    const vendor = new Vendor(vendorId, vendorData);
    const vendorsaved = await vendor.save();
    if (vendorsaved) {
      logMessage('INFO', `dbcalls: saveVendor(). Vendor ${vendorId} saved`);
      return true;
    }
  } catch (error) {
    logMessage('DEBUG', 'dbcalls: saveVendor()', error.message);
  }
}

export async function fetchInvoiceByInvoiceId(invoiceId) {
  try {
    const response = await Invoice.findByInvoiceId(invoiceId);
    if (response) return response[0][0];
  } catch (error) {
    logMessage('DEBUG', 'dbcalls: fetchInvoiceByInvoiceId()', error.message);
  }
}
