import { almatoHTMLTableComplete, basicDataTable } from './tables.js';
import { aggieEnterprisePaymentRequest, checkStatusInOracle } from './graphqlcalls.js';
import { getAlmaIndividualInvoiceData, getAlmaInvoicesReadyToBePaid, setSelectedData } from './almaapicalls.js';
import { reformatAlmaInvoiceforAPI, filterOutSubmittedInvoices } from './formatdata.js';
import { postAddInvoice, getPaidInvoices, getAllUnpaidInvoices, getInvoiceBySearchTerm, fetchInvoiceByInvoiceId } from './dbcalls.js';
import { checkOracleStatus, archivePaidInvoices } from './background-scripts.js';
import { logMessage } from '../util/logger.js';

const ITEMS_PER_PAGE = 10;

async function fetchAllInvoices(library) {
  const [data1, data2] = await Promise.all([
    getAlmaInvoicesReadyToBePaid(library, 0),
    getAlmaInvoicesReadyToBePaid(library, 100),
  ]);
  return { invoice: [...data1.invoice, ...data2.invoice] };
}

const noInvoicesTemplate = () => `
  <h3>No Invoices</h3>
  <p>No invoices are waiting to be sent.</p>
  <p>If you feel you are reading this message in error, within Alma go to Acquisitions -> Waiting for Payment.</p>
`;

export async function getHomepage(req, res) {
  const { userdata } = res.locals;
  logMessage('INFO', `${userdata?.id || 'unknown user'} is using payments app.`);
  res.render('index', {
    title: 'Payment Processor - Home',
    isUser: !!userdata,
    isAdmin: false,
    userName: userdata?.firstname,
  });
}

export async function getPreviewPage(req, res, next) {
  try {
    const { userdata } = res.locals;

    if (!userdata?.library) {
      logMessage('DEBUG', 'invoices: getPreviewPage(). Invalid user or missing library information.');
      return res.redirect('/');
    }

    const { library } = userdata;
    const totaldata = await fetchAllInvoices(library);
    const data = await filterOutSubmittedInvoices(totaldata, library);

    if (!data.invoice.length) {
      return res.render('preview', {
        title: 'Payment Processor - Select Data',
        body: noInvoicesTemplate(),
        isUser: true,
        isAdmin: false,
      });
    }

    const bodystuff = await basicDataTable(data, 'preview', library);
    res.render('preview', {
      title: 'Payment Processor - Select Data',
      body: bodystuff,
      isUser: true,
      isAdmin: false,
    });
  } catch (error) {
    logMessage('DEBUG', 'invoices: getPreviewPage()', error.message);
    next(error);
  }
}

export async function getPreviewSingleInvoicePage(req, res) {
  const { userdata } = res.locals;
  if (!userdata) return res.render('index', { title: 'Payment Processor - Home', isUser: false, isAdmin: false });

  const invoiceID = req.params.invoiceId;
  const dbdata = await fetchInvoiceByInvoiceId(invoiceID);
  const bodystuff = dbdata
    ? await almatoHTMLTableComplete(invoiceID)
    : '<p>Invoice not found.</p>';

  res.render('previewcomplete', {
    title: 'Payment Processor - Complete Data Preview',
    body: bodystuff,
    isUser: true,
    isAdmin: false,
  });
}

export async function getReviewPage(req, res) {
  const { userdata } = res.locals;
  if (!userdata) return res.redirect('/');

  const data = await getAlmaInvoicesReadyToBePaid(userdata.library);
  const bodystuff = await basicDataTable(data, 'review', userdata.library);
  res.render('review', {
    title: 'Payment Processor - Select Data',
    body: bodystuff,
    isUser: true,
    isAdmin: false,
  });
}

export async function getOracleStatus(req, res, next) {
  try {
    const { userdata } = res.locals;
    if (!userdata?.library) {
      logMessage('DEBUG', 'invoices: getOracleStatus(). Invalid user or missing library information.');
      return res.redirect('/');
    }

    const { library } = userdata;
    const getinvoicedata = await getAllUnpaidInvoices(library);
    if (!getinvoicedata || getinvoicedata.length === 0) {
      return res.render('review', { title: 'Payment Processor - Data Sent', body: 'No invoices found.', isUser: true, isAdmin: false });
    }

    const thisinvoicedata = getinvoicedata[0];
    const invoicenumbers = thisinvoicedata.map((invoice) => ({
      filter: { invoiceNumber: { contains: invoice.invoicenumber } },
    }));
    const invoiceids = thisinvoicedata.map((invoice) => invoice.invoiceid);

    if (invoicenumbers.length === 0) {
      return res.render('review', { title: 'Payment Processor - Data Sent', body: 'No invoices found.', isUser: true, isAdmin: false });
    }

    const [requestresults, invoicedata] = await Promise.all([
      checkStatusInOracle(invoicenumbers),
      getAlmaIndividualInvoiceData(invoiceids),
    ]);

    if (!invoicedata?.invoice?.length) {
      return res.render('review', { title: 'Payment Processor - Data Sent', body: 'No valid invoices found.', isUser: true, isAdmin: false });
    }

    const combinedData = invoicedata.invoice
      .map((invoice, index) => (requestresults[index] ? { ...invoice, ...requestresults[index] } : null))
      .filter(Boolean);

    const bodystuff = await basicDataTable({ invoice: combinedData }, 'review', library);
    res.render('review', { title: 'Sent Invoice Status', body: bodystuff, isUser: true, isAdmin: false });
  } catch (error) {
    logMessage('DEBUG', 'invoices: getOracleStatus():', error.message);
    next(error);
  }
}

