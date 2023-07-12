// const firstTest = require('./firstTest.json');

// const sit2TEst = require('../json/sit2Test.json');
// const sentRequests = require('../json/mySentRequests.json');

const routes = require('../routes/routes')

async function almatoHTMLTable() {

  try { 
    const data = await setData();
    if (data) {

    // console.log(data);
    var temp = '';
    temp += '<h3>Invoice Data</h3>';
    temp += '<p>';
    temp += data.length;
    temp += ' invoices found</p>';
    temp += '<table>'
      const keyheader = data[0].data.header;
      const keypayload = data[0].data.payload;
  
      temp += '<tr>';
      for (const [key, value] of Object.entries(keyheader)) {
        if (key !== 'boundaryApplicationName') {
          temp += '<th>';
          temp += key;
          temp += '</th>';
        }
      }
      for (const [key, value] of Object.entries(keypayload)) {
        if (key === 'invoiceLines' || key === 'businessUnit' || key === 'invoiceSourceCode' || key === 'invoiceType' || key === 'paymentMethodCode' || key === 'paymentTerms' || key === 'purchaseOrderNumber' || key === 'accountingDate') {
          // do nothing
        } else {

          temp += '<th>';
          temp += key;
          temp += '</th>';
        }
      }
      temp += '</tr>';
    for (i in data) {
      const header = data[i].data.header;
      const payload = data[i].data.payload;
  
      temp += '<tr>';
  
      for (const [key, value] of Object.entries(header)) {
        if (key !== 'boundaryApplicationName') {
        temp += '<td>';
        temp += value;
        temp += '</td>';
        }
      }
      for (const [key, value] of Object.entries(payload)) {
        if (key === 'invoiceLines' || key === 'businessUnit' || key === 'invoiceSourceCode' || key === 'invoiceType' || key === 'paymentMethodCode' || key === 'paymentTerms' || key === 'purchaseOrderNumber' || key === 'accountingDate') {
          // do nothing
        } else {
          temp += '<td>';
          temp += value;
          temp += '</td>';
        }
      }
      temp += '</tr>';
    }
    temp += '</table>';

    return temp;
  }
  }
  catch (error) {
    console.log(error);
  }

}

async function almatoHTMLTableComplete(input) {
  // console.log(input);

  try {

    const checkdata = async () => {
    if (input) {
      let data = await setSelectedData(input);
      return data;
    }
    else {
      let data = await setData();
      return data;
    }
  }
    const data = await checkdata(input);
    if (data) {

    // console.log(data);
    var temp = '';
    temp += '<h3>Invoice Data</h3>';
    temp += '<p>';
    temp += data.length;
    temp += ' invoices found</p>';
    for (i in data) {
      const header = data[i].data.header;
      const payload = data[i].data.payload;
      const invoiceLines = data[i].data.payload.invoiceLines;
  
      temp += '<div class="invoice-header"><h4>Invoice ';
      temp += parseInt(i) + 1;
      temp += ' - ';
      temp += header.consumerTrackingId;
      temp += '</h4>  <button onClick="toggle(table';
      temp += i;
      temp += ')">show</button></div><br>';
      temp += '<table id="table';
      temp += i;
      temp += '"class="invoicediv hidden">';
  
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
    }
  
    return temp;
  }
  }
  catch (error) {
    console.log(error);
  }

}

