const {getFundData, getVendorData, getSingleInvoiceData, putSingleInvoiceData} = require('./almaapicalls');
const {getSubmittedInvoices} = require('../controllers/dbcalls');

exports.reformatAlmaInvoiceforAPI = async (data) => {
    let apipayload = [];
    const today = new Date().toLocaleDateString('sv-SE', {
      timeZone: 'America/Los_Angeles',
    });

    // from test app
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


exports.filterOutSubmittedInvoices = async (data, library) => {
      const myarray = data.invoice;

      const data2 = await getSubmittedInvoices(library);
      const alreadysentinvoices = data2[0];

      const invoiceids = [];
      for (i in alreadysentinvoices) {
        invoiceids.push(alreadysentinvoices[i].invoicenumber);
      }
      const filteredinvoices = [];
      for (i in myarray) {
        if (!invoiceids.includes(myarray[i].number)) {
          filteredinvoices.push(myarray[i]);
        }
      }

      data = {invoice: []};
      data.invoice.push(...filteredinvoices);
      return data;
      
  }

  exports.changeInvoiceStatus = async (invoicenumber) => {
    const invoice = await getSingleInvoiceData(invoicenumber);
    if (invoice && invoice.invoice_approval_status.value === 'Waiting to be sent' && invoice.invoice_approval_status.desc === 'Ready to be paid') {
      invoice.invoice_approval_status.value = 'Ready to be Paid';
      invoice.invoice_approval_status.desc = 'Waiting for Payment';
      try {
        const result = await putSingleInvoiceData(invoicenumber, invoice);
        if (result) {
          return true;
        }
      }
      catch (error) {
        console.log(error);
      }
    }
    else {
      console.log('invoice not found or not in correct status');
      return false;
    }


  }