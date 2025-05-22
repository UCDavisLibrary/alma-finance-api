const {updateStatus, getAllUnpaidInvoices, fetchAllUsers} = require('./dbcalls');
const {checkStatusInOracle} = require('./graphqlcalls');
const {changeToXML} = require('./formatdata');
const fs = require('fs');
const { checkTransporter } = require('../util/nodemailer-transporter');
const transporter = checkTransporter();
const { logMessage } = require('../util/logger');

exports.checkOracleStatus = async (req, res, next) => {
  // const invoicenumbers1 = await getAllUnpaidInvoiceNumbers();
  const invoicenumbers1 = await getAllUnpaidInvoices();
    let invoiceids = [];
    let sentinvoicenumbers = [];
    const invoices = invoicenumbers1[0];
    if (invoices.length === 0) {
      logMessage('INFO','no invoices found');
    }
    else {
      for (i in invoices) {
        sentinvoicenumbers[i] =
          { "filter":   
        {
          "invoiceNumber": {"contains": invoices[i].invoicenumber}
        }
      }
        invoiceids[i] = {
          invoicenumber: invoices[i].invoicenumber,
          invoiceid: invoices[i].invoiceid
        }

      }
      const requestresults = await checkStatusInOracle(sentinvoicenumbers);
    let totalresults = invoiceids.map((item, i) => Object.assign({}, item, requestresults[i]));
    if (totalresults.length === 0) {
      logMessage('INFO','no invoices found');
    }
    else {
      const today = new Date().toLocaleDateString('sv-SE', {
        timeZone: 'America/Los_Angeles',
      });
    let paidInvoices = [];
    totalresults.forEach(result => {
        if (result.data.scmInvoicePaymentSearch) {
        if (result.data.scmInvoicePaymentSearch.data && result.data.scmInvoicePaymentSearch.data.length > 0) {
        let data = result.data.scmInvoicePaymentSearch.data[0];
        let datastring = JSON.stringify(data);            
            if (data.paymentStatusCode === 'Y') {
            changeToXML(result.invoicenumber, result.invoiceid, data);
            logMessage('INFO',result.invoicenumber + ' is paid');
            updateStatus('PAID', datastring, result.invoiceid);
            paidInvoices.push(result.invoicenumber);
            }
            else if (data.paymentStatusCode === 'N') {
            logMessage('INFO',result.invoicenumber + ' is not paid');
            updateStatus('NOT PAID', datastring, result.invoiceid);
            }
            else {
            logMessage('INFO',data.invoicenumber + ' has an unknown status');
            }
        }
        else {
            logMessage('INFO','no data returned');
        }
        }
        else {
        logMessage('INFO','no data returned');
        }
      });
      if (paidInvoices.length > 0) {
        try {
          const emails = await getUserEmails();
          sendMail(paidInvoices, emails);
          }
        catch (error) {
          logMessage('DEBUG',error);
          }
        }
      else {
        // logMessage('INFO','No invoices have been paid');
      }
    }


  }
}


sendMail = (invoicearray, emails) => {
    
      const mail = {
        subject: `Invoices Paid`,
        from: `no-reply@ucdavis.edu`,
        sender: `UC Davis Library`,
        to: emails, // receiver email,
        text: `Hello, The following invoices have been paid: ${invoicearray.join(', ')}`,
      };
    
        transporter.sendMail(mail, (err, data) => {
        if (err) {
            logMessage('DEBUG',err);
            // res.status(500).send('Something went wrong.');
        } else {
            logMessage('INFO',`Sent invoices mail.`);
        }
    });


}

exports.archivePaidInvoices = async () => {
    // look in folder for xml files ending in .handled
    // move them to archive folder
    // delete them from xml folder
    const xmlfolder = '/file-loader/almadafis/aeinput';
    const archivefolder = '/file-loader/almadafis/archive';
    const files = fs.readdirSync(xmlfolder);
    files.forEach(file => {
        if (file.endsWith('.handled')) {
        var oldPath = xmlfolder + '/' + file;
        var newPath = archivefolder + '/' + file;
        fs.rename(oldPath, newPath, function (err) {
            if (err) {
                logMessage('DEBUG',err);
                throw err;
            } 
            else {
                logMessage('INFO','Successfully moved to archive!');
            }
            })
        }
    });

}

getUserEmails = async () => {
  try {
    const users = await fetchAllUsers();
    let emails = [];
    users.forEach(user => {
      emails.push(user.email);
    });
    return emails;
  }
  catch (error) {
    logMessage('DEBUG',error);
  }
}