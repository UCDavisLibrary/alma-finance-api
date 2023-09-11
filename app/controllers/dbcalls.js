const Invoice = require('../models/invoice');
const Token = require('../models/token');

exports.postAddInvoice = (number, id, requestbody) => {
    const invoice = new Invoice(number, id, requestbody);
    invoice.save()
      .then(() => {
        console.log('Saved Invoice');
        })
      .catch(err => console.log(err));
    
  };

  exports.getSubmittedInvoices = () => {
    return Invoice.fetchAll();
  }

  exports.getInvoiceIDs = () => {
    return Invoice.fetchInvoiceIDs();
  }

  exports.getInvoiceNumbers = () => {
    return Invoice.fetchInvoiceNumbers();
  }

exports.postSaveTodaysToken = (token) => {
  console.log('token = ' + token);
  const tokenObj = new Token(token);
  tokenObj.save()
    .then(() => {
      console.log('Saved Token');
      })
    .catch(err => console.log(err));
}

exports.fetchTodaysToken = () => {
  return Token.fetchOne();
}