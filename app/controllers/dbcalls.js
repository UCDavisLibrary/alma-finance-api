const Invoice = require('../models/invoice');
const Token = require('../models/token');
const User = require('../models/user');
const Fund = require('../models/fund');
const Vendor = require('../models/vendor');

exports.postAddInvoice = (number, id, trackingid, library, requestbody) => {
    const invoice = new Invoice(number, id, trackingid, library, requestbody);
    invoice.save()
      .then(() => {
        console.log('Saved Invoice');
        })
      .catch(err => console.log(err));
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
      console.log(response);
      return response; 
    }
    }
    catch (error) {
      console.log(error);
    }
  }

exports.postSaveTodaysToken = (token) => {
  const tokenObj = new Token(token);
  tokenObj.save()
    .then(() => {
      console.log('Saved Token');
      })
    .catch(err => console.log(err));
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
    console.log(error);
  }
}

exports.postAddUser = async (firstname, lastname, email, kerberos, library) => {
  const user = new User(firstname, lastname, email, kerberos, library);

  try {
      const usersaved = await user.save();
      if (usersaved) {
          console.log('User saved');
          return true;
      };
  }
  catch (error) {
      console.log(error);
  }
};

exports.postEditUser = async (firstname, lastname, email, kerberos, library, id) => {

  try {
      const userupdated = await User.update(firstname, lastname, email, kerberos, library, id);
      if (userupdated) {
          console.log('User updated');
          return true;
      };
  }
  catch (error) {
      console.log(error);
  }
};

exports.deleteUser = async (id) => {
  try {
    const response = await User.deleteById(id);
    if (response) {
      return true;
    }
  }
  catch (error) {
    console.log(error);
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
      console.log(error);
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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
  }
}

exports.deleteInvoice = async (id) => {
  try {
    const response = await Invoice.deleteById(id);
    if (response) {
      return true;
    }
  }
  catch (error) {
    console.log(error);
  }
}

exports.postEditInvoice = async (invoicenumber, invoiceid, consumerTrackingId, library, status, responsebody, datetime, id) => {
  const responsebodyjson = JSON.parse(responsebody);

  try {
      const invoiceupdated = await Invoice.update(invoicenumber, invoiceid, consumerTrackingId, library, status, responsebodyjson, datetime, id);
      if (invoiceupdated) {
          console.log('Invoice updated');
          return true;
      };
  }
  catch (error) {
      console.log(error);
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
    console.log(error);
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
        console.log(error);
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
          console.log(error);
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
      console.log(error);
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
    console.log(error);
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
    console.log(error);
  }
}

exports.saveFund = async (fundId, fundCode) => {
  const fund = new Fund(fundId, fundCode);

  try {
      const fundsaved = await fund.save();
      if (fundsaved) {
          console.log('Fund saved');
          return true;
      };
  }
  catch (error) {
      console.log(error);
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
    console.log(error);
  }
}

exports.saveVendor = async (vendorId, vendorData) => {
  const vendor = new Vendor(vendorId, vendorData);
  try {
      const vendorsaved = await vendor.save();
      if (vendorsaved) {
          console.log('Vendor saved');
          return true;
      };
  }
  catch (error) {
      console.log(error);
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
    console.log(error);
  }
}