export async function viewPaidInvoices(req, res) {
  const { userdata } = res.locals;
  if (!userdata) return res.redirect('/');

  const { library } = userdata;
  const paiddata = await getPaidInvoices(library);
  const invoices = paiddata[0];
  const totalItems = invoices.length;
  const page = +req.query.page || 1;

  res.render('paid-invoice-list', {
    title: 'Paid Invoices',
    invoices: invoices.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    isUser: true,
    isAdmin: false,
    currentPage: page,
    hasNextPage: ITEMS_PER_PAGE * page < totalItems,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
  });
}

export async function sendSelectedInvoices(req, res, next) {
  const { userdata } = res.locals;
  if (!userdata) return res.redirect('/');
  if (!req.body) return res.redirect('/');

  const { library } = userdata;

  try {
    const invoiceids = Object.values(req.body);
    const step1 = await setSelectedData(invoiceids);
    const variableInputs = await reformatAlmaInvoiceforAPI(step1, library);
    const consumerTrackingIds = variableInputs.map((v) => v.data.header.consumerTrackingId);
    const requestresults = await aggieEnterprisePaymentRequest(variableInputs);

    if (!requestresults) return res.redirect('/');

    const invoicedata = await getAlmaIndividualInvoiceData(invoiceids);
    const data = { invoice: [] };

    for (let i = 0; i < invoicedata.invoice.length; i++) {
      const invoice = invoicedata.invoice[i];
      const request = requestresults[i];

      if (!request || request?.errors?.length > 0) {
        const errors = request?.errors || [{ message: 'No response from payment system' }];
        logMessage('DEBUG', 'invoices: sendSelectedInvoices()', errors);
        return res.redirect('/invoice/' + invoiceids[i]);
      }

      const paymentCreate = request?.data?.scmInvoicePaymentCreate;
      const validationErrors = paymentCreate?.validationResults?.errorMessages || [];
      const alreadyExists = validationErrors.some((message) =>
        message?.includes('A request already exists for your consumerId and consumerTrackingId')
      );
      const isPending = paymentCreate?.requestStatus?.requestStatus === 'PENDING';

      if (isPending || alreadyExists) {
        await postAddInvoice(invoice.number, invoice.id, consumerTrackingIds[i], library, request.data);
      }

      data.invoice.push({ ...invoice, ...request });
    }

    const bodystuff = await basicDataTable(data, 'review', library);
    res.render('review', { title: 'Payment Processor - Data Sent', body: bodystuff, isUser: true, isAdmin: false });
  } catch (error) {
    logMessage('DEBUG', 'invoices: sendSelectedInvoices()', error);
    next(error);
  }
}

export async function getSearchPage(req, res) {
  res.render('search', { title: 'Search Invoices', isUser: true, isAdmin: false, extraMessage: '' });
}

export async function postSearchForInvoice(req, res) {
  const { userdata } = res.locals;
  if (!userdata) return res.render('index', { title: 'Payment Processor - Home', isUser: false, isAdmin: false });

  const { searchterm } = req.body;
  const result = await getInvoiceBySearchTerm(searchterm);
  const invoice = result[0];

  if (invoice.length === 0) {
    return res.render('search', {
      title: 'Search Invoices',
      isUser: true,
      isAdmin: false,
      extraMessage: 'No invoice found with search term ' + searchterm,
    });
  }

  const invoiceID = invoice[0].invoiceid;
  const bodystuff = await almatoHTMLTableComplete(invoiceID);
  if (bodystuff) {
    res.render('previewcomplete', {
      title: 'Payment Processor - Complete Data Preview',
      body: bodystuff,
      isUser: true,
      isAdmin: res.locals.isAdmin,
      invoicedata: invoice[0],
    });
  } else {
    res.render('index', { title: 'Payment Processor - Home', isUser: false, isAdmin: false });
  }
}

export async function checkOracleStatusBackground(req, res) {
  const archiveClean = await archivePaidInvoices();
  if (archiveClean) {
    checkOracleStatus();
  }
  res.sendStatus(200);
}

export function get404(req, res) {
  res.render('404', { title: 'Payment Processor - Home', isUser: false, isAdmin: false });
}
