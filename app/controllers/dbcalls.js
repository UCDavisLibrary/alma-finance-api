const Invoice = require('../models/invoice');
const Token = require('../models/token');
const User = require('../models/user');
const Fund = require('../models/fund');
const Vendor = require('../models/vendor');
const { logMessage } = require('../util/logger');

exports.postAddInvoice = (number, id, trackingid, library, requestbody) => {
    const invoice = new Invoice(number, id, trackingid, library, requestbody);
    invoice.save()
      .then(() => {
        logMessage('INFO',`dbcalls: postAddInvoice(). Invoice ${id} added`);
        })
      .catch(err => logMessage('DEBUG',"dbcalls: postAddInvoice()", err.message));
  };

  exports.getSubmittedInvoices = (library) => {
    return Invoice.fetchAll(library);
  }

  exports.getInvoiceIDs = (library) => {
    return Invoice.fetchInvoiceIDs(library);
  }

  exports.getInvoiceNumbers = (library) => {
    return Invoice.fetchInvoiceNumbers(library);
  }

  exports.getUnpaidInvoiceNumbers = (library) => {
    return Invoice.fetchUnpaidInvoiceNumbers(library);
  }

  exports.getAllUnpaidInvoices = (library) => {
    return Invoice.fetchAllUnpaidInvoices(library);
  }

  exports.getAllInvoiceNumbers = () => {
    return Invoice.fetchAllInvoiceNumbers();
  }

  exports.getAllUnpaidInvoiceNumbers = () => {
    return Invoice.fetchAllUnpaidInvoices();
  }

  exports.getPaidInvoices = (library) => {
    return Invoice.fetchPaidInvoices(library);
  }

  exports.getAllInvoicesAdmin = () => {
    return Invoice.fetchAllAdmin();
  }

  exports.getInvoiceBySearchTerm = (searchterm) => {
    return Invoice.fetchBySearchTerm(searchterm);
  }

exports.getInvoiceById = (id) => {
   try {
    const response = Invoice.findById(id);
    if (response) {
      return response; 
    }
    }
    catch (error) {
      logMessage('DEBUG',"dbcalls: getInvoiceById()", error.message);
    }
  }

exports.postSaveTodaysToken = (token) => {
  const tokenObj = new Token(token);
  tokenObj.save()
    .then(() => {
      logMessage('INFO','Saved Token');
      })
    .catch(err => logMessage('DEBUG',"dbcalls: postSaveTodaysToken()", err.message));
}

exports.fetchTodaysToken = async () => {

  try {
    const response = await Token.fetchOne();
    if (response) {
      const token = response[0][0].token;
      logMessage('INFO',`token generated`);
      return token;
    }
  }
  catch (error) {
    logMessage('DEBUG',"dbcalls: fetchTodaysToken()", error.message);
  }
}

exports.postAddUser = async (firstname, lastname, email, kerberos, library) => {
  const user = new User(firstname, lastname, email, kerberos, library);

  try {
      const usersaved = await user.save();
      if (usersaved) {
        logMessage('INFO',`dbcalls: postAddUser(). User ${kerberos} added`);
        return true;
      };
  }
  catch (error) {
      logMessage('DEBUG',"dbcalls: postAddUser()", error.message);
  }
};

exports.postEditUser = async (firstname, lastname, email, kerberos, library, id) => {

  try {
      const userupdated = await User.update(firstname, lastname, email, kerberos, library, id);
      if (userupdated) {
      logMessage('INFO',`dbcalls: postEditUser(). User ${id} updated`);
          return true;
      };
  }
  catch (error) {
      logMessage('DEBUG',"dbcalls: postEditUser()", error.message);
  }
};

exports.deleteUser = async (id) => {
  try {
    const response = await User.deleteById(id);
    if (response) {
      logMessage('INFO',`dbcalls: deleteUser(). User ${id} deleted`);
      return true;
    }
  }
  catch (error) {
    logMessage('DEBUG',"dbcalls: deleteUser()", error.message);
  }
}

exports.fetchAllUsers = async () => {
    try {
      const response = await User.fetchAll();
      if (response) {
        const users = response[0];
        return users;
      }
    }
    catch (error) {
      logMessage('DEBUG',"dbcalls: fetchAllUsers()", error.message);
    }
  }

exports.fetchAllFunds = async () => {
  try {
    const response = await Fund.fetchAll();
    if (response) {
      const users = response[0];
      return users;
    }
  }
  catch (error) {
    logMessage('DEBUG',"dbcalls: fetchAllFunds()", error.message);
  }
}

exports.deleteFund = async (id) => {
  try {
    const response = await Fund.deleteById(id);
    if (response) {
      logMessage('INFO',`dbcalls: deleteFund(). Fund ${id} deleted`);
      return true;
    }
  }
  catch (error) {
    logMessage('DEBUG',"dbcalls: deleteFund()", error.message);
  }
}

exports.deleteFundByFundId = async (id) => {
  try {
    const response = await Fund.deleteByFundId(id);
    if (response) {
      logMessage('INFO',`dbcalls: deleteFundByFundId(). Fund ${id} deleted`);
      return true;
    }
  }
  catch (error) {
    logMessage('DEBUG',"dbcalls: deleteFundByFundId()", error.message);
  }
}

