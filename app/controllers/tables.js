const {getVendorData, getAlmaInvoicesWaitingToBESent, setSelectedData} = require('./almaapicalls');
const {reformatAlmaInvoiceforAPI} = require('./formatdata');
const {postAddInvoice, getSubmittedInvoices} = require('./dbcalls');

exports.basicDataTable = async (data, version) => {


    try {
  
        // console.log('data is: ' + JSON.stringify(data));
        const today = new Date().toLocaleDateString('sv-SE', {
          timeZone: 'America/Los_Angeles',
        });
    
        // console.log(`today is ${today}`);
        // from test app
        let temp = '';
        temp += '<h3>Invoice Data</h3>';
        // temp += '<p>';
        // temp += data.total_record_count;
        // temp += ' invoices found</p>';
        temp += '<form action="/preview" method="POST">';
        temp += '<table>'
        temp += '<tr>';
        temp += '<th>Vendor ID</th>';
        temp += '<th>Vendor Name</th>';
        temp += '<th>Invoice #</th>';	
        temp += '<th>Amount</th>'; 	
        temp += '<th>Date</th>';	
        temp += '<th>Invoice Total</th>';
        if (version === 'preview') {
          temp += '<th>Send</th>';
        }
        else if (version === 'review') {
          temp += '<th>Results</th>';
        }
        else {
          temp += '<th></th>';
        }
        temp += '</tr>';
        for (i in data.invoice) {
          console.log('data.invoice[i] is: ' + JSON.stringify(data.invoice[i]));
          // let vendors = [];
          // console.log(JSON.stringify(data.invoice));
          let nozee = data.invoice[i].invoice_date;
          if (nozee.includes('Z')) {
            nozee = nozee.substring(0, nozee.length - 1);
          } else {
            nozee = data.invoice[i].invoice_date;
          }
          const vendor = data.invoice[i].vendor.value;
          // vendors.push(vendor);
          // console.log(`Vendor is ${vendor}`);
  
          try {
            const vendordata = await getVendorData(vendor);
            // let vendordata = await getVendorDataBatch(vendors);
            console.log('vendor data is ' + JSON.stringify(vendordata));
            
            if (vendordata) {
            temp += '<tr>';
        
            temp += `<td>${vendordata.code}</td>`;
            temp += `<td>${vendordata.name}</td>`;
            temp += `<td><a href="/invoice/${data.invoice[i].id}" target="_blank">${data.invoice[i].id}</a></td>`;
            temp += `<td>$${data.invoice[i].total_amount}</td>`;
            temp += `<td>${nozee}</td>`;	
            temp += `<td>$${data.invoice[i].total_amount}</td>`;
            if (version === 'preview') {
              temp += `<td><input type="checkbox" id="${data.invoice[i].id}" name="invoice-${i}" value="${data.invoice[i].id}"></td>`;
            }
            else if (version === 'review') {
                if (data.invoice[i].errors) {
                    temp += `<td><btn class="btn btn-danger" onClick="toggle(table${data.invoice[i].id})">Errors</btn></td>`;
                    temp += '</tr>';
                    temp += `<tr>`;
                    temp += '<td colspan="7" >';
                    temp += `<a onclick="toggle(table${data.invoice[i].id})">View Error Data-></a>`;
                    temp += `<div class="invoicediv hidden" id="table${data.invoice[i].id}">`;
                    temp += JSON.stringify(data.invoice[i].errors);
                    temp += '</div>';
                    temp += '</td>';
                    temp += '</tr>';
                  }
              else if (data.invoice[i].data.scmInvoicePaymentCreate) {

                if (data.invoice[i].data.scmInvoicePaymentCreate.requestStatus.requestStatus === 'PENDING') {
                  postAddInvoice(data.invoice[i].number, data.invoice[i].id, data.invoice[i].data);
                  temp += `<td><btn class="btn btn-success">Success</btn></td>`;
                  }
                else if (data.invoice[i].data.scmInvoicePaymentCreate.validationResults.errorMessages[0].includes("A request already exists for your consumerId and consumerTrackingId")) {
                  postAddInvoice(data.invoice[i].number, data.invoice[i].id, data.invoice[i].data);
                temp += `<td><a class="btn btn-success">Success</a></td>`;
                }
                else if (data.invoice[i].data.scmInvoicePaymentCreate.validationResults.errorMessages) {
                    temp += `<td><btn class="btn btn-danger" onClick="toggle(table${data.invoice[i].id})">Errors</btn></td>`;
                    temp += '</tr>';
                    temp += `<tr>`;
                    temp += '<td colspan="7" >';
                    temp += `<a onclick="toggle(table${data.invoice[i].id})">View Error Data-></a>`;
                    temp += `<div class="invoicediv hidden" id="table${data.invoice[i].id}">`;
                    temp += JSON.stringify(data.invoice[i].data.scmInvoicePaymentCreate.validationResults.errorMessages);
                    temp += '</div>';
                    temp += '</td>';
                    temp += '</tr>';
                  }
                temp += '</tr>';
              }
              else if (data.invoice[i].data.scmInvoicePaymentRequestStatusByConsumerTracking) {

                if (data.invoice[i].data.scmInvoicePaymentRequestStatusByConsumerTracking.requestStatus.requestStatus === 'COMPLETE') {
                  temp += `<td><btn class="btn btn-success">Success</btn></td>`;
                  }
                else {
                    temp += `<td><btn class="btn btn-danger" onClick="toggle(table${data.invoice[i].id})">Errors</btn></td>`;
                    temp += '</tr>';
                    temp += `<tr>`;
                    temp += '<td colspan="7" >';
                    temp += `<a onclick="toggle(table${data.invoice[i].id})">View Error Data-></a>`;
                    temp += `<div class="invoicediv hidden" id="table${data.invoice[i].id}">`;
                    temp += JSON.stringify(data.invoice[i].data.scmInvoicePaymentRequestStatusByConsumerTracking.requestStatus.errorMessages);
                    temp += '</div>';
                    temp += '</td>';
                    temp += '</tr>';
                  }
                temp += '</tr>';
              }
              else if (data.invoice[i].data.scmInvoicePaymentSearch) {

                if (data.invoice[i].data.scmInvoicePaymentSearch.metadata.returnedResultCount === 0) {
                  temp += `<td><btn class="btn btn-danger">NOT FOUND</btn></td>`;
                  }
                else {
                    temp += `<td><btn class="btn btn-success" onClick="toggle(table${data.invoice[i].id})">PAID</btn></td>`;
                    temp += '</tr>';
                    temp += `<tr>`;
                    temp += '<td colspan="7" >';
                    temp += `<a onclick="toggle(table${data.invoice[i].id})">View Payment Data-></a>`;
                    temp += `<div class="invoicediv hidden" id="table${data.invoice[i].id}">`;
                    temp += JSON.stringify(data.invoice[i].data.scmInvoicePaymentSearch.data[0]);
                    temp += '</div>';
                    temp += '</td>';
                    temp += '</tr>';
                  }
                temp += '</tr>';
              }

              else {
                temp += `<td></td>`;
                temp += '</tr>';
              }
            }
  
          }
  
          }
  
          catch (error) {console.log(error);
        
      }
        }
        temp += '</table>';
        if (version === 'preview') {
        temp += '<button type="submit" class="btn--primary">Submit</button>';
        }
        temp += '</form>';
  
        return temp;
  
    }
    catch(error) {console.log(error)};
  
  };

