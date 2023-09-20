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

exports.fetchTodaysToken = async () => {

  try {
    const response = await Token.fetchOne();
    if (response) {
      // console.log('response = ' + JSON.stringify(response));
      const token = response[0][0].token;
      console.log('token = ' + token);
      console.log(typeof token);
      return token;
    }
  }
  catch (error) {
    console.log(error);
  }
}