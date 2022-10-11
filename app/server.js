const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const AUTH_TOKEN = process.env.AUTH_TOKEN;
var session = require('express-session');
var CASAuthentication = require('node-cas-authentication');

// instantiate an express app
const app = express();

// cors
app.use(cors({ origin: '*' }));

// here you set that all templates are located in `/views` directory
app.set('views', __dirname + '/views');

// here you set that you're using `ejs` template engine, and the
// default extension is `ejs`
app.set('view engine', 'ejs');

app.use('/views', express.static(process.cwd() + '/views')); //make public static

// Set up an Express session, which is required for CASAuthentication.
app.use(
  session({
    secret: process.env.EXPRESS_SESSION,
    resave: false,
    saveUninitialized: true,
  })
);

// set cas variables
var cas = new CASAuthentication({
  cas_url: process.env.CAS_URL,
  service_url: process.env.APP_URL,
  // cas_version: '3.0',
  // renew: false,
  // is_dev_mode: false,
  // dev_mode_user: '',
  // dev_mode_info: {},
  // session_name: 'cas_user',
  // session_info: 'cas_userinfo',
  // destroy_session: false,
  // return_to: 'http://localhost:9999',
});

// if you want CAS
// app.get('/', cas.bounce, function (req, res) {
// and if you don't

app.get('/', cas.bounce, function (req, res) {
  res.render('index', {
    title: 'Payment Processor - Home',
  });
});

app.get('/senddata', function (req, res) {
  res.render('send', {
    title: 'Payment Processor - Send Data',
  });
});

app.get('/datasent', function (req, res) {
  sendData();

  res.render('sent', {
    title: 'Payment Processor - Data Sent',
  });
});

app.get('/preview', async function (req, res) {
  const bodystuff = await getAlma();
  res.render('preview', {
    title: 'Payment Processor - Data Preview',
    body: bodystuff,
  });
});

async function getAlma() {
  // note - alma cors error - test data only
  const response = await fetch(
    'http://alma-proxy:5555/almaws/v1/acq/invoices/?q=all&limit=10&offset=0&expand=none&base_status=ACTIVE'
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

    return temp;
  } else {
    console.log(response);
    console.log('HTTP-Error: ' + response.status);
    return 'error';
  }
}

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
  fetch(process.env.AGGIE_ENTERPRISE_TEST, {
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
    .then((result) => console.log(result));
};

/*************************************************/
// Express server listening...
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
