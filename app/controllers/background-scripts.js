const {getAllInvoiceNumbers, updateStatus, getInvoiceIDs} = require('./dbcalls');
const {checkStatusInOracle} = require('./graphqlcalls');
const {changeToXML} = require('./formatdata');
const nodemailer = require('nodemailer');

// nodemailer setup
const transporter = nodemailer.createTransport({
    host: 'smtp.lib.ucdavis.edu',
    port: 25,
    secure: false,
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });
  
  // use this if you want to run it with gmail
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.TRANSPORTERUSER,
//       pass: process.env.TRANSPORTERPASS,
//     },
//   });
  
  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take our messages');
    }
  });

exports.checkOracleStatus = async (req, res, next) => {
    let invoicenumbers = await getAllInvoiceNumbers();
    let invoiceids = await getInvoiceIDs();
    invoiceids = invoiceids[0];
    let sentinvoicenumbers = [];
    invoicenumbers = invoicenumbers[0];
    if (invoicenumbers.length === 0) {
      console.log('no invoices found');
    }
    else {
      for (i in invoicenumbers) {
        console.log(invoicenumbers[i].invoicenumber);
        sentinvoicenumbers[i] =
          { "filter":   
        {
          "invoiceNumber": {"contains": invoicenumbers[i].invoicenumber}
        }
      }
      }
      const requestresults = await checkStatusInOracle(sentinvoicenumbers);
    let results1 = invoiceids.map((item, i) => Object.assign({}, item, requestresults[i]));
    let totalresults = invoicenumbers.map((item, i) => Object.assign({}, item, results1[i]));

    let paidInvoices = [];
    totalresults.forEach(result => {
        if (result.data.scmInvoicePaymentSearch.data && result.data.scmInvoicePaymentSearch.data.length > 0) {
        console.log(JSON.stringify(result));
        let data = result.data.scmInvoicePaymentSearch.data[0];
        let datastring = JSON.stringify(data);            
            if (data.paymentStatusCode === 'Y') {
            console.log(result.invoicenumber + ' is paid');
            updateStatus('PAID', datastring, result.invoiceid);
            changeToXML(result.invoicenumber, result.invoiceid, data);
            paidInvoices.push(result.invoicenumber);
            }
            else if (data.paymentStatusCode === 'N') {
            console.log(result.invoicenumber + ' is not paid');
            updateStatus('NOT PAID', datastring, result.invoiceid);
            }
            else {
            console.log(data.invoicenumber + ' has an unknown status');
            }
        }
        else {
            console.log('no data returned');
        }
      });
      console.log(paidInvoices);
      console.log(paidInvoices.length);
      if (paidInvoices.length > 0) {
        sendMail(paidInvoices);
      }
      else {
        // console.log('No invoices have been paid');
      }

  }
}


sendMail = (invoicearray) => {
    
      const mail = {
        subject: `Invoices Paid`,
        from: `no-reply@ucdavis.edu`,
        sender: `UC Davis Library`,
        to: process.env.DESTINATIONMAIL, // receiver email,
        text: `Hello, The following invoices have been paid: ${invoicearray.join(', ')}`,
      };
    
        transporter.sendMail(mail, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('Something went wrong.');
        } else {
            console.log(`Sent invoices mail.`);
        }
    });


}