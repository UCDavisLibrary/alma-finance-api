const Invoice = require('../models/invoice');

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