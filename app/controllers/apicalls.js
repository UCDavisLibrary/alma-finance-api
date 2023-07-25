exports.getAlmaIndividualInvoiceData = async (invoiceids) => {
    console.log(invoiceids);
    try {
      data = {invoice: []}; // mimics structure of a bulk invoice payload in setData()
      // data = [];
      for (invoice of invoiceids) {
        // console.log(invoice);
        const invoicedata = await fetch(
          `http://alma-proxy:5555/almaws/v1/acq/invoices/${invoice}?expand=none`
        ).then(response => response.json());
        // console.log(invoicedata);
        data.invoice.push(invoicedata);
        }
  
      // console.log('apipayload ' + JSON.stringify(apipayload));
      return data;
  
    }
    catch(error) {console.log(error)};
  }

exports.simpleInvoice = async () => {
    try {
      const data = await fetch(
        'http://alma-proxy:5555/almaws/v1/acq/invoices/?q=all&limit=20&offset=0&expand=none&invoice_workflow_status=Waiting%20to%20be%20Sent'
      ).then(response => response.json());
  
        // console.log(data);
        let apipayload = [];
    
        // console.log(`today is ${today}`);
        // from test app
        for (i in data.invoice) {
  
          apipayload.push({
            // consumerId: data.invoice[i].owner.value === 'LAW' ? 'UCD LawLibrary' : 'UCD GeneralLibrary',
            // consumerReferenceId: data.invoice[i].id,
            consumerTrackingId: data.invoice[i].number,
          });
  
        }
        // console.log(JSON.stringify(apipayload[0]));
        // console.log(JSON.stringify(apipayload));
        return apipayload;

    }
    catch(error) {console.log(error)};
  
  
  };
  
exports.getAlmaInvoicesWaitingToBESent = async () => {
    const data = await fetch(
      'http://alma-proxy:5555/almaws/v1/acq/invoices/?q=all&limit=20&offset=0&expand=none&invoice_workflow_status=Waiting%20to%20be%20Sent'
    ).then(response => response.json());
    return data;
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
  
exports.getFundData = async (fundCode) => {
    try {
      const data = await fetch(
      `http://alma-proxy:5555/almaws/v1/acq/funds?limit=10&offset=0&q=fund_code~${fundCode}&view=brief&mode=POL&status=ALL&entity_type=ALL&fiscal_period=ALL&parent_id=ALL&owner=ALL`
      // `http://alma-proxy:5555/almaws/v1/acq/funds/${fundCode}?view=full`
    ).then(response => response.json());
  
    if (data) {
      return data;
    } 
  } catch(error) {
      console.log(error);
    }
  };
  
// exports.setData = async () => {
//     try {
//       const data = await fetch(
//         'http://alma-proxy:5555/almaws/v1/acq/invoices/?q=all&limit=20&offset=0&expand=none&invoice_workflow_status=Waiting%20to%20be%20Sent'
//       ).then(response => response.json());
  
//         const apipayload = await reformatAlmaInvoiceforAPI(data);
//         return apipayload;
  
//     }
//     catch(error) {console.log(error)};
  
//   };
  
exports.setSelectedData = async (invoiceids) => {
    console.log(invoiceids);
    try {
      data = {invoice: []}; // mimics structure of a bulk invoice payload in setData()
      // data = [];
      for (invoice of invoiceids) {
        // console.log(invoice);
        const invoicedata = await fetch(
          `http://alma-proxy:5555/almaws/v1/acq/invoices/${invoice}?expand=none`
        ).then(response => response.json());
        // console.log(invoicedata);
        data.invoice.push(invoicedata);
        }
  
      // console.log('apipayload ' + JSON.stringify(apipayload));
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