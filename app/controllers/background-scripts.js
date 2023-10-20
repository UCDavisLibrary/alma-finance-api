const {getAllInvoiceNumbers, updateStatus, getInvoiceIDs} = require('./dbcalls');
const {checkStatusInOracle} = require('./graphqlcalls');
const {changeToXML} = require('./formatdata');

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

    totalresults.forEach(result => {
        if (result.data.scmInvoicePaymentSearch.data && result.data.scmInvoicePaymentSearch.data.length > 0) {
        console.log(JSON.stringify(result));
        let data = result.data.scmInvoicePaymentSearch.data[0];
        let datastring = JSON.stringify(data);            
            if (data.paymentStatusCode === 'Y') {
            console.log(result.invoicenumber + ' is paid');
            updateStatus('PAID', datastring, result.invoicenumber);
            changeToXML(result.invoicenumber, result.invoiceid, data);
            }
            else if (data.paymentStatusCode === 'N') {
            console.log(result.invoicenumber + ' is not paid');
            updateStatus('NOT PAID', datastring, result.invoicenumber);
            }
            else {
            console.log(data.invoicenumber + ' has an unknown status');
            }
        }
        else {
            console.log('no data returned');
        }
      });


  }
}