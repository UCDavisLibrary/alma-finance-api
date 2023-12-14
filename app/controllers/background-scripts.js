const {getAllInvoiceNumbers, updateStatus, getInvoiceIDs, getAllUnpaidInvoiceNumbers} = require('./dbcalls');
const {checkStatusInOracle} = require('./graphqlcalls');
const {changeToXML} = require('./formatdata');
const fs = require('fs');
const { checkTransporter } = require('../util/nodemailer-transporter');
const transporter = checkTransporter();

exports.checkOracleStatus = async (req, res, next) => {
  // const invoicenumbers1 = await getAllUnpaidInvoiceNumbers();
  const invoicenumbers1 = await getAllUnpaidInvoiceNumbers();
  console.log(invoicenumbers1);
    let invoiceids = [];
    let sentinvoicenumbers = [];
    const invoices = invoicenumbers1[0];
    if (invoices.length === 0) {
      console.log('no invoices found');
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
      console.log('no invoices found');
    }
    else {
    let paidInvoices = [];
    totalresults.forEach(result => {
        if (result.data.scmInvoicePaymentSearch.data && result.data.scmInvoicePaymentSearch.data.length > 0) {
        let data = result.data.scmInvoicePaymentSearch.data[0];
        console.log(data);
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
      if (paidInvoices.length > 0) {
        sendMail(paidInvoices);
      }
      else {
        // console.log('No invoices have been paid');
      }
    }


  }
}


sendMail = (invoicearray) => {
    
      const mail = {
        subject: `Invoices Paid`,
        from: `no-reply@ucdavis.edu`,
        sender: `UC Davis Library`,
        to: process.env.DESTINATIONEMAIL, // receiver email,
        text: `Hello, The following invoices have been paid: ${invoicearray.join(', ')}`,
      };
    
        transporter.sendMail(mail, (err, data) => {
        if (err) {
            console.log(err);
            // res.status(500).send('Something went wrong.');
        } else {
            console.log(`Sent invoices mail.`);
        }
    });


}

exports.archiveInvoices = async () => {
    // look in folder for xml files
    // move them to archive folder
    // delete them from xml folder
    const xmlfolder = '/app/almadafis/aeinput';
    const archivefolder = '/app/almadafis/archive';
    const files = fs.readdirSync(xmlfolder);
    console.log(files);
    files.forEach(file => {
        console.log(file);
        var oldPath = xmlfolder + '/' + file;
        var newPath = archivefolder + '/' + file;
        fs.rename(oldPath, newPath, function (err) {
            if (err) {
                console.log(err);
                throw err;
            } 
            else {
                console.log('Successfully moved to archive!');
            }
            })
    });
    return true;
}

exports.archivePaidInvoices = async () => {
    // look in folder for xml files ending in .handled
    // move them to archive folder
    // delete them from xml folder
    const xmlfolder = '/app/almadafis/aeinput';
    const archivefolder = '/app/almadafis/archive';
    const files = fs.readdirSync(xmlfolder);
    console.log(files);
    files.forEach(file => {
        console.log(file);
        if (file.endsWith('.handled')) {
        var oldPath = xmlfolder + '/' + file;
        var newPath = archivefolder + '/' + file;
        fs.rename(oldPath, newPath, function (err) {
            if (err) {
                console.log(err);
                throw err;
            } 
            else {
                console.log('Successfully moved to archive!');
            }
            })
        }
    });

}