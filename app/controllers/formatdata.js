import { paymentInvoiceLines } from './invoice-lines.js';
import { createReferenceResolver } from './reference-data.js';
import { getFundData, getVendorData, getSingleInvoiceData, putSingleInvoiceData, getAlmaIndividualInvoiceXML } from './almaapicalls.js';
import { getSubmittedInvoices, fetchFundCodeFromId, saveFund, fetchVendorDataFromId, saveVendor } from './dbcalls.js';
import { getPoLineTitle } from './po-lines.js';
import { generateRandomNumber } from '../util/helper-functions.js';
import fs from 'fs';
import { logMessage } from '../util/logger.js';

export async function reformatAlmaInvoiceforAPI(data, library, { fresh = false } = {}) {
  let apipayload = [];
  const references = createReferenceResolver({ fetchVendorDataFromId, getVendorData, saveVendor, fetchFundCodeFromId, getFundData, saveFund });
  const poLineCache = new Map();

  for (let i = 0; i < data.invoice.length; i++) {
    let nozee = data.invoice[i].invoice_date;
    if (typeof nozee === 'string' && nozee.endsWith('Z')) {
      nozee = nozee.slice(0, -1);
    }

    const lines = paymentInvoiceLines(data.invoice[i]);
    const vendor = data.invoice[i].vendor?.value;
    if (!vendor) throw new Error(`Invoice ${data.invoice[i].number}: missing vendor code.`);
    const vendordata = await references.vendor(vendor, fresh);
    const payload = {
      data: {
        header: {
          boundaryApplicationName: 'Library Check Processing',
          consumerId: 'UCD GeneralLibrary',
          consumerReferenceId: data.invoice[i].id,
          consumerTrackingId: data.invoice[i].number + '-' + generateRandomNumber(0, 99),
        },
        payload: {
          businessUnit: 'UCD Business Unit',
          invoiceDescription: data.invoice[i].vendor.desc,
          invoiceAmount: data.invoice[i].total_amount,
          invoiceDate: nozee,
          invoiceNumber: data.invoice[i].number,
          invoiceSourceCode: 'UCD GeneralLibrary',
          invoiceType: data.invoice[i].total_amount < 0 ? 'CREDIT' : 'STANDARD',
          paymentMethodCode: 'ACCOUNTINGDEPARTMENT',
          paymentTerms: 'IMMEDIATE',
          purchaseOrderNumber: '',
          supplierNumber: vendordata.financial_sys_code,
          supplierSiteCode: vendordata.additional_code,
          invoiceLines: [],
        },
      },
    };
    apipayload.push(payload);

    for (const line of lines) {
      const quantity = line.quantity && line.quantity > 0 ? line.quantity : 1;
      const poLineTitle = await getPoLineTitle(line, vendor, poLineCache);
      const object1 = {
        itemName: '',
        itemDescription: poLineTitle || line.id,
        lineAmount: line.price,
        lineType: 'ITEM',
        purchaseOrderLineNumber: line.number,
        purchasingCategory: '',
        quantity,
        unitOfMeasure: 'Each',
        unitPrice: line.price,
      };

      for (let k = 0; k < line.fund_distribution.length; k++) {
        const fundCode =
          typeof line.fund_distribution[k].fund_code?.value === 'string'
            ? line.fund_distribution[k].fund_code.value.trim()
            : line.fund_distribution[k].fund_code?.value;
        if (!fundCode) throw new Error(`Invoice ${data.invoice[i].number}, line ${line.number}: missing fund code.`);

        const fundString = await references.fund(fundCode, library, fresh);

        let merged;
        if (!fundString.includes('|')) {
          const parts = fundString.split('.');
          merged = {
            ...object1,
            glSegments: {
              entity: parts[0],
              fund: parts[1],
              department: parts[2],
              account: parts[3],
              purpose: parts[4],
            },
          };
        } else {
          const parts = fundString.split('|');
          merged = {
            ...object1,
            ppmSegments: {
              project: parts[0],
              organization: parts[1],
              expenditureType: parts[2],
              task: parts[3],
            },
          };
        }

        payload.data.payload.invoiceLines.push(merged);
      }
    }
  }

  return apipayload;
}

export async function filterOutSubmittedInvoices(data, library) {
  const myarray = data.invoice;
  const data2 = await getSubmittedInvoices(library);
  const alreadysentinvoices = data2[0];
  const sentNumbers = new Set(alreadysentinvoices.map((inv) => inv.invoicenumber));
  const filteredinvoices = [];

  for (const invoice of myarray) {
    if (sentNumbers.has(invoice.number)) {
      logMessage('INFO', 'formatdata: filterOutSubmittedInvoices() ' + invoice.number + ' already sent');
    } else {
      logMessage('INFO', 'formatdata: filterOutSubmittedInvoices() ' + invoice.number + ' not sent');
      filteredinvoices.push(invoice);
    }
  }

  return { invoice: filteredinvoices };
}

export async function changeFundIDtoCode(fundId, library) {
  try {
    const fundCode = await fetchFundCodeFromId(fundId);
    if (fundCode) return fundCode;

    logMessage('DEBUG', `formatdata: changeFundIDtoCode(). fund code ${fundId} for ${library} not found in database. Trying Alma`);
    try {
      const fundData = await getFundData(fundId, library);
      if (fundData) {
        const fundString = fundData.fund[0].external_id;
        saveFund(fundId, fundString);
        return fundString;
      }
      return 'unable to return fund data';
    } catch (err) {
      logMessage('DEBUG', 'formatdata: changeFundIDtoCode()', err);
    }
  } catch (err) {
    logMessage('DEBUG', 'formatdata: changeFundIDtoCode()', err);
  }
}

export async function changeToXML(invoicenumber, invoiceid, paymentdata) {
  const invoice = await getAlmaIndividualInvoiceXML(invoiceid);
  const paymentdate = paymentdata.paymentDate.replace(/-/g, '');
  const sum = paymentdata.paymentAmount === null ? 0 : paymentdata.paymentAmount;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <payment_confirmation_data xmlns="http://com/exlibris/repository/acq/xmlbeans">
     <invoice_list>
        <invoice>
           <invoice_number>${invoicenumber}</invoice_number>
           <unique_identifier>${invoiceid}</unique_identifier>
           <invoice_date>${paymentdata.invoiceDate}</invoice_date>
           <vendor_code>${invoice.vendor.value}</vendor_code>
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
    logMessage('INFO', `formatdata: changeToXML(). ${invoiceid} file written`);
  } catch (err) {
    logMessage('DEBUG', `formatdata: changeToXML(). ${invoiceid}`, err);
  }
}
