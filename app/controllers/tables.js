import { setSelectedData } from './almaapicalls.js';
import { reformatAlmaInvoiceforAPI, changeFundIDtoCode } from './formatdata.js';
import { checkStatusInOracle, checkPayments } from './graphqlcalls.js';
import { fetchInvoiceByInvoiceId } from './dbcalls.js';
import { logMessage } from '../util/logger.js';

export async function basicDataTable(data, version, library) {
  try {
    let invoicestotal = 0;
    let temp = '';
    temp += '<h3>Invoice Data</h3>';
    temp += '<form action="/preview" method="POST">';
    temp += '<table id="marksdatatable">';
    temp += '<tr>';
    temp += '<th>Invoice Number</th>';
    temp += '<th>Vendor Name</th>';
    temp += '<th>Date</th>';
    temp += '<th>Fund External ID: Amount</th>';
    temp += '<th>Invoice Total</th>';
    if (version === 'preview') {
      temp += '<th>Send</th>';
    } else if (version === 'review') {
      temp += '<th>Results</th>';
    } else {
      temp += '<th></th>';
    }
    temp += '</tr>';

    for (let i = 0; i < data.invoice.length; i++) {
      let nozee = data.invoice[i].invoice_date;
      if (nozee.includes('Z')) {
        nozee = nozee.substring(0, nozee.length - 1);
      }

      temp += '<tr>';
      temp += `<td>${data.invoice[i].number} (<a href="/invoice/${data.invoice[i].id}" target="_blank">view details</a>)</td>`;
      temp += `<td>${data.invoice[i].vendor.desc}</td>`;
      temp += `<td>${nozee}</td>`;
      temp += '<td>';

      let fundCodes = [];
      let fundArray = [];
      for (let j = 0; j < data.invoice[i].invoice_lines.invoice_line.length; j++) {
        for (let k = 0; k < data.invoice[i].invoice_lines.invoice_line[j].fund_distribution.length; k++) {
          const fundAmount = data.invoice[i].invoice_lines.invoice_line[j].fund_distribution[k].amount;
          const fundLine = data.invoice[i].invoice_lines.invoice_line[j].fund_distribution[k].fund_code.value;
          try {
            const fundCode = await changeFundIDtoCode(fundLine, library);
            if (fundCode && fundAmount) {
              if (fundCodes.includes(fundCode)) {
                fundArray.forEach((fund) => {
                  if (fund.code === fundCode) fund.amount += fundAmount;
                });
              } else {
                fundArray.push({ code: fundCode, amount: fundAmount });
                fundCodes.push(fundCode);
              }
            }
          } catch (error) {
            logMessage('DEBUG', 'tables: basicDataTable()', error);
          }
        }
      }

      fundArray.forEach((fund) => {
        temp += `${fund.code}: $${parseFloat(fund.amount).toFixed(2)}<br>`;
      });
      temp += '</td>';
      temp += `<td>$${data.invoice[i].total_amount}</td>`;
      invoicestotal += data.invoice[i].total_amount;

      if (version === 'preview') {
        temp += `<td><input type="checkbox" class="selectinvoices" id="${data.invoice[i].id}" name="invoice-${i}" value="${data.invoice[i].id}" data-price="${data.invoice[i].total_amount}"`;
        temp += `data-arraypreview='${JSON.stringify(fundArray).trim()}' `;
        temp += `data-fundarray="${fundArray}"`;
        temp += '></td>';
      } else if (version === 'review') {
        if (data.invoice[i].errors) {
          temp += `<td><btn class="btn btn-danger" onClick="toggle(table${data.invoice[i].id})">Errors</btn></td>`;
          temp += '</tr><tr>';
          temp += '<td colspan="7">';
          temp += `<a onclick="toggle(table${data.invoice[i].id})">View Error Data-></a>`;
          temp += `<div class="invoicediv hidden" id="table${data.invoice[i].id}">`;
          temp += JSON.stringify(data.invoice[i].errors);
          temp += '</div></td></tr>';
        } else if (data.invoice[i].data?.scmInvoicePaymentCreate) {
          const status = data.invoice[i].data.scmInvoicePaymentCreate;
          if (status.requestStatus.requestStatus === 'PENDING') {
            temp += '<td><btn class="btn btn-success">Success</btn></td>';
          } else if (status.validationResults.errorMessages[0]?.includes('A request already exists for your consumerId and consumerTrackingId')) {
            temp += '<td><a class="btn btn-success">Success</a></td>';
          } else if (status.validationResults.errorMessages) {
            temp += `<td><btn class="btn btn-danger" onClick="toggle(table${data.invoice[i].id})">Errors</btn></td>`;
            temp += '</tr><tr>';
            temp += '<td colspan="7">';
            temp += `<a onclick="toggle(table${data.invoice[i].id})">View Error Data-></a>`;
            temp += `<div class="invoicediv hidden" id="table${data.invoice[i].id}">`;
            temp += JSON.stringify(status.validationResults.errorMessages);
            temp += '</div></td></tr>';
          }
          temp += '</tr>';
        } else if (data.invoice[i].data?.scmInvoicePaymentSearch) {
          const search = data.invoice[i].data.scmInvoicePaymentSearch;
          if (search.metadata.returnedResultCount === 0) {
            temp += '<td><btn class="btn btn-danger">NOT FOUND</btn></td>';
          } else if (search.data[0].paymentStatusCode === 'Y') {
            temp += `<td><btn class="btn btn-success" onClick="toggle(table${data.invoice[i].id})">PAYMENT SCHEDULED</btn></td>`;
          } else if (search.data[0].paymentStatusCode === 'N') {
            temp += `<td><btn class="btn btn-warning" onClick="toggle(table${data.invoice[i].id})">NOT YET PAID</btn></td>`;
          }
          temp += '</tr><tr>';
          temp += '<td colspan="7">';
          temp += `<a onclick="toggle(table${data.invoice[i].id})">View Payment Data-></a>`;
          temp += `<div class="invoicediv hidden" id="table${data.invoice[i].id}">`;
          temp += JSON.stringify(search.data[0]);
          temp += '</div></td></tr>';
        } else {
          temp += '<td></td></tr>';
        }
      }
    }

    if (version === 'preview') {
      temp += `<tr>
      <td colspan="3" class="noborder"></td>
      <td><span id="fundscontainer"><span id="fundCodes"></span></span></td>
      <td><span id="totalcontainer">$<span id="total"></span></span><span id="total2" class="hidden">$${invoicestotal}</span></td>
      <td class="noborder"><input type="checkbox" onClick="checkall(this)" />Select All</td>
      </tr>`;
    }

    temp += '</table>';
    if (version === 'preview') temp += '<button type="submit" class="btn--primary">Submit</button>';
    temp += '</form>';

    return temp;
  } catch (error) {
    logMessage('DEBUG', 'tables: basicDataTable()', error);
  }
}