exports.almatoHTMLTableComplete = async (input, requestResponse) => {

  try {
      let step1 = await setSelectedData([input]);
      let data = await reformatAlmaInvoiceforAPI(step1);
  //   const checkdata = async () => {
  //   if (input) {
  //     let step1 = await setSelectedData([input]);
  //     let inputdata = await reformatAlmaInvoiceforAPI(step1);
  //     return inputdata;
  //   }
  //   else {
  //     let step1 = await getAlmaInvoicesWaitingToBESent();
  //     const step2 = await filterOutSubmittedInvoices(data1);

  //     let noinputdata = await reformatAlmaInvoiceforAPI(step2);
  //     return noinputdata;
  //   }
  // }
    if (data) {

    console.log(data);
    var temp = '';
    temp += '<h3>Invoice Data</h3>';
    temp += '<p>';
    temp += data.length;
    temp += ' invoices found</p>';
    for (i in data) {
      const header = data[i].data.header;
      const payload = data[i].data.payload;
      const invoiceLines = data[i].data.payload.invoiceLines;
    if (input) {
      temp += '<div class="l-2col">';
      temp += '<div class="l-first">';
    }
      temp += '<div class="invoice-header"><h4>Invoice ';
      temp += parseInt(i) + 1;
      temp += ' - ';
      temp += header.consumerTrackingId;
      temp += '</h4>';
      if (!input) {
      temp += '<button onClick="toggle(table';
      temp += i;
      temp += ')">show</button>';
      }
      temp += '</div><br>';
      temp += '<table id="table';
      temp += i;
      if (!input) {
      temp += '"class="invoicediv hidden">';
      }
      else {
        temp += '"class="invoicediv">';
      }
      for (const [key, value] of Object.entries(header)) {
        temp += '<tr><td>';
        temp += key;
        temp += '</td><td>';
        temp += value;
        temp += '</td></tr>';
      }
      for (const [key, value] of Object.entries(payload)) {
        if (key === 'invoiceLines') {
          temp += '<tr><td>';
          temp += key;
          temp += ' (';
          temp += invoiceLines.length;
          temp += ')</td><td>';
          for (j in invoiceLines) {
            temp += '<table class="invoice-lines">';
            const invoice = invoiceLines[j];
            for (const [key, value] of Object.entries(invoice)) {
              const glSegments = invoice.glSegments;
              const ppmSegments = invoice.ppmSegments;
              if (key === 'glSegments') {
                temp += '<tr><td>';
                temp += key;
                temp += '</td><td><table>';
                for (const [key, value] of Object.entries(glSegments)) {
                  temp += '<tr><td>';
                  temp += key;
                  temp += '</td><td>';
                  temp += value;
                  temp += '</td></tr>';
                }
                temp += '</table></td></tr>';
              } else if (key === 'ppmSegments') {
                  temp += '<tr><td>';
                  temp += key;
                  temp += '</td><td><table>';
                  for (const [key, value] of Object.entries(ppmSegments)) {
                    temp += '<tr><td>';
                    temp += key;
                    temp += '</td><td>';
                    temp += value;
                    temp += '</td></tr>';
                  }
                  temp += '</table></td></tr>';
              } else {
                temp += '<tr><td>';
                temp += key;
                temp += '</td><td>';
                temp += value;
                temp += '</td></tr>';
              }
            }
            temp += '</table>';
          }
          temp += '</td></tr>';
        } else {
          temp += '<tr><td>';
          temp += key;
          temp += '</td><td>';
          temp += value;
          temp += '</td></tr>';
        }
      }
      temp += '</table>';
      if (input) {
        temp += '</div>';
          temp += '<div class="l-second">';
          if (requestResponse) {
            temp += '<h4>Errors</h4>';
            temp += JSON.stringify(requestResponse);
          }
          // const errorReport = await aggieEnterprisePaymentRequest([input]);
          // if (errorReport) {
          //   temp += '<h4>Errors</h4>';
          //   temp += JSON.stringify(errorReport);

          //   temp += '<table class="error-table">';
          //   for (j in erorreport) {
          //     // const error = erorreport[j].data.scmInvoicePaymentCreate.validationResults.errorMessages;
          //     if (error) {
          //       temp += '<tr><td>';
          //       temp += JSON.stringify(errorReport);
          //       temp += '</td></tr>';
          //     }
          //   }
            temp += '</table>';
            temp += '</div>';
        }
      }
    }
  
    return temp;
  }
  catch (error) {
    console.log(error);
  }

}





