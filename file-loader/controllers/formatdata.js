const {getFundData, getVendorData, getSingleInvoiceData, putSingleInvoiceData, getAlmaIndividualInvoiceXML} = require('./almaapicalls');
const {getSubmittedInvoices, fetchFundCodeFromId, saveFund, fetchVendorDataFromId, saveVendor} = require('./dbcalls');
const { postToSlackChannel } = require('../util/post-to-slack-channel');
const { replaceString } = require('../util/helper-functions');
const fs = require('fs');

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
        const vendordata = await checkForVendorData(vendor);
        
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
              const fundString = await fetchFundCodeFromId(fundCode);
              if (fundString) {
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

  exports.getFundCodes = async (data) => {

  for (j in data.invoice[i].invoice_lines.invoice_line) {
    for (k in data.invoice[i].invoice_lines.invoice_line[j].fund_distribution) {
      const fundAmount = data.invoice[i].invoice_lines.invoice_line[j].fund_distribution[k].amount;
      const fundCode = data.invoice[i].invoice_lines.invoice_line[j].fund_distribution[k].fund_code.value;
      if (fundCode && fundAmount) {
        let fundCodes = [];
        if (fundCodes.includes(fundCode)) {
          fundcodes[fundCode].push(fundAmount);
        }
        else {
          fundCodes.push(fundCode);
        }
      }
    }
  }
}


exports.changeFundIDtoCode = async (fundId) => {
  try {
    const fundCode = await fetchFundCodeFromId(fundId);
    if (fundCode) {
      return fundCode;
    }
    else {
      console.log('fund code not found in database. Trying Alma');
      try {
        const fundData = await getFundData(fundId);
        if (fundData) {
          const fundString = fundData.fund[0].external_id;
          saveFund(fundId, fundString);
          return fundString;
        }
        else {
          return 'unable to return fund data';
        }
      }
      catch (err) {
        console.log(err);
      }
    }
  }
  catch (err) {
    console.log('this is the error im looking 4')
    console.log(err);
  }


}

exports.changeToXML = async (invoicenumber, invoiceid, paymentdata) => {
  let invoice;

  try {
    // Attempt to retrieve the invoice data
    invoice = await getAlmaIndividualInvoiceXML(invoiceid);
  } catch (fetchError) {
    console.log(`Error fetching invoice data for invoice ${invoicenumber}:`, fetchError);

    // Notify Slack of fetch error
    try {
      await postToSlackChannel(`Error fetching invoice data for invoice ${invoicenumber}`);
    } catch (slackErr) {
      console.error('Failed to notify Slack of fetch error:', slackErr);
    }

    // Exit function early since we can't proceed without the invoice data
    return;
  }

  // Proceed with XML creation if invoice data is retrieved successfully
  const paymentdate = paymentdata.paymentDate.replace(/-/g, '');
  const sum = paymentdata.paymentAmount === null ? 0 : paymentdata.paymentAmount;
  const vendor = replaceString(invoice.vendor.value, '&', '&amp;'); // Handle vendor encoding

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <payment_confirmation_data xmlns="http://com/exlibris/repository/acq/xmlbeans">
     <invoice_list>
        <invoice>
           <invoice_number>${invoicenumber}</invoice_number>
           <unique_identifier>${invoiceid}</unique_identifier>
           <invoice_date>${paymentdata.invoiceDate}</invoice_date>
           <vendor_code>${vendor}</vendor_code>
           <payment_status>PAID</payment_status>
           <payment_voucher_date>${paymentdate}</payment_voucher_date>
           <payment_voucher_number>${paymentdata.checkNumber}</payment_voucher_number>
           <voucher_amount>
              <currency>USD</currency>
              <sum>${sum}</sum>
           </voucher_amount>
        </invoice>
     </invoice_list>
  </payment_confirmation_data>`;

  try {
    fs.writeFileSync(`./almadafis/aeinput/update_alma_${invoiceid}.xml`, xml);
    console.log('File written successfully');
  } catch (writeError) {
    console.log(`Error writing file for invoice ${invoicenumber}:`, writeError);

    // Attempt to notify Slack of write error
    try {
      await postToSlackChannel(`Error writing file for invoice ${invoicenumber}`);
    } catch (slackErr) {
      console.error('Failed to notify Slack of write error:', slackErr);
    }
  }
};

checkForVendorData = async (vendorId) => {
  try {
    const vendordatastring = await fetchVendorDataFromId(vendorId);
    if (vendordatastring === undefined) {
      console.log('vendor not found in database. Trying Alma');
      try {
        const vendorData = await getVendorData(vendorId);
        if (vendorData) {
          saveVendor(vendorId, vendorData);
          return vendorData;
        }
      }
      catch (err) {
        console.log(err);
      }
    }
    else if (vendordatastring) {
      const vendordata = JSON.parse(vendordatastring);
      return vendordata;
    }
  }
  catch (error) {
    console.log(error);
  }
};