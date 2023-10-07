const Invoice = require('../models/invoice');
const Token = require('../models/token');
const User = require('../models/user');

exports.postAddInvoice = (number, id, library, requestbody) => {
    const invoice = new Invoice(number, id, library, requestbody);
    invoice.save()
      .then(() => {
        console.log('Saved Invoice');
        })
      .catch(err => console.log(err));
    
  };

  exports.getSubmittedInvoices = (library) => {
    return Invoice.fetchAll(library);
  }

  exports.getInvoiceIDs = () => {
    return Invoice.fetchInvoiceIDs();
  }

  exports.getInvoiceNumbers = (library) => {
    return Invoice.fetchInvoiceNumbers(library);
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