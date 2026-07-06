import { getAllUnpaidInvoiceNumbers, updateStatus } from './dbcalls.js';
import { checkStatusInOracle } from './graphqlcalls.js';
import { changeToXML } from './formatdata.js';
import fs from 'fs';
import { checkTransporter } from '../util/nodemailer-transporter.js';
import { logMessage } from '../util/logger.js';
import config from '../util/config.js';

const transporter = checkTransporter();

export async function checkOracleStatus() {
  const invoicenumbers1 = await getAllUnpaidInvoiceNumbers();
  const invoices = invoicenumbers1[0];

  if (invoices.length === 0) {
    logMessage('INFO', 'no invoices found');
    return;
  }

  const sentinvoicenumbers = [];
  const invoiceids = [];

  for (let i = 0; i < invoices.length; i++) {
    sentinvoicenumbers[i] = {
      filter: { invoiceNumber: { contains: invoices[i].invoicenumber } },
    };
    invoiceids[i] = {
      invoicenumber: invoices[i].invoicenumber,
      invoiceid: invoices[i].invoiceid,
    };
  }

  const requestresults = await checkStatusInOracle(sentinvoicenumbers);
  const totalresults = invoiceids.map((item, i) => Object.assign({}, item, requestresults[i]));

  if (totalresults.length === 0) {
    logMessage('INFO', 'no invoices found');
    return;
  }

  const paidInvoices = [];
  totalresults.forEach((result) => {
    if (result.data.scmInvoicePaymentSearch?.data?.length > 0) {
      const data = result.data.scmInvoicePaymentSearch.data[0];
      const datastring = JSON.stringify(data);
      if (data.paymentStatusCode === 'Y') {
        logMessage('INFO', result.invoicenumber + ' is paid');
        updateStatus('PAID', datastring, result.invoiceid);
        changeToXML(result.invoicenumber, result.invoiceid, data);
        paidInvoices.push(result.invoicenumber);
      } else if (data.paymentStatusCode === 'N') {
        logMessage('INFO', result.invoicenumber + ' is not paid');
        updateStatus('NOT PAID', datastring, result.invoiceid);
      } else {
        logMessage('DEBUG', data.invoicenumber + ' has an unknown status');
      }
    } else {
      logMessage('INFO', 'no data returned');
    }
  });

  if (paidInvoices.length > 0) {
    sendMail(paidInvoices);
  } else {
    logMessage('INFO', 'No invoices have been paid');
  }
}

const sendMail = (invoicearray) => {
  const mail = {
    subject: 'Invoices Paid',
    from: 'no-reply@ucdavis.edu',
    sender: 'UC Davis Library',
    to: config.email.destination,
    text: `Hello, The following invoices have been paid: ${invoicearray.join(', ')}`,
  };

  transporter.sendMail(mail, (err) => {
    if (err) {
      logMessage('DEBUG', 'background-scripts: sendMail()', err.message);
    } else {
      logMessage('INFO', 'Sent invoices mail.');
    }
  });
};

export async function archivePaidInvoices() {
  const xmlfolder = '/app/almadafis/aeinput';
  const archivefolder = '/app/almadafis/archive';
  const files = fs.readdirSync(xmlfolder);
  files.forEach((file) => {
    if (file.endsWith('.handled')) {
      const oldPath = xmlfolder + '/' + file;
      const newPath = archivefolder + '/' + file;
      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          logMessage('DEBUG', 'background-scripts: archivePaidInvoices()', err.message);
          throw err;
        } else {
          logMessage('INFO', 'Successfully moved to archive!');
        }
      });
    }
  });
}
