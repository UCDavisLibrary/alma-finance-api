const Invoice = require('../models/invoice');

exports.postAddInvoice = (id, requestbody) => {
    const invoice = new Invoice(id, requestbody);
    invoice.save()
      .then(() => {
        console.log('Saved Invoice');
        })
      .catch(err => console.log(err));
    
  };