const getVendorData = async (vendorcode) => {
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

const getFundData = async (fundCode) => {
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

const setData = async () => {
  try {
    const data = await fetch(
      'http://alma-proxy:5555/almaws/v1/acq/invoices/?q=all&limit=20&offset=0&expand=none&invoice_workflow_status=Waiting%20to%20be%20Sent'
    ).then(response => response.json());

      const apipayload = await reformatAlmaInvoiceforAPI(data);
      return apipayload;

  }
  catch(error) {console.log(error)};

};

const setSelectedData = async (invoiceids) => {
  // console.log(invoiceids);
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

    const apipayload = await reformatAlmaInvoiceforAPI(data);
    // console.log('apipayload ' + JSON.stringify(apipayload));
    return apipayload;

  }
  catch(error) {console.log(error)};

};

const reformatAlmaInvoiceforAPI = async (data) => {
        // console.log('data length is : ' + data.length);
        let apipayload = [];
        const today = new Date().toLocaleDateString('sv-SE', {
          timeZone: 'America/Los_Angeles',
        });
    
        // console.log(`today is ${today}`);
        // from test app
        for (i in data.invoice) {
          let nozee = data.invoice[i].invoice_date;
          if (nozee.includes('Z')) {
            nozee = nozee.substring(0, nozee.length - 1);
          } else {
            nozee = data.invoice[i].invoice_date;
          }
          const vendor = data.invoice[i].vendor.value;
          // console.log(`Vendor is ${vendor}`);
  
          try {
            const vendordata = await getVendorData(vendor);
            // console.log('vendor data is ' + JSON.stringify(vendordata));
            
            if (vendordata) {
              apipayload.push({
                data: {
                  header: {
                    boundaryApplicationName: 'Library Check Processing',
                    consumerId: data.invoice[i].owner.value === 'LAW' ? 'UCD LawLibrary' : 'UCD GeneralLibrary',
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
                    invoiceSourceCode: data.invoice[i].owner.value === 'LAW' ? 'UCD LawLibrary' : 'UCD GeneralLibrary',
                    invoiceType: 'STANDARD',
                    paymentMethodCode: 'ACCOUNTINGDEPARTMENT',
                    paymentTerms: 'Immediate',
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
              // console.log('fund distribution' + JSON.stringify(data.invoice[i].invoice_lines.invoice_line[j].fund_distribution));
              const fundCode = data.invoice[i].invoice_lines.invoice_line[j].fund_distribution[k].fund_code.value;
              if (fundCode) {
                try {
                  const fundData = await getFundData(fundCode);
                  // console.log('fund data is ' + JSON.stringify(fundData));
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

const previewData = async () => {
  try {
    const data = await fetch(
      'http://alma-proxy:5555/almaws/v1/acq/invoices/?q=all&limit=20&offset=0&expand=none&invoice_workflow_status=Waiting%20to%20be%20Sent'
    ).then(response => response.json());

      // console.log('data is: ' + JSON.stringify(data));
      const today = new Date().toLocaleDateString('sv-SE', {
        timeZone: 'America/Los_Angeles',
      });
  
      // console.log(`today is ${today}`);
      // from test app
      let temp = '';
      temp += '<h3>Invoice Data</h3>';
      temp += '<p>';
      temp += data.total_record_count;
      temp += ' invoices found</p>';
      temp += '<form action="/preview" method="POST">';
      temp += '<table>'
      temp += '<tr>';
      temp += '<th>Vendor ID</th>';
      temp += '<th>Vendor Name</th>';
      temp += '<th>Invoice #</th>';	
      temp += '<th>Amount</th>'; 	
      temp += '<th>Date</th>';	
      temp += '<th>Invoice Total</th>'; 
      temp += '<th>Send</th>';
      temp += '</tr>';
      for (i in data.invoice) {
        // console.log(JSON.stringify(data.invoice));
        let nozee = data.invoice[i].invoice_date;
        if (nozee.includes('Z')) {
          nozee = nozee.substring(0, nozee.length - 1);
        } else {
          nozee = data.invoice[i].invoice_date;
        }
        const vendor = data.invoice[i].vendor.value;
        // console.log(`Vendor is ${vendor}`);

        try {
          const vendordata = await getVendorData(vendor);
          // console.log('vendor data is ' + JSON.stringify(vendordata));
          
          if (vendordata) {
  
          temp += '<tr>';
      
          temp += `<td>${vendordata.code}</td>`;
          temp += `<td>${vendordata.name}</td>`;
          temp += `<td>${data.invoice[i].id}</td>`;
          temp += `<td>$${data.invoice[i].total_amount}</td>`;
          temp += `<td>${nozee}</td>`;	
          temp += `<td>$${data.invoice[i].total_amount}</td>`;
          temp += `<td><input type="checkbox" id="${data.invoice[i].id}" name="invoice-${i}" value="${data.invoice[i].id}"></td>`;
          temp += '</tr>';
        }

        }

        catch (error) {console.log(error);}

      }
      temp += '</table>';
      temp += '<button type="submit" class="btn--primary">Submit</button>';
      temp += '</form>';

      return temp;

  }
  catch(error) {console.log(error)};

};

const reviewSentDataTable = async () => {
  try {
    const data = await fetch(
      'http://alma-proxy:5555/almaws/v1/acq/invoices/?q=all&limit=20&offset=0&expand=none&invoice_workflow_status=Waiting%20to%20be%20Sent'
    ).then(response => response.json());

      // console.log('data is: ' + JSON.stringify(data));
      const today = new Date().toLocaleDateString('sv-SE', {
        timeZone: 'America/Los_Angeles',
      });
  
      // console.log(`today is ${today}`);
      // from test app
      let temp = '';
      temp += '<h3>Invoice Data</h3>';
      temp += '<p>';
      temp += data.total_record_count;
      temp += ' invoices found</p>';
      temp += '<form action="/preview" method="POST">';
      temp += '<table>'
      temp += '<tr>';
      temp += '<th>Vendor ID</th>';
      temp += '<th>Vendor Name</th>';
      temp += '<th>Invoice #</th>';	
      temp += '<th>Amount</th>'; 	
      temp += '<th>Date</th>';	
      temp += '<th>Invoice Total</th>'; 
      temp += '<th>Send</th>';
      temp += '</tr>';
      for (i in data.invoice) {
        // console.log(JSON.stringify(data.invoice));
        let nozee = data.invoice[i].invoice_date;
        if (nozee.includes('Z')) {
          nozee = nozee.substring(0, nozee.length - 1);
        } else {
          nozee = data.invoice[i].invoice_date;
        }
        const vendor = data.invoice[i].vendor.value;
        // console.log(`Vendor is ${vendor}`);

        try {
          const vendordata = await getVendorData(vendor);
          // console.log('vendor data is ' + JSON.stringify(vendordata));
          
          if (vendordata) {
  
          temp += '<tr>';
      
          temp += `<td>${vendordata.code}</td>`;
          temp += `<td>${vendordata.name}</td>`;
          temp += `<td>${data.invoice[i].id}</td>`;
          temp += `<td>$${data.invoice[i].total_amount}</td>`;
          temp += `<td>${nozee}</td>`;	
          temp += `<td>$${data.invoice[i].total_amount}</td>`;
          temp += `<td><input type="checkbox" id="${data.invoice[i].id}" name="invoice-${i}" value="${data.invoice[i].id}"></td>`;
          temp += '</tr>';
        }

        }

        catch (error) {console.log(error);}

      }
      temp += '</table>';
      temp += '<button type="submit" class="btn--primary">Submit</button>';
      temp += '</form>';

      return temp;

  }
  catch(error) {console.log(error)};

};

const simpleInvoice = async () => {
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


const aggieEnterprisePaymentRequest = async (invoices) => {

  const paymentRequest = `mutation scmInvoicePaymentRequest($data: ScmInvoicePaymentRequestInput!) {
    scmInvoicePaymentCreate(data: $data) {
        requestStatus {
            requestId
            consumerId
            requestDateTime
            requestStatus
            operationName
          }
      validationResults {
          errorMessages
          messageProperties
      }
  }}`;

  const query = paymentRequest;

  try {
    const variableInputs = await setSelectedData(invoices);
    // const variableInputs = await setData();
    console.log('variable inputs are ' + JSON.stringify(variableInputs));
    if (variableInputs) {
      for (i in variableInputs) {
        variables = variableInputs[i];
        let successfulInputs = [];
        let failedInputs = [];
        await fetch(process.env.SIT_2_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          },
          body: JSON.stringify({
            query,
            variables,
          }),
        })
          .then((res) => res.json())
          .then(
            (result) => {
              console.log(JSON.stringify(result)); // display errors on tool
            }
              // result.data.scmInvoicePaymentCreate.validationResults.errorMessages[0].startsWith(
              //   'A request already exists for your consumerId and consumerTrackingId'
              // ) ||
              // result.data.scmInvoicePaymentCreate.validationResults.errorMessages ==
              //   null
              //   ? console.log('perfect') // change invoice status
              //   : console.log(JSON.stringify(result)) // display errors on tool
          );
      }

    }
  }
  catch (error) {
    console.log(error);
  }

};

const checkPayments = async () => {

const query = `query scmInvoicePaymentRequestStatusByConsumerTracking($consumerTrackingId: String!) {
  scmInvoicePaymentRequestStatusByConsumerTracking(consumerTrackingId: $consumerTrackingId) {
    requestStatus {
      requestId
      consumerNotes
      operationName
      requestDateTime
      requestStatus
      lastStatusDateTime
      processedDateTime
      errorMessages
      batchRequest
    }
    processingResult {
      status
      requestDateTime
      lastStatusCheckDateTime
      processedDateTime
      errorMessages
      hasWarnings
    }
    validationResults {
      valid
      errorMessages
      messageProperties
    }
  }
}`;


  try {
    const variableInputs = await simpleInvoice();
    // console.log(JSON.stringify(variableInputs));
    if (variableInputs) {
      for (i in variableInputs) {
        variables = variableInputs[i];
        console.log(variables);
        await fetch(process.env.SIT_2_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          },
          body: JSON.stringify({
            query,
            variables,
          }),
        })
          .then((res) => res.json())
          .then(
            (result) => {
              console.log(JSON.stringify(result)); // display errors on tool
            }
          );
      }

    }
  }
  catch (error) {
    console.log(error);
  }
}

exports.getHomepage = (req, res, next) => {
    res.render('index', {
        title: 'Payment Processor - Home',
    });
}

exports.getSendPage = (req, res, next) => {
    res.render('send', {
        title: 'Payment Processor - Send Data',
      });
}

exports.sendAllInvoices = async (req, res, next) => {
  aggieEnterprisePaymentRequest().then(
    res.render('sent', {
      title: 'Payment Processor - Data Sent',
    }));
}

exports.getDataSentPage = (req, res, next) => {
  aggieEnterprisePaymentRequest();
      res.render('sent', {
        title: 'Payment Processor - Data Sent',
    });
}

exports.getPreviewCompletePage = async (req, res, next) => {
    const bodystuff = await almatoHTMLTableComplete();
    res.render('previewcomplete', {
      title: 'Payment Processor - Complete Data Preview',
      body: bodystuff,
    });
}

exports.getPreviewSingleInvoicePage = async (req, res, next) => {
  const invoiceID = req.params.invoiceId;
  const bodystuff = await almatoHTMLTableComplete(invoiceID);
  res.render('previewcomplete', {
    title: 'Payment Processor - Complete Data Preview',
    body: bodystuff,
  });
}

exports.getPreviewPage = async (req, res, next) => {
  const bodystuff = await previewData();
  res.render('preview', {
    title: 'Payment Processor - Select Data',
    body: bodystuff,
  });
}

exports.getPreviewJSON = async (req, res, next) => {
    const bodyraw = await setData();
    const bodystuff = JSON.stringify(bodyraw, null, 2);
    res.render('preview-json', {
      title: 'Payment Processor - JSON Preview',
      body: bodystuff,
    });
}

exports.getReviewPage = async (req, res, next) => {
  res.render('review', {
    title: 'Payment Processor - Select Data',
    body: bodystuff,
  });
}

exports.getCheckStatus = async (req, res, next) => {
    const bodyraw = await checkPayments();
    const bodystuff = JSON.stringify(bodyraw, null, 2);
    res.render('checkstatus', {
      title: 'Payment Processor - Check Payment Status',
      body: bodystuff,
    });
}

exports.sendSelectedInvoices = async (req, res, next) => {
  console.log(JSON.stringify(req.body));
  if (req.body) {
    // for each item in req.body, get value and push to array
    const invoiceids = [];
    for (i in req.body) {
      invoiceids.push(req.body[i]);
    }
    aggieEnterprisePaymentRequest(invoiceids)
    .then(() => {
      //   const bodyraw = await setData();
      //   const bodystuff = JSON.stringify(bodyraw, null, 2);
        res.render('sent', {
          title: 'Payment Processor - Data Sent',
      });
        });
  }
  else {
    res.render('send', {
      title: 'Payment Processor - Send Data',
    });
  }




}