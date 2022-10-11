async function getSampleInvoice() {
  document.getElementById('getAlma').style.display = 'none';

  // note - alma cors error - test data only
  const response = await fetch(
    'http://localhost:5555/almaws/v1/acq/invoices/?q=all&limit=10&offset=0&expand=none&base_status=ACTIVE'
  );

  if (response.ok) {
    // if HTTP-status is 200-299
    // get the response body (the method explained below)
    let data = await response.json();
    length = data.invoice.length;
    console.log(data);
    const sampleinvoice = JSON.stringify(data.invoice[0], null, '\t');
    var temp = '';
    temp += '<h2>Sample Invoice</h2><pre><code>';
    temp += sampleinvoice;
    document.getElementById('sampleinvoicebox').innerHTML = temp;
  } else {
    console.log(response);
    console.log('HTTP-Error: ' + response.status);
  }
}

async function getAlma() {
  document.getElementById('getAlma').style.display = 'none';

  // note - alma cors error - test data only
  const response = await fetch(
    'http://localhost:5555/almaws/v1/acq/invoices/?q=all&limit=10&offset=0&expand=none&base_status=ACTIVE'
  );

  if (response.ok) {
    // if HTTP-status is 200-299
    // get the response body (the method explained below)
    let data = await response.json();
    length = data.invoice.length;
    console.log(data);
    // const sampleinvoice = JSON.stringify(data.invoice[0], null, '\t');
    var temp = '';
    temp += '<h3>Invoice Data</h3>';
    temp += '<p>';
    temp += length;
    temp += ' invoices found</p>';
    for (i in data.invoice) {
      temp += `<h4>Invoice ${parseInt(i) + 1} </h4>`;
      temp += '<table>';
      temp += '<tr><th>header</th></tr>';
      temp += '<tr><td>ApplicationName:</td><td>TESTING_APP</td></tr>';
      temp += '<tr><td>AconsumerId:</td><td>UNITTEST</td></tr>';
      temp +=
        '<tr><td>consumerReferenceId:</td><td>' +
        data.invoice[i].id +
        '</td></tr>';
      temp +=
        '<tr><td>consumerTrackingId:</td><td>' +
        data.invoice[i].number +
        '</td></tr>';
      temp += '<tr><th>payload:</th></tr>';
      temp +=
        '<tr><td>accountingDate:</td><td>' +
        data.invoice[i].invoice_date +
        '</td></tr>';
      temp += "<tr><td>businessUnit:</td><td>'UCD Business Unit'</td></tr>";
      temp +=
        '<tr><td>invoiceDescription:</td><td>' +
        data.invoice[i].invoice_date +
        '</td></tr>';
      temp +=
        '<tr><td>invoiceAmount:</td><td>' +
        data.invoice[i].total_amount +
        '</td></tr>';
      temp +=
        '<tr><td>invoiceDate:</td><td>' +
        data.invoice[i].invoice_date +
        '</td></tr>';
      temp +=
        '<tr><td>invoiceNumber:</td><td>' +
        data.invoice[i].number +
        '</td></tr>';
      temp +=
        "<tr><td>invoiceSourceCode:</td><td>'UCD GeneralLibrary'</td></tr>";
      temp += "<tr><td>invoiceType:</td><td>'STANDARD'</td></tr>";
      temp += "<tr><td>paymentTerms:</td><td>'Immediate'</td></tr>";
      temp += "<tr><td>supplierNumber:</td><td>'Some String'</td></tr>";
      temp += "<tr><td>supplierSiteCode:</td><td>'Some String'</td></tr>";
      temp += '<tr><td>invoiceLines:</td><td>';
      for (j in data.invoice[i].invoice_lines.invoice_line) {
        temp += `<h4>Item ${parseInt(j) + 1} </h4>`;
        temp += '<table>';
        temp += "<tr><td>itemName:</td><td>'Some String'</td></tr>";
        temp +=
          '<tr><td>itemDescription:</td><td>' +
          JSON.stringify(data.invoice[i].invoice_lines.invoice_line[j].id) +
          '</td></tr>';
        temp +=
          '<tr><td>lineAmount:</td><td>' +
          data.invoice[i].invoice_lines.invoice_line[j].name +
          '</td></tr>';
        temp += "<tr><td>lineType:</td><td>'ITEM'</td></tr>";
        temp += "<tr><td>unitOfMeasure:</td><td>'Each'</td></tr>";
        temp +=
          '<tr><td>purchaseOrderLineNumber:</td><td>' +
          data.invoice[i].invoice_lines.invoice_line[j].number +
          '</td></tr>';
        temp +=
          '<tr><td>quantity:</td><td>' +
          data.invoice[i].invoice_lines.invoice_line[j].quantity +
          '</td></tr>';
        temp +=
          '<tr><td>unitPrice:</td><td>' +
          data.invoice[i].invoice_lines.invoice_line[j].price +
          '</td></tr>';
        temp += '</table>';
      }
      temp += '</td></tr>';
      temp += '</table>';
    }

    document.getElementById('invoicebox').innerHTML = temp;
  } else {
    console.log(response);
    console.log('HTTP-Error: ' + response.status);
  }
}

