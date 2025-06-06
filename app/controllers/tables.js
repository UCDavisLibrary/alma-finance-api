const {setSelectedData} = require('./almaapicalls');
const {reformatAlmaInvoiceforAPI, changeFundIDtoCode} = require('./formatdata');
const {checkStatusInOracle, checkPayments} = require('./graphqlcalls');
const {fetchInvoiceByInvoiceId} = require('./dbcalls');
const { logMessage } = require('../util/logger');

exports.basicDataTable = async (data, version, library) => {
    try {
        const today = new Date().toLocaleDateString('sv-SE', {
          timeZone: 'America/Los_Angeles',
        });
        let invoicestotal = 0;
        let temp = '';
        temp += '<h3>Invoice Data</h3>';
        temp += '<form action="/preview" method="POST">';
        temp += '<table id="marksdatatable">'
        temp += '<tr>';
        temp += '<th>Invoice Number</th>';
        temp += '<th>Vendor Name</th>';
        temp += '<th>Date</th>';
        temp += '<th>Fund External ID: Amount</th>';	
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
          let nozee = data.invoice[i].invoice_date;
          if (nozee.includes('Z')) {
            nozee = nozee.substring(0, nozee.length - 1);
          } else {
            nozee = data.invoice[i].invoice_date;
          }
          // const vendor = data.invoice[i].vendor.value;
            temp += '<tr>';
            temp += `<td>${data.invoice[i].number} (<a href="/invoice/${data.invoice[i].id}" target="_blank">view details</a>)</td>`;
            temp += `<td>${data.invoice[i].vendor.desc}</td>`;
            temp += `<td>${nozee}</td>`;	
                  temp += `<td>`;
            let fundCodes = [];
            let fundArray = [];
            for (j in data.invoice[i].invoice_lines.invoice_line) {
              for (k in data.invoice[i].invoice_lines.invoice_line[j].fund_distribution) {
                const fundAmount = data.invoice[i].invoice_lines.invoice_line[j].fund_distribution[k].amount;
                const fundLine = data.invoice[i].invoice_lines.invoice_line[j].fund_distribution[k].fund_code.value;
                try {
                  const fundCode = await changeFundIDtoCode(fundLine,library);
                  if (fundCode && fundAmount) {
                    if (fundCodes.includes(fundCode)) {
                      fundArray.forEach((fund) => {
                        if (fund.code === fundCode) {
                          fund.amount += fundAmount;
                        }
                      });
                    }
                    else {
                      fundArray.push({code : fundCode,
                        amount : fundAmount});
                      fundCodes.push(fundCode);
                    }
                  }

                }
                catch(error) {
                  logMessage('DEBUG','tables: basicDataTable()71',error);
                }
              }
            }
            fundArray.forEach((fund) => {
              temp += `${fund.code}: $${parseFloat(fund.amount).toFixed(2)}<br>`;
            });
            temp += `</td>`;
            temp += `<td>$${data.invoice[i].total_amount}</td>`;
            invoicestotal += data.invoice[i].total_amount;
            if (version === 'preview') {
              temp += `<td>
              <input type="checkbox" class="selectinvoices" id="${data.invoice[i].id}" name="invoice-${i}" value="${data.invoice[i].id}" data-price="${data.invoice[i].total_amount}"`;
              temp += `data-arraypreview='${JSON.stringify(fundArray).trim()}' `;
              temp += `data-fundarray="${fundArray}"`;
              temp += `></td>`;
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
                  temp += `<td><btn class="btn btn-success">Success</btn></td>`;
                  }
                else if (data.invoice[i].data.scmInvoicePaymentCreate.validationResults.errorMessages[0].includes("A request already exists for your consumerId and consumerTrackingId")) {
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
                    if (data.invoice[i].data.scmInvoicePaymentSearch.data[0].paymentStatusCode === 'Y') {
                      temp += `<td><btn class="btn btn-success" onClick="toggle(table${data.invoice[i].id})">PAYMENT SCHEDULED</btn></td>`;
                      // updateStatus('PAID', data.invoice[i].id);
                    }
                    else if (data.invoice[i].data.scmInvoicePaymentSearch.data[0].paymentStatusCode === 'N') {
                      temp += `<td><btn class="btn btn-warning" onClick="toggle(table${data.invoice[i].id})">NOT YET PAID</btn></td>`;
                      // updateStatus('NOT PAID', data.invoice[i].id);
                    }
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
        if (version === 'preview') {
          temp += `<tr>
          <td colspan="3" class="noborder"></td>
          <td>
          <span id="fundscontainer">
          <span id="fundCodes"></span>
          </span>
          </td>
          <td>
          <span id="totalcontainer">
          $<span id="total"></span>
          </span>
          <span id="total2" class="hidden">$${invoicestotal}</span>
          </td>
          <td class="noborder"><input type="checkbox" onClick="checkall(this)" />Select All</td>
          </tr>`;
        }
        temp += '</table>';
        if (version === 'preview') {
        temp += '<button type="submit" class="btn--primary">Submit</button>';
        }
        temp += '</form>';
  
        return temp;
  
    }
    catch(error) {logMessage('DEBUG','tables: basicDataTable()201',error)};
  
  };

exports.almatoHTMLTablePreview = async (input, requestResponse) => {
  try {
    const step1 = await setSelectedData([input]);
    const data = await reformatAlmaInvoiceforAPI(step1);

    if (data) {
      let temp = '';
      temp += '<h3>Invoice Data</h3>';
      temp += '<p>' + data.length + ' invoices found</p>';

      for (let i in data) {
        const oracleinvoicenumber = [{
          filter: {
            invoiceNumber: { contains: data[i].data.header.consumerTrackingId }
          }
        }];
        const aeinvoicenumber = [{
          consumerTrackingId: data[i].data.header.consumerTrackingId
        }];

        const oracledata = await checkStatusInOracle(oracleinvoicenumber);
        const aggieenterprisedata = await checkPayments(aeinvoicenumber);

        const header = data[i].data.header;
        const payload = data[i].data.payload;
        const invoiceLines = data[i].data.payload.invoiceLines;

        temp += '<div style="display: flex;">';
        temp += '<div>';
        temp += `<div class="invoice-header"><h4>Invoice ${parseInt(i) + 1} - ${header.consumerTrackingId}</h4>`;
        if (!input) {
          temp += `<button onClick="toggle(table${i})">show</button>`;
        }
        temp += '</div><br>';
        temp += `<table id="table${i}" class="invoicediv">`;

        for (const [key, value] of Object.entries(header)) {
          temp += `<tr><td>${key}</td><td>${value}</td></tr>`;
        }

        for (const [key, value] of Object.entries(payload)) {
          if (key === 'invoiceLines') {
            temp += `<tr><td>${key} (${invoiceLines.length})</td><td>`;
            for (let j in invoiceLines) {
              const invoice = invoiceLines[j];
              temp += '<table class="invoice-lines">';
              for (const [key, value] of Object.entries(invoice)) {
                if (key === 'glSegments') {
                  temp += '<tr><td>glSegments</td><td><table>';
                  for (const [k, v] of Object.entries(value)) {
                    temp += `<tr><td>${k}</td><td>${v}</td></tr>`;
                  }
                  temp += '</table></td></tr>';
                } else if (key === 'ppmSegments') {
                  temp += '<tr><td>ppmSegments</td><td><table>';
                  for (const [k, v] of Object.entries(value)) {
                    temp += `<tr><td>${k}</td><td>${v}</td></tr>`;
                  }
                  temp += '</table></td></tr>';
                } else {
                  temp += `<tr><td>${key}</td><td>${value}</td></tr>`;
                }
              }
              temp += '</table>';
            }
            temp += '</td></tr>';
          } else {
            temp += `<tr><td>${key}</td><td>${value}</td></tr>`;
          }
        }

        temp += '</table>';
        temp += '</div><div>';

        if (aggieenterprisedata) {
          temp += '<h4>Invoice Status Data</h4>';
          if (oracledata) {
            temp += '<h5>Oracle Status Data</h5>';
            temp += `<pre>${JSON.stringify(oracledata, null, 2)}</pre><br>`;
          }
          temp += '<h5>Aggie Enterprise Status Data</h5>';
          temp += `<pre>${JSON.stringify(aggieenterprisedata, null, 2)}</pre>`;
        }

        temp += '</div></div>';
      }

      return temp;
    } else {
      return '<p>No data found</p>';
    }
  } catch (error) {
    logMessage('DEBUG', 'tables:almatoHTMLTablePreview()', error);
  }
};

exports.paidInvoicesTable = async (data) => {
  try {
      const today = new Date().toLocaleDateString('sv-SE', {
        timeZone: 'America/Los_Angeles',
      });
      let invoicestotal = 0;
      let temp = '';
      temp += '<h3>Invoice Data</h3>';
      temp += '<form action="/preview" method="POST">';
      temp += '<table id="marksdatatable">'
      temp += '<tr>';
      temp += '<th>Invoice Number</th>';
      temp += '<th>Vendor Name</th>';
      temp += '<th>Date</th>';
      temp += '<th>Fund External ID: Amount</th>';	
      temp += '<th>Invoice Total</th>';
      temp += '<th>Time Paid</th>';
      temp += '</tr>';
      for (let i in data.invoice) {
        let nozee = toString(data.invoice[i].invoice_date);
        if (nozee.includes('Z')) {
          nozee = nozee.substring(0, nozee.length - 1);
        } else {
          nozee = data.invoice[i].invoice_date;
        }
          temp += '<tr>';
          temp += `<td>${data.invoice[i].number}<br>(<a href="/invoice/${data.invoice[i].id}" target="_blank">view details</a>)</td>`;
          temp += `<td>${data.invoice[i].vendor.desc}</td>`;
          temp += `<td>${nozee}</td>`;	
                temp += `<td>`;
          let fundCodes = [];
          let fundArray = [];
          for (let j in data.invoice[i].invoice_lines.invoice_line) {
            for (let k in data.invoice[i].invoice_lines.invoice_line[j].fund_distribution) {
              const fundAmount = data.invoice[i].invoice_lines.invoice_line[j].fund_distribution[k].amount;
              const fundLine = data.invoice[i].invoice_lines.invoice_line[j].fund_distribution[k].fund_code.value;
              try {
                const fundCode = await changeFundIDtoCode(fundLine,library);
                if (fundCode && fundAmount) {
                  if (fundCodes.includes(fundCode)) {
                    fundArray.forEach((fund) => {
                      if (fund.code === fundCode) {
                        fund.amount += fundAmount;
                      }
                    });
                  }
                  else {
                    fundArray.push({code : fundCode,
                      amount : fundAmount});
                    fundCodes.push(fundCode);
                  }
                }

              }
              catch(error) {
                logMessage('DEBUG','tables:paidInvoicesTable():391',error);
              }
            }
          }
          fundArray.forEach((fund) => {
            temp += `${fund.code}: $${parseFloat(fund.amount).toFixed(2)}<br>`;
          });
          temp += `</td>`;
          temp += `<td>$${data.invoice[i].total_amount}</td>`;
          invoicestotal += data.invoice[i].total_amount;
          temp += `<td>${data.invoice[i].responsebody.lastUpdateDateTime}</td>`;
          temp += '</tr>';
            
          }
        
      temp += '</table>';
      temp += '</form>';

      return temp;
  }
  catch(error) {logMessage('DEBUG','tables:paidInvoicesTable()411', error)}

};

exports.almatoHTMLTableComplete = async (input, requestResponse) => {
  try {
      const step1 = await setSelectedData([input]);
      const data = await reformatAlmaInvoiceforAPI(step1);
      const dbinvoicedata = await fetchInvoiceByInvoiceId(input);
      const consumerTrackingId = dbinvoicedata.consumerTrackingId;
    if (data) {
      const oracleinvoicenumber =
          [{ "filter":   
        {
          "invoiceNumber": {"contains": data[i].data.payload.invoiceNumber}
        }
      }];
      const aeinvoicenumber = [{consumerTrackingId : consumerTrackingId.length > 0 ? consumerTrackingId : data[i].data.header.consumerTrackingId}];

      const oracledata = await checkStatusInOracle(oracleinvoicenumber);
      const aggieenterprisedata = await checkPayments(aeinvoicenumber);
    var temp = '';
    temp += '<h3>Invoice Data</h3>';
    temp += '<p>';
    temp += data.length;
    temp += ' invoices found</p>';
    for (i in data) {
      const header = data[i].data.header;
      const payload = data[i].data.payload;
      const invoiceLines = data[i].data.payload.invoiceLines;
      temp += '<div style="display: flex;">';
      temp += '<div>';
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
      temp += '"class="invoicediv">';
      for (const [key, value] of Object.entries(header)) {
        temp += '<tr><td>';
        temp += key;
        temp += '</td><td>';
        temp += consumerTrackingId.length > 0 && key === 'consumerTrackingId' ? consumerTrackingId : value;
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
        temp += '</div>';
          temp += '<div>';
          if (aggieenterprisedata) {
            temp += '<h4>Invoice Status Data</h4>';
            if (oracledata) {
              temp += '<h5>Oracle Status Data</h5>';
              temp += '<pre>';
              temp += JSON.stringify(oracledata, null, 2);
              temp += '</pre>';
              temp += '<br>';
            }
            temp += '<h5>Aggie Enterprise Status Data</h5>';
            temp += '<pre>';
            temp += JSON.stringify(aggieenterprisedata, null, 2);
            temp += '</pre>';
          }
          temp += '</table>';
          temp += '</div>';
      }
    }
  
    return temp;
  }
  catch (error) {
    logMessage('DEBUG','tables:almatoHTMLTableComplete()',error);
  }

}
