exports.getAlmaIndividualInvoiceData = async (invoiceIds) => {
  try {
    const baseUrl = "http://alma-proxy:5555/almaws/v1/acq/invoices";

    // Fetch all invoices concurrently
    const requests = invoiceIds.map((invoiceId) =>
      fetch(`${baseUrl}/${invoiceId}?expand=none`).then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch invoice ${invoiceId}: ${response.status}`);
        }
        return response.json();
      })
    );

    const invoices = await Promise.all(requests);

    // Mimic bulk invoice structure
    const data = { invoice: invoices };

    return data;
  } catch (error) {
    console.error("Error fetching individual invoice data:", error.message);
    return null; // Return null to indicate failure
  }
};
  
  exports.getAlmaInvoicesWaitingToBeSent = async (owner) => {
    try {
      const url = `http://alma-proxy:5555/almaws/v1/acq/invoices/?q=all&limit=99&offset=0&expand=none&invoice_workflow_status=Waiting%20to%20be%20Sent&owner=${owner}`;
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Failed to fetch Alma invoices: ${error.message}`);
      return null; // Return null or an empty object to indicate failure
    }
  };

  exports.getAlmaInvoicesReadyToBePaid = async (owner, offset = 0) => {
    try {
      const baseUrl = `http://alma-proxy:5555/almaws/v1/acq/invoices/`;
      const queryParams = `?q=all&limit=99&offset=${offset}&expand=none&invoice_workflow_status=Ready%20to%20be%20Paid&owner=${owner}`;
      const url = `${baseUrl}${queryParams}`;
  
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Failed to fetch invoices ready to be paid: ${error.message}`);
      return null; // Return null to indicate failure
    }
  };

exports.getVendorDataBatch = async (vendorarray) => {
    const urls = [];
    for (vendorcode of vendorarray) {
      urls.push(`http://alma-proxy:5555/almaws/v1/acq/vendors/${vendorcode}`);
    }
  
    try {
      const requests = urls.map((url) => fetch(url));
      const responses = await Promise.all(requests);
      const errors = responses.filter((response) => !response.ok);
  
      if (errors.length > 0) {
        throw errors.map((response) => Error(response.statusText));
      }
  
      const json = responses.map((response) => response.json());
      const data = await Promise.all(json);
          
      if (data) {
        return data;
      } 
    }
    catch (error) {
      console.error(error);
    }
  };
  
exports.getFundData = async (fundCode,library) => {
    try {
      const data = await fetch(
      `http://alma-proxy:5555/almaws/v1/acq/funds?limit=1&q=fund_code~${fundCode}&library=${library}&view=brief&mode=POL&status=ALL&entity_type=ALL&fiscal_period=ALL&parent_id=ALL&owner=ALL`
      // `http://alma-proxy:5555/almaws/v1/acq/funds/${fundCode}?view=full`
    ).then(response => response.json());
  
    if (data) {
      return data;
    } 
  } catch(error) {
      console.log(error);
    }
  };
  
exports.setSelectedData = async (invoiceids) => {
    try {
      data = {invoice: []}; // mimics structure of a bulk invoice payload in setData()
      // data = [];
      for (invoice of invoiceids) {
        const invoicedata = await fetch(
          `http://alma-proxy:5555/almaws/v1/acq/invoices/${invoice}?expand=none`
        ).then(response => response.json());
        data.invoice.push(invoicedata);
        }
  
      return data;
  
    }
    catch(error) {console.log(error)};
  
  };

exports.getVendorData = async (vendorcode) => {
    try {
      const data = await fetch(
      `http://alma-proxy:5555/almaws/v1/acq/vendors/${vendorcode}`
    ).then(response => response.json());
  
    if (data) {
      return data;
    } 
  } catch(error) {
      console.log(error);
    }
  };

  exports.getFundDataByID = async (fundcode) => {
    try {
      const data = await fetch(
      `http://alma-proxy:5555/almaws/v1/acq/funds/${fundcode}`
    ).then(response => response.json());
  
    if (data) {
      return data;
    } 
  } catch(error) {
      console.log(error);
    }
  };

  exports.getSingleInvoiceData = async (invoiceid) => {
    try {
      const data = await fetch(
      `http://alma-proxy:5555/almaws/v1/acq/invoices/${invoiceid}?expand=none`
    ).then(response => response.json());
  
    if (data) {
      return data;
    } 
  } catch(error) {
      console.log(error);
    }
  }

  exports.putSingleInvoiceData = async (invoiceid, payload) => {
    try {
      const data = await fetch(
      `http://alma-proxy:5555/almaws/v1/acq/invoices/${invoiceid}?expand=none`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    ).then(response => response.json());
  
    if (data) {
      return data;
    } 
  } catch(error) {
      console.log(error);
    }
  }

  exports.getAlmaIndividualInvoiceXML = async (invoice) => {
    try {
        const data = await fetch(
          `http://alma-proxy:5555/almaws/v1/acq/invoices/${invoice}?expand=none`
        ).then(response => response.json())
      return data;
    }
    catch(error) {console.log(error)};
  }