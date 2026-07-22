import { logMessage } from '../util/logger.js';

export async function getAlmaIndividualInvoiceData(invoiceIds) {
  try {
    const baseUrl = 'http://alma-proxy:5555/almaws/v1/acq/invoices';
    const requests = invoiceIds.map((invoiceId) =>
      fetch(`${baseUrl}/${invoiceId}?expand=none`).then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch invoice ${invoiceId}: ${response.status}`);
        }
        return response.json();
      })
    );
    const invoices = await Promise.all(requests);
    return { invoice: invoices };
  } catch (error) {
    logMessage('DEBUG', 'almaapicalls: getAlmaIndividualInvoiceData()', error.message);
    return null;
  }
}

export async function getAlmaInvoicesWaitingToBeSent(owner) {
  try {
    const url = `http://alma-proxy:5555/almaws/v1/acq/invoices/?q=all&limit=99&offset=0&expand=none&invoice_workflow_status=Waiting%20to%20be%20Sent&owner=${owner}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    logMessage('DEBUG', 'almaapicalls: getAlmaInvoicesWaitingToBeSent()', error.message);
    return null;
  }
}

export async function getAlmaInvoicesReadyToBePaid(owner, offset = 0) {
  try {
    const url = `http://alma-proxy:5555/almaws/v1/acq/invoices/?q=all&limit=99&offset=${offset}&expand=none&invoice_workflow_status=Ready%20to%20be%20Paid&owner=${owner}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    logMessage('DEBUG', 'almaapicalls: getAlmaInvoicesReadyToBePaid()', error.message);
    return null;
  }
}

export async function getVendorDataBatch(vendorarray) {
  try {
    const requests = vendorarray.map((vendorcode) =>
      fetch(`http://alma-proxy:5555/almaws/v1/acq/vendors/${vendorcode}`)
    );
    const responses = await Promise.all(requests);
    const errors = responses.filter((r) => !r.ok);
    if (errors.length > 0) throw errors.map((r) => new Error(r.statusText));
    return await Promise.all(responses.map((r) => r.json()));
  } catch (error) {
    logMessage('DEBUG', 'almaapicalls: getVendorDataBatch()', error.message);
  }
}

export async function getFundData(fundCode, library) {
  try {
    const url = `http://alma-proxy:5555/almaws/v1/acq/funds?limit=1&q=fund_code~${fundCode}&library=${library}&view=brief&mode=POL&status=ALL&entity_type=ALL&fiscal_period=ALL&parent_id=ALL&owner=ALL`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    logMessage('DEBUG', 'almaapicalls: getFundData()', error.message);
  }
}

export async function setSelectedData(invoiceids) {
  try {
    const data = { invoice: [] };
    for (const invoice of invoiceids) {
      const invoicedata = await fetch(
        `http://alma-proxy:5555/almaws/v1/acq/invoices/${invoice}?expand=none`
      ).then((r) => r.json());
      data.invoice.push(invoicedata);
    }
    return data;
  } catch (error) {
    logMessage('DEBUG', 'almaapicalls: setSelectedData()', error.message);
  }
}

export async function getVendorData(vendorcode) {
  try {
    const response = await fetch(`http://alma-proxy:5555/almaws/v1/acq/vendors/${vendorcode}`);
    return await response.json();
  } catch (error) {
    logMessage('DEBUG', 'almaapicalls: getVendorData()', error.message);
  }
}

export async function getVendorPoLines(vendorcode) {
  const limit = 100;
  let offset = 0;
  let total = null;
  const poLines = [];
  const encodedVendorCode = encodeURIComponent(vendorcode);

  try {
    do {
      const response = await fetch(
        `http://alma-proxy:5555/almaws/v1/acq/vendors/${encodedVendorCode}/po-lines?limit=${limit}&offset=${offset}`
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      poLines.push(...(data.po_line || []));
      total = Number(data.total_record_count ?? poLines.length);
      offset += limit;
    } while (offset < total);

    return { po_line: poLines };
  } catch (error) {
    logMessage('DEBUG', 'almaapicalls: getVendorPoLines()', error.message);
  }
}

export async function getFundDataByID(fundcode) {
  try {
    const response = await fetch(`http://alma-proxy:5555/almaws/v1/acq/funds/${fundcode}`);
    return await response.json();
  } catch (error) {
    logMessage('DEBUG', 'almaapicalls: getFundDataByID()', error.message);
  }
}

export async function getSingleInvoiceData(invoiceid) {
  try {
    const response = await fetch(`http://alma-proxy:5555/almaws/v1/acq/invoices/${invoiceid}?expand=none`);
    return await response.json();
  } catch (error) {
    logMessage('DEBUG', 'almaapicalls: getSingleInvoiceData()', error.message);
  }
}

export async function putSingleInvoiceData(invoiceid, payload) {
  try {
    const response = await fetch(
      `http://alma-proxy:5555/almaws/v1/acq/invoices/${invoiceid}?expand=none`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    return await response.json();
  } catch (error) {
    logMessage('DEBUG', 'almaapicalls: putSingleInvoiceData()', error.message);
  }
}

export async function getAlmaIndividualInvoiceXML(invoice) {
  try {
    const response = await fetch(`http://alma-proxy:5555/almaws/v1/acq/invoices/${invoice}?expand=none`);
    return await response.json();
  } catch (error) {
    logMessage('DEBUG', 'almaapicalls: getAlmaIndividualInvoiceXML()', error.message);
  }
}