export async function almatoHTMLTablePreview(input) {
  try {
    const step1 = await setSelectedData([input]);
    const data = await reformatAlmaInvoiceforAPI(step1);

    if (!data) return '<p>No data found</p>';

    let temp = '<h3>Invoice Data</h3>';
    temp += `<p>${data.length} invoices found</p>`;

    for (let i = 0; i < data.length; i++) {
      const oracleinvoicenumber = [{ filter: { invoiceNumber: { contains: data[i].data.header.consumerTrackingId } } }];
      const aeinvoicenumber = [{ consumerTrackingId: data[i].data.header.consumerTrackingId }];
      const oracledata = await checkStatusInOracle(oracleinvoicenumber);
      const aggieenterprisedata = await checkPayments(aeinvoicenumber);
      const header = data[i].data.header;
      const payload = data[i].data.payload;
      const invoiceLines = data[i].data.payload.invoiceLines;

      temp += '<div style="display: flex;"><div>';
      temp += `<div class="invoice-header"><h4>Invoice ${i + 1} - ${header.consumerTrackingId}</h4>`;
      if (!input) temp += `<button onClick="toggle(table${i})">show</button>`;
      temp += `</div><br><table id="table${i}" class="invoicediv">`;

      for (const [key, value] of Object.entries(header)) {
        temp += `<tr><td>${key}</td><td>${value}</td></tr>`;
      }

      for (const [key, value] of Object.entries(payload)) {
        if (key === 'invoiceLines') {
          temp += `<tr><td>${key} (${invoiceLines.length})</td><td>`;
          for (const invoice of invoiceLines) {
            temp += '<table class="invoice-lines">';
            for (const [k, v] of Object.entries(invoice)) {
              if (k === 'glSegments') {
                temp += '<tr><td>glSegments</td><td><table>';
                for (const [sk, sv] of Object.entries(v)) temp += `<tr><td>${sk}</td><td>${sv}</td></tr>`;
                temp += '</table></td></tr>';
              } else if (k === 'ppmSegments') {
                temp += '<tr><td>ppmSegments</td><td><table>';
                for (const [sk, sv] of Object.entries(v)) temp += `<tr><td>${sk}</td><td>${sv}</td></tr>`;
                temp += '</table></td></tr>';
              } else {
                temp += `<tr><td>${k}</td><td>${v}</td></tr>`;
              }
            }
            temp += '</table>';
          }
          temp += '</td></tr>';
        } else {
          temp += `<tr><td>${key}</td><td>${value}</td></tr>`;
        }
      }

      temp += '</table></div><div>';
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
  } catch (error) {
    logMessage('DEBUG', 'tables: almatoHTMLTablePreview()', error);
  }
}

export async function almatoHTMLTableComplete(input) {
  try {
    const step1 = await setSelectedData([input]);
    const data = await reformatAlmaInvoiceforAPI(step1);
    const dbinvoicedata = await fetchInvoiceByInvoiceId(input);
    const consumerTrackingId = dbinvoicedata?.consumerTrackingId ?? '';

    if (!data) return '';

    const oracleinvoicenumber = [{ filter: { invoiceNumber: { contains: data[0].data.payload.invoiceNumber } } }];
    const aeinvoicenumber = [{ consumerTrackingId: consumerTrackingId.length > 0 ? consumerTrackingId : data[0].data.header.consumerTrackingId }];
    const oracledata = await checkStatusInOracle(oracleinvoicenumber);
    const aggieenterprisedata = await checkPayments(aeinvoicenumber);

    let temp = '<h3>Invoice Data</h3>';
    temp += `<p>${data.length} invoices found</p>`;

    for (let i = 0; i < data.length; i++) {
      const header = data[i].data.header;
      const payload = data[i].data.payload;
      const invoiceLines = data[i].data.payload.invoiceLines;

      temp += '<div style="display: flex;"><div>';
      temp += `<div class="invoice-header"><h4>Invoice ${i + 1} - ${header.consumerTrackingId}</h4>`;
      if (!input) temp += `<button onClick="toggle(table${i})">show</button>`;
      temp += `</div><br><table id="table${i}" class="invoicediv">`;

      for (const [key, value] of Object.entries(header)) {
        temp += `<tr><td>${key}</td><td>${consumerTrackingId.length > 0 && key === 'consumerTrackingId' ? consumerTrackingId : value}</td></tr>`;
      }

      for (const [key, value] of Object.entries(payload)) {
        if (key === 'invoiceLines') {
          temp += `<tr><td>${key} (${invoiceLines.length})</td><td>`;
          for (const invoice of invoiceLines) {
            temp += '<table class="invoice-lines">';
            for (const [k, v] of Object.entries(invoice)) {
              if (k === 'glSegments') {
                temp += '<tr><td>glSegments</td><td><table>';
                for (const [sk, sv] of Object.entries(v)) temp += `<tr><td>${sk}</td><td>${sv}</td></tr>`;
                temp += '</table></td></tr>';
              } else if (k === 'ppmSegments') {
                temp += '<tr><td>ppmSegments</td><td><table>';
                for (const [sk, sv] of Object.entries(v)) temp += `<tr><td>${sk}</td><td>${sv}</td></tr>`;
                temp += '</table></td></tr>';
              } else {
                temp += `<tr><td>${k}</td><td>${v}</td></tr>`;
              }
            }
            temp += '</table>';
          }
          temp += '</td></tr>';
        } else {
          temp += `<tr><td>${key}</td><td>${value}</td></tr>`;
        }
      }

      temp += '</table></div><div>';
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
  } catch (error) {
    logMessage('DEBUG', 'tables: almatoHTMLTableComplete()', error);
  }
}