const setData = async () => {
  const response = await fetch(
    'http://localhost:5555/almaws/v1/acq/invoices/?q=all&limit=10&offset=0&expand=none&base_status=ACTIVE'
  );

  if (response.ok) {
    let data = await response.json();
    length = data.invoice.length;
    // console.log(data);
    let apipayload = [];
    // from test app
    for (i in data.invoice) {
      apipayload.push({
        data: {
          header: {
            boundaryApplicationName: 'TESTING_APP',
            consumerId: 'UNITTEST',
            consumerReferenceId: data.invoice[i].id,
            consumerTrackingId: data.invoice[i].number,
          },
          payload: {
            accountingDate: data.invoice[i].invoice_date,
            businessUnit: 'UCD Business Unit',
            invoiceDescription: 'Some String',
            invoiceAmount: data.invoice[i].total_amount,
            invoiceDate: data.invoice[i].invoice_date,
            invoiceNumber: data.invoice[i].number,
            invoiceSourceCode: 'UCD GeneralLibrary',
            invoiceType: 'STANDARD',
            paymentMethodCode: 'Some String',
            paymentTerms: 'Immediate',
            purchaseOrderNumber: 'Some String',
            supplierNumber: 'Some String',
            supplierSiteCode: 'Some String',
            invoiceLines: [],
          },
        },
      });

      for (j in data.invoice[i].invoice_lines.invoice_line) {
        apipayload[i].data.payload.invoiceLines.push({
          itemName: data.invoice[i].invoice_lines.invoice_line[j].name,
          itemDescription: data.invoice[i].invoice_lines.invoice_line[j].id,
          lineAmount: 123.45,
          lineType: 'ITEM',
          purchaseOrderLineNumber:
            data.invoice[i].invoice_lines.invoice_line[j].number,
          purchasingCategory: 'Some String',
          quantity: data.invoice[i].invoice_lines.invoice_line[j].quantity,
          unitOfMeasure: 'Some String',
          unitPrice: data.invoice[i].invoice_lines.invoice_line[j].price,
          glSegments: {
            entity: '1311',
            fund: '63031',
            department: '9300051',
            account: '508210',
            purpose: '44',
          },
          glSegmentString:
            '1311-63031-9300051-508210-44-G29-CM00000039-510139-0000-000000-000000',
        });
      }
    }
    console.log(apipayload);
  } else {
    console.log(response);
    console.log('HTTP-Error: ' + response.status);
  }
};

const variables = {
  // from test app

  data: {
    header: {
      boundaryApplicationName: 'TESTING_APP',
      consumerId: 'UNITTEST',
      consumerReferenceId: 'A_UNIQUE_ID',
      consumerTrackingId: 'CONSUMER_ORDER_NBR_2',
    },
    payload: {
      accountingDate: '2022-02-01',
      businessUnit: 'UCD Business Unit',
      invoiceDescription: 'Some String',
      invoiceAmount: 123.45,
      invoiceDate: '2022-02-01',
      invoiceNumber: 'AND_Unmatched_Invoice',
      invoiceSourceCode: 'UCD GeneralLibrary',
      invoiceType: 'STANDARD',
      paymentMethodCode: 'Some String',
      paymentTerms: 'Immediate',
      purchaseOrderNumber: 'Some String',
      supplierNumber: 'Some String',
      supplierSiteCode: 'Some String',
      invoiceLines: [
        {
          itemName: 'Some String',
          itemDescription: 'xyz789',
          lineAmount: 123.45,
          lineType: 'ITEM',
          purchaseOrderLineNumber: 123,
          purchasingCategory: 'Some String',
          quantity: 123,
          unitOfMeasure: 'Some String',
          unitPrice: 987.65,
          glSegments: {
            entity: '1311',
            fund: '63031',
            department: '9300051',
            account: '508210',
            purpose: '44',
          },
          glSegmentString:
            '1311-63031-9300051-508210-44-G29-CM00000039-510139-0000-000000-000000',
        },
      ],
    },
  },
};

const query = `mutation scmInvoicePaymentRequest($data: ScmInvoicePaymentRequestInput!) {
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

const sendData = () => {
  fetch('https://wso2am-api-np.aws.ait.ucdavis.edu/ait-test/1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      APIAuthToken: 'token',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })
    .then((res) => res.json())
    .then((result) => console.log(result));
};
