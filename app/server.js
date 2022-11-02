const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const AUTH_TOKEN = process.env.AUTH_TOKEN;
var session = require('express-session');
var CASAuthentication = require('node-cas-authentication');

// const firstTest = require('./firstTest.json');

const sit2TEst = require('./sit2Test.json');
const mySentRequests = require('./mySentRequests.json');
const e = require('express');

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

app.get('/', function (req, res) {
  res.render('index', {
    title: 'Payment Processor - Home',
  });
});

app.get('/senddata', function (req, res) {
  res.render('send', {
    title: 'Payment Processor - Send Data',
  });
});

app.get('/datasent', async function (req, res) {
  // const invoices = sit2TEst;

  const invoices = await setData();

  aggieEnterprise(paymentRequest, invoices);

  res.render('sent', {
    title: 'Payment Processor - Data Sent',
  });
});

app.get('/preview', async function (req, res) {
  const bodystuff = await almatoHTMLTable();
  res.render('preview', {
    title: 'Payment Processor - Data Preview',
    body: bodystuff,
  });
});

app.get('/previewjson', async function (req, res) {
  const bodyraw = await setData();
  const bodystuff = JSON.stringify(bodyraw, null, 2);
  res.render('preview-json', {
    title: 'Payment Processor - JSON Preview',
    body: bodystuff,
  });
});

app.get('/checkstatus', async function (req, res) {
  const sentRequests = mySentRequests;

  const bodyraw = await aggieEnterprise(paymentStatus, sentRequests);
  const bodystuff = JSON.stringify(bodyraw, null, 2);
  res.render('checkstatus', {
    title: 'Payment Processor - Check Payment Status',
    body: bodystuff,
  });
});

async function almatoHTMLTable() {
  let data = await setData();
  console.log(data);
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

const getVendorData = async (vendorcode) => {
  const response = await fetch(
    `http://alma-proxy:5555/almaws/v1/acq/vendors/${vendorcode}`
  );

  if (response.ok) {
    let data = await response.json();
    // console.log(data);
    return data;
  } else {
    // console.log(response);
    console.log('HTTP-Error: ' + response.status);
  }
};

const setData = async () => {
  const response = await fetch(
    'http://alma-proxy:5555/almaws/v1/acq/invoices/?q=all&limit=10&offset=0&expand=none&invoice_workflow_status=Waiting%20to%20be%20Sent'
  );

  if (response.ok) {
    let data = await response.json();
    // console.log(data.invoice);
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
      const vendordata = await getVendorData(vendor);
      // console.log('vendor data is ' + JSON.stringify(vendordata));
      apipayload.push({
        data: {
          header: {
            boundaryApplicationName: 'TESTING_APP',
            consumerId: 'UNITTEST',
            consumerReferenceId: data.invoice[i].id,
            consumerTrackingId: data.invoice[i].number,
          },
          payload: {
            accountingDate: today,
            businessUnit: 'UCD Business Unit',
            invoiceDescription: data.invoice[i].vendor.desc,
            invoiceAmount: data.invoice[i].total_amount,
            invoiceDate: nozee,
            invoiceNumber: data.invoice[i].number,
            invoiceSourceCode: 'UCD GeneralLibrary',
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

      for (j in data.invoice[i].invoice_lines.invoice_line) {
        apipayload[i].data.payload.invoiceLines.push({
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
          glSegments: {
            entity: process.env.GL_ENTITY,
            fund: process.env.GL_FUND,
            department: process.env.GL_DEPARTMENT,
            account: process.env.GL_ACCOUNT,
            purpose: process.env.GL_PURPOSE,
          },
        });
      }
    }
    // console.log(JSON.stringify(apipayload[0]));
    return apipayload;
  } else {
    console.log(response);
    console.log('HTTP-Error: ' + response.status);
  }
};

const paymentStatus = `query scmInvoicePaymentRequestStatus($requestId: String!) {
  scmInvoicePaymentRequestStatus(requestId: $requestId) {
    requestStatus {
      requestId
      consumerId
      requestStatus
      requestDateTime
    }
  }
}`;

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

const aggieEnterprise = async (query, variableInputs) => {
  for (i in variableInputs) {
    variables = variableInputs[i];
    fetch(process.env.SIT_2_URL, {
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
        (result) =>
          // result.data.scmInvoicePaymentCreate.validationResults.errorMessages[0].startsWith(
          //   'A request already exists for your consumerId and consumerTrackingId'
          // ) ||
          // result.data.scmInvoicePaymentCreate.validationResults.errorMessages ==
          //   null
          //   ? console.log('perfect') // change invoice status
          //   : console.log(JSON.stringify(result)) // display errors on tool
          console.log(JSON.stringify(result)) // display errors on tool
      );
  }
};

/*************************************************/
// Express server listening...
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
