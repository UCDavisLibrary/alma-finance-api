// const firstTest = require('./firstTest.json');

// const sit2TEst = require('../json/sit2Test.json');
// const sentRequests = require('../json/mySentRequests.json');

const routes = require('../routes/routes')

async function almatoHTMLTableComplete(input, requestResponse) {
  try {

    const checkdata = async () => {
    if (input) {
      let step1 = await setSelectedData([input]);
      let data = await reformatAlmaInvoiceforAPI(step1);
      return data;
    }
    else {
      let data = await setData();
      return data;
    }
  }
    const data = await checkdata(input);
    if (data) {

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
          }
          temp += '</div>';
        temp += '</div>';
      }
    }
  
    return temp;
  }
  catch (error) {
    console.log(error);
  }

}





const reformatAlmaInvoiceforAPI = async (data) => {
        let apipayload = [];
        const today = new Date().toLocaleDateString('sv-SE', {
          timeZone: 'America/Los_Angeles',
        });
    
        for (i in data.invoice) {
          let nozee = data.invoice[i].invoice_date;
          if (nozee.includes('Z')) {
            nozee = nozee.substring(0, nozee.length - 1);
          } else {
            nozee = data.invoice[i].invoice_date;
          }
          const vendor = data.invoice[i].vendor.value;
  
          try {
            const vendordata = await getVendorData(vendor);
            
            if (vendordata) {
              apipayload.push({
                data: {
                  header: {
                    boundaryApplicationName: 'Library Check Processing',
                    // consumerId: data.invoice[i].owner.value === 'LAW' ? 'UCD LawLibrary' : 'UCD GeneralLibrary',
                    consumerId: 'UCD GeneralLibrary',
                    consumerReferenceId: data.invoice[i].id,
                    consumerTrackingId: data.invoice[i].number,
                  },
                  payload: {
                    // accountingDate: today,
                    businessUnit: 'UCD Business Unit',
                    invoiceDescription: data.invoice[i].vendor.desc,
                    invoiceAmount: data.invoice[i].total_amount,
                    invoiceDate: nozee,
                    invoiceNumber: data.invoice[i].number,
                    invoiceSourceCode: 'UCD GeneralLibrary',
                    // invoiceSourceCode: data.invoice[i].owner.value === 'LAW' ? 'UCD LawLibrary' : 'UCD GeneralLibrary',
                    invoiceType: 'STANDARD',
                    paymentMethodCode: 'ACCOUNTINGDEPARTMENT',
                    paymentTerms: 'IMMEDIATE',
                    purchaseOrderNumber: '',
                    supplierNumber: vendordata.financial_sys_code,
                    supplierSiteCode: vendordata.additional_code,
                    invoiceLines: [],
                  },
                },
              });
            }
  
          }
  
          catch (error) {
            console.log(error);
          }
  
    
          for (j in data.invoice[i].invoice_lines.invoice_line) {
            let object1 = {
              // itemName: data.invoice[i].invoice_lines.invoice_line[j].name, // should be vendor name  ok to leave blank
              itemName: '',
              itemDescription: data.invoice[i].invoice_lines.invoice_line[j].id,
              lineAmount: data.invoice[i].invoice_lines.invoice_line[j].price,
              lineType: 'ITEM',
              purchaseOrderLineNumber:
                data.invoice[i].invoice_lines.invoice_line[j].number,
              purchasingCategory: '',
              quantity:
                data.invoice[i].invoice_lines.invoice_line[j].quantity > 0
                  ? data.invoice[i].invoice_lines.invoice_line[j].quantity
                  : 1,
              unitOfMeasure: 'Each',
              unitPrice: data.invoice[i].invoice_lines.invoice_line[j].price,
            }
            for (k in data.invoice[i].invoice_lines.invoice_line[j].fund_distribution) {
              const fundCode = data.invoice[i].invoice_lines.invoice_line[j].fund_distribution[k].fund_code.value;
              if (fundCode) {
                try {
                  const fundData = await getFundData(fundCode);
                  if (fundData.fund) {
                    const fundString = fundData.fund[0].external_id;
                    if (fundString.includes(".")) {
                    const glString = fundString;
                    const entity = glString.split(".")[0];
                    const fund = glString.split(".")[1];
                    const department = glString.split(".")[2];
                    const account = glString.split(".")[3];
                    const purpose = glString.split(".")[4];
                    let object2 = {
                      // percent: data.invoice[i].invoice_lines.invoice_line[j].fund_distribution[k].percent,
                      glSegments: {
                        entity: entity,
                        fund: fund,
                        department: department,
                        account: account,
                        purpose: purpose
                      }
                    };
                    let merged = {...object1, ...object2};
                    apipayload[i].data.payload.invoiceLines.push(merged);
                  }
                  else if (fundString.includes("|")) {
                    const poetString = fundString;
                    const project = poetString.split("|")[0];
                    const organization = poetString.split("|")[1];
                    const expenditureType = poetString.split("|")[2];
                    const task = poetString.split("|")[3];
                    let object2 = {
                      ppmSegments: {
                        project: project,
                        organization: organization,
                        expenditureType: expenditureType,
                        task: task,
                      }
                    }
                    let merged = {...object1, ...object2};
                    apipayload[i].data.payload.invoiceLines.push(merged);
                  }
                  }
                  else {
                    let object2 = {fundData: "ERROR: unable to retrieve fund data"};
                    let merged = {...object1, ...object2};
                    apipayload[i].data.payload.invoiceLines.push(merged);
                  }
                }
                catch (err) {
                  console.log(err);
                }
              }
            }
  
          }
  
        }

        return apipayload;
      }