exports.fetchAllVendors = async () => {
  try {
    const response = await Vendor.fetchAll();
    if (response) {
      const users = response[0];
      return users;
    }
  }
  catch (error) {
    logMessage('DEBUG',"dbcalls: fetchAllVendors()", error.message);
  }
}

exports.deleteVendor = async (id) => {
  try {
    const response = await Vendor.deleteById(id);
    if (response) {
      logMessage('INFO',`dbcalls: deleteVendor(). Vendor ${id} deleted`);
      return true;
    }
  }
  catch (error) {
    logMessage('DEBUG',"dbcalls: deleteVendor()", error.message);
  }
}

exports.deleteInvoice = async (id) => {
  try {
    const response = await Invoice.deleteById(id);
    if (response) {
      logMessage('INFO',`dbcalls: deleteInvoice(). Invoice ${id} deleted`);
      return true;
    }
  }
  catch (error) {
    logMessage('DEBUG',"dbcalls: deleteInvoice()", error.message);
  }
}

exports.postEditInvoice = async (invoicenumber, invoiceid, consumerTrackingId, library, status, responsebody, datetime, id) => {
  const responsebodyjson = JSON.parse(responsebody);
  try {
      const invoiceupdated = await Invoice.update(invoicenumber, invoiceid, consumerTrackingId, library, status, responsebodyjson, datetime, id);
      if (invoiceupdated) {
          logMessage('INFO',`dbcalls: postEditInvoice(). Invoice ${invoicenumber} updated`);
          return true;
      };
  }
  catch (error) {
      logMessage('DEBUG',"dbcalls: postEditInvoice()", error.message);
  }
};

exports.postUpdateInvoiceStatus = async (status, id) => {
  try {
    const response = await Invoice.updateInvoiceStatus(status, id);
    if (response) {
      return true;
    }
  }
  catch (error) {
    logMessage('DEBUG',"dbcalls: postUpdateInvoiceStatus()", error.message);
  }
}

exports.checkLibrary = async (kerberos) => {
    
      try {
        const response = await User.checkLibrary(kerberos);
        if (response) {
          const library = response[0][0].library;
          return library;
        }
      }
      catch (error) {
        logMessage('DEBUG',"dbcalls: checkLibrary()", error.message);
      }
    }

exports.fetchUser = async (id) => {
    
        try {
          const response = await User.findByKerberos(id);
          if (response) {
            const user = response[0][0];
            return user;
          }
        }
        catch (error) {
          logMessage('DEBUG',"dbcalls: fetchUser()", error.message);
        }
      }

exports.checkIfUserExists = async (kerberos) => {
                                                      
    try {
      const response = await User.findByID(kerberos);
      if (response && response[0][0] === kerberos) {
        return true;
      }
    }
    catch (error) {
      logMessage('DEBUG',"dbcalls: checkIfUserExists()", error.message);
    }
  }      
  
exports.updateStatus = async (status, responsebody, invoiceid) => {
  try {
    const response = await Invoice.updateStatus(status, responsebody, invoiceid);
    if (response) {
      return true;
    }
  }
  catch (error) {
    logMessage('DEBUG',"dbcalls: updateStatus()", error.message);
  }
}

exports.fetchFundCodeFromId = async (id) => {
  try {
    const response = await Fund.findCodeById(id);
    if (response) {
      const fund = response[0][0].fundCode;
      return fund;
    }
  }
  catch (error) {
    logMessage('DEBUG',"dbcalls: fetchFundCodeFromId()", error.message);
  }
}

exports.saveFund = async (fundId, fundCode) => {
  const fund = new Fund(fundId, fundCode);

  try {
      const fundsaved = await fund.save();
      if (fundsaved) {
          logMessage('INFO',`dbcalls: saveFund(). Fund ${fundId} saved`);
          return true;
      };
  }
  catch (error) {
      logMessage('DEBUG',"dbcalls: saveFund()", error.message);
  }
};

exports.fetchVendorDataFromId = async (vendorId) => {
  try {
    const response = await Vendor.fetchVendorDataFromId(vendorId);
    if (response) {
      const vendor = response[0][0].vendorData;
      return vendor;
    }
  }
  catch (error) {
    logMessage('DEBUG',"dbcalls: fetchVendorDataFromId()", error.message);
  }
}

exports.saveVendor = async (vendorId, vendorData) => {
  const vendor = new Vendor(vendorId, vendorData);
  try {
      const vendorsaved = await vendor.save();
      if (vendorsaved) {
          logMessage('INFO',`dbcalls: saveVendor(). Vendor ${vendorId} saved`);
          return true;
      };
  }
  catch (error) {
      logMessage('DEBUG',"dbcalls: saveVendor()", error.message);
  }
};


exports.fetchInvoiceByInvoiceId = async (invoiceId) => {
  try {
    const response = await Invoice.findByInvoiceId(invoiceId);
    if (response) {
      const invoice = response[0][0];
      return invoice;
    }
  }
  catch (error) {
    logMessage('DEBUG',"dbcalls: fetchInvoiceByInvoiceId()", error.message);
  }
}