const {almatoHTMLTableComplete, basicDataTable} = require('../controllers/tables');
const {aggieEnterprisePaymentRequest, checkPayments, checkStatusInOracle} = require('../controllers/graphqlcalls');
const {getAlmaInvoicesWaitingToBESent, getAlmaIndividualInvoiceData} = require('../controllers/almaapicalls');
const {reformatAlmaInvoiceforAPI, filterOutSubmittedInvoices} = require('../controllers/formatdata');
const {getInvoices, getInvoiceIDs, getInvoiceNumbers, postSaveTodaysToken} = require('../controllers/dbcalls');
const {tokenGenerator} = require('../controllers/tokengenerator');


exports.getHomepage = (req, res, next) => {
    res.render('index', {
        title: 'Payment Processor - Home',
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
  const data1 = await getAlmaInvoicesWaitingToBESent();
  // console.log('data1 = ' + JSON.stringify(data1));
  const data = await filterOutSubmittedInvoices(data1);
  // console.log('data = ' + JSON.stringify(data));
  const version = 'preview';
  const bodystuff = await basicDataTable(data, version);
  res.render('preview', {
    title: 'Payment Processor - Select Data',
    body: bodystuff,
  });
}

exports.getPreviewJSON = async (req, res, next) => {
    const data = await getAlmaInvoicesWaitingToBESent();
    const bodyraw = await reformatAlmaInvoiceforAPI(data);
    const bodystuff = JSON.stringify(bodyraw, null, 2);
    res.render('preview-json', {
      title: 'Payment Processor - JSON Preview',
      body: bodystuff,
    });
}

exports.getReviewPage = async (req, res, next) => {
  const data = await getAlmaInvoicesWaitingToBESent();
  const version = 'review';
  const bodystuff = await basicDataTable(data, version);
  res.render('review', {
    title: 'Payment Processor - Select Data',
    body: bodystuff,
  });
}

exports.getCheckStatus = async (req, res, next) => {
    let invoicenumbers = await getInvoiceNumbers();
    invoicenumbers = invoicenumbers[0];
    for (i in invoicenumbers) {
      invoicenumbers[i] = {consumerTrackingId : invoicenumbers[i].invoicenumber};
    }
    const requestresults = await checkPayments(invoicenumbers);

    let invoiceids = await getInvoiceIDs();
    invoiceids = invoiceids[0];
    for (i in invoiceids) {
      invoiceids[i] = invoiceids[i].invoiceid;
    }
    // console.log('requestresults = ' + JSON.stringify(requestresults));
    console.log('invoiceids = ' + JSON.stringify(invoiceids));
    const invoicedata = await getAlmaIndividualInvoiceData(invoiceids);
    // console.log('invoicedata = ' + JSON.stringify(invoicedata));
    data = {invoice: []}
    for (i in invoicedata.invoice) {
      const invoice = invoicedata.invoice[i];
      const request = requestresults[i];
      const combined = {...invoice, ...request};
      data.invoice.push(combined);
    }
    const version = 'review';
    const bodystuff = await basicDataTable(data, version);
    res.render('review', {
        title: 'Payment Processor - Data Sent',
        body: bodystuff,
    });

    // res.render('checkstatus', {
    //   title: 'Payment Processor - Check Payment Status',
    //   body: bodystuff,
    // });
}

exports.getOracleStatus = async (req, res, next) => {
  let invoicenumbers = await getInvoiceNumbers();
  invoicenumbers = invoicenumbers[0];
  for (i in invoicenumbers) {
    invoicenumbers[i] =
       { "filter":   
    {
      "invoiceNumber": {"contains": invoicenumbers[i].invoicenumber}
    }
  }
  }
  const requestresults = await checkStatusInOracle(invoicenumbers);

  let invoiceids = await getInvoiceIDs();
  invoiceids = invoiceids[0];
  for (i in invoiceids) {
    invoiceids[i] = invoiceids[i].invoiceid;
  }
  // console.log('requestresults = ' + JSON.stringify(requestresults));
  console.log('invoiceids = ' + JSON.stringify(invoiceids));
  const invoicedata = await getAlmaIndividualInvoiceData(invoiceids);
  // console.log('invoicedata = ' + JSON.stringify(invoicedata));
  data = {invoice: []}
  for (i in invoicedata.invoice) {
    const invoice = invoicedata.invoice[i];
    const request = requestresults[i];
    const combined = {...invoice, ...request};
    data.invoice.push(combined);
  }
  const version = 'review';
  const bodystuff = await basicDataTable(data, version);
  res.render('review', {
      title: 'Payment Processor - Data Sent',
      body: bodystuff,
  });
}

exports.sendSelectedInvoices = async (req, res, next) => {
  // console.log(JSON.stringify(req.body));
  if (req.body) {
    // for each item in req.body, get value and push to array

    try {

      const invoiceids = [];
      for (i in req.body) {
        invoiceids.push(req.body[i]);
      }
      const requestresults = await aggieEnterprisePaymentRequest(invoiceids);
      // console.log('requestresults = ' + JSON.stringify(requestresults));
      if (requestresults) {
        // console.log('requestresults = ' + JSON.stringify(requestresults));

        const invoicedata = await getAlmaIndividualInvoiceData(invoiceids);
        // console.log('invoicedata = ' + JSON.stringify(invoicedata));
        data = {invoice: []}
        for (i in invoicedata.invoice) {
          const invoice = invoicedata.invoice[i];
          const request = requestresults[i];
          const combined = {...invoice, ...request};
          data.invoice.push(combined);
        }
        
        const version = 'review';
        const bodystuff = await basicDataTable(data, version);
        res.render('review', {
            title: 'Payment Processor - Data Sent',
            body: bodystuff,
        });
      }
    }
    catch (error) {
      console.log(error);
    }

  }
  else {
    res.render('send', {
      title: 'Payment Processor - Send Data',
    });
  }

}

exports.getToken = async (req, res, next) => {
  const token = await tokenGenerator();
// console.log('token = ' + token.access_token);
  postSaveTodaysToken(token.access_token);
}
