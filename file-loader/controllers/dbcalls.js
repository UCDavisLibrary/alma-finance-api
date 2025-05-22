const Invoice = require('../models/invoice');
const Token = require('../models/token');
const User = require('../models/user');
const Fund = require('../models/fund');
const Vendor = require('../models/vendor');
const { logMessage } = require('../util/logger');

exports.postAddInvoice = (number, id, library, requestbody) => {
    const invoice = new Invoice(number, id, library, requestbody);
    invoice.save()
      .then(() => {
        logMessage('INFO','Saved Invoice');
        })
      .catch(err => logMessage('DEBUG',err));
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

  exports.getAllUnpaidInvoices = () => {
    return Invoice.fetchAllUnpaidInvoices();
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

exports.postSaveTodaysToken = (token) => {
  const tokenObj = new Token(token);
  tokenObj.save()
    .then(() => {
      logMessage('INFO','Saved Token');
      })
    .catch(err => logMessage('DEBUG',err));
}

exports.fetchTodaysToken = async () => {

  try {
    const response = await Token.fetchOne();
    if (response) {
      const token = response[0][0].token;
      return token;
    }
  }
  catch (error) {
    logMessage('DEBUG',error);
  }
}

exports.postAddUser = async (firstname, lastname, email, kerberos, library) => {
  const user = new User(firstname, lastname, email, kerberos, library);

  try {
      const usersaved = await user.save();
      if (usersaved) {
          logMessage('INFO','User saved');
          return true;
      };
  }
  catch (error) {
      logMessage('DEBUG',error);
  }
};

exports.postEditUser = async (firstname, lastname, email, kerberos, library, id) => {

  try {
      const userupdated = await User.update(firstname, lastname, email, kerberos, library, id);
      if (userupdated) {
          logMessage('INFO','User updated');
          return true;
      };
  }
  catch (error) {
      logMessage('DEBUG',error);
  }
};

exports.fetchAllUsers = async () => {
    try {
      const response = await User.fetchAll();
      if (response) {
        const users = response[0];
        return users;
      }
    }
    catch (error) {
      logMessage('DEBUG',error);
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
    logMessage('DEBUG',error);
  }
}

exports.deleteFund = async (id) => {
  try {
    const response = await Fund.deleteById(id);
    if (response) {
      return true;
    }
  }
  catch (error) {
    logMessage('DEBUG',error);
  }
}

exports.deleteFundByFundId = async (id) => {
  try {
    const response = await Fund.deleteByFundId(id);
    if (response) {
      return true;
    }
  }
  catch (error) {
    logMessage('DEBUG',error);
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
    logMessage('DEBUG',error);
  }
}

exports.deleteVendor = async (id) => {
  try {
    const response = await Vendor.deleteById(id);
    if (response) {
      return true;
    }
  }
  catch (error) {
    logMessage('DEBUG',error);
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
        logMessage('DEBUG',error);
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
          logMessage('DEBUG',error);
        }
      }

exports.checkIfUserExists = async (kerberos) => {
                                                      
    try {
      const response = await User.findById(kerberos);
      if (response && response[0][0] === kerberos) {
        return true;
      }
    }
    catch (error) {
      logMessage('DEBUG',error);
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
    logMessage('DEBUG',error);
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
    logMessage('DEBUG',error);
  }
}

exports.saveFund = async (fundId, fundCode) => {
  const fund = new Fund(fundId, fundCode);

  try {
      const fundsaved = await fund.save();
      if (fundsaved) {
          logMessage('INFO','Fund saved');
          return true;
      };
  }
  catch (error) {
      logMessage('DEBUG',error);
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
    logMessage('DEBUG',error);
  }
}

exports.saveVendor = async (vendorId, vendorData) => {
  const vendor = new Vendor(vendorId, vendorData);
  try {
      const vendorsaved = await vendor.save();
      if (vendorsaved) {
          logMessage('INFO','Vendor saved');
          return true;
      };
  }
  catch (error) {
      logMessage('DEBUG',error);
  }
};