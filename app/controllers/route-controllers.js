const {almatoHTMLTableComplete, basicDataTable, almatoHTMLTablePreview} = require('../controllers/tables');
const {aggieEnterprisePaymentRequest, checkPayments, checkStatusInOracle, checkErpRolesOracle} = require('../controllers/graphqlcalls');
const { getAlmaIndividualInvoiceData, getAlmaInvoicesReadyToBePaid, setSelectedData} = require('../controllers/almaapicalls');
const {reformatAlmaInvoiceforAPI, filterOutSubmittedInvoices } = require('../controllers/formatdata');
const { getInvoiceIDs, getInvoiceNumbers, postSaveTodaysToken, postAddUser, fetchAllUsers, fetchUser, postEditUser, deleteUser, postAddInvoice, getPaidInvoices, fetchAllFunds, fetchAllVendors, deleteFund, deleteVendor, getAllUnpaidInvoices, getAllInvoicesAdmin, getInvoiceBySearchTerm, deleteInvoice, fetchInvoiceByInvoiceId, postEditInvoice, getInvoiceById, postUpdateInvoiceStatus} = require('../controllers/dbcalls');
const {tokenGenerator} = require('../controllers/tokengenerator');
const {checkOracleStatus, archiveInvoices} = require('../controllers/background-scripts');
const express = require('express');
const router = express.Router();
const session = require('express-session');
const CASAuthentication = require('node-cas-authentication');
const User = require('../models/user');
const { get } = require('../routes/routes');
const admin = process.env.ADMIN;
const { logMessage } = require('../util/logger');

// Set up an Express session, which is required for CASAuthentication.
router.use(
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

exports.getHomepage = async (req, res, next) => {
  const cas_user = req.session[cas.session_name];
  logMessage('INFO',`${cas_user} is using payments app.`);
  const userdata = await fetchUser(cas_user);
  if (userdata) {
    res.render('index', {
      title: 'Payment Processor - Home',
      isUser: true,
      isAdmin: false,
      userName: userdata.firstname,
  });
  }
  else {
    res.render('index', {
      title: 'Payment Processor - Home',
      isUser: false,
      isAdmin: false,
    });
  };
}

exports.getPreviewCompletePage = async (req, res, next) => {
    const dbdata = await fetchInvoiceByInvoiceId(input);
    if (dbdata.length > 0) {
      const bodystuff = await almatoHTMLTableComplete(input);
      res.render('previewcomplete', {
        title: 'Payment Processor - Complete Data Preview',
        body: bodystuff,
        isUser: false,
        isAdmin: false,
      });
    }
    else {

    const bodystuff = await almatoHTMLTablePreview();
    res.render('previewcomplete', {
      title: 'Payment Processor - Complete Data Preview',
      body: bodystuff,
      isUser: false,
      isAdmin: false,

    });
    }
}

exports.getPreviewSingleInvoicePage = async (req, res, next) => {
  const cas_user = req.session[cas.session_name];
  const userdata = await fetchUser(cas_user);
  if (userdata) {
  const invoiceID = req.params.invoiceId;
  const dbdata = await fetchInvoiceByInvoiceId(invoiceID);
  if (dbdata) {
    const bodystuff = await almatoHTMLTableComplete(invoiceID);
    res.render('previewcomplete', {
      title: 'Payment Processor - Complete Data Preview',
      body: bodystuff,
      isUser: true,
      isAdmin: false,
    });
  }
  else {
    const bodystuff = await almatoHTMLTablePreview(invoiceID);
    res.render('previewcomplete', {
      title: 'Payment Processor - Complete Data Preview',
      body: bodystuff,
      isUser: true,
      isAdmin: false,
    });
  }
}
else {
  res.render('index', {
    title: 'Payment Processor - Home',
    isUser: false,
    isAdmin: false,
  });
}
}

exports.getPreviewPage = async (req, res, next) => {
  try {
    const cas_user = req.session[cas.session_name];
    const userdata = await fetchUser(cas_user);

    if (!userdata || !userdata.library) {
      logMessage('DEBUG',"route-controller: getPreviewPage(). Invalid user or missing library information.");
      return res.redirect('/');
    }

    const library = userdata.library;

    // Fetch all invoices (abstracted into a helper function)
    const totaldata = await fetchAllInvoices(library);

    // Filter out submitted invoices
    const data = await filterOutSubmittedInvoices(totaldata, library);
    const version = 'preview';

    // Render page based on data
    if (!data.invoice.length) {
      return res.render('preview', {
        title: 'Payment Processor - Select Data',
        body: noInvoicesTemplate(),
        isUser: true,
        isAdmin: false,
      });
    }

    const bodystuff = await basicDataTable(data, version, library);
    res.render('preview', {
      title: 'Payment Processor - Select Data',
      body: bodystuff,
      isUser: true,
      isAdmin: false,
    });
  } catch (error) {
    logMessage('DEBUG',"route-controllers: getPreviewPage()", error.message);
    next(error); // Pass the error to the next middleware for centralized handling
  }
};

// Helper to fetch all invoices
const fetchAllInvoices = async (library) => {
  try {
    const data1 = await getAlmaInvoicesReadyToBePaid(library, 0);
    const data2 = await getAlmaInvoicesReadyToBePaid(library, 100);
    return { invoice: [...data1.invoice, ...data2.invoice] };
  } catch (error) {
    logMessage('DEBUG',"route-controllers: fetchAllInvoices()", error.message);
    throw error;
  }
};

// Template for no invoices
const noInvoicesTemplate = () => `
  <h3>No Invoices</h3>
  <p>No invoices are waiting to be sent.</p>
  <p>If you feel you are reading this message in error, within Alma go to Acquisitions -> Waiting for Payment.</p>
`;

exports.getPreviewJSON = async (req, res, next) => {
  const cas_user = req.session[cas.session_name];
  const admin = process.env.ADMIN;
  if (cas_user === admin) {
    const data = await getAlmaInvoicesReadyToBePaid();
    const bodyraw = await reformatAlmaInvoiceforAPI(data);
    const bodystuff = JSON.stringify(bodyraw, null, 2);
    res.render('preview-json', {
      title: 'Payment Processor - JSON Preview',
      body: bodystuff,
      isUser: true,
      isAdmin: true,
    });
  }
  else {
    res.redirect('/');
  }
}

exports.getReviewPage = async (req, res, next) => {
  const data = await getAlmaInvoicesReadyToBePaid();
  const version = 'review';
  const bodystuff = await basicDataTable(data, version, library);
  res.render('review', {
    title: 'Payment Processor - Select Data',
    body: bodystuff,
    isUser: false
  });
}

exports.getCheckStatus = async (req, res, next) => {
  const cas_user = req.session[cas.session_name];
  const userdata = await fetchUser(cas_user);
  if (userdata) {
    const library = userdata.library;
    let invoicenumbers = await getInvoiceNumbers(library);
    invoicenumbers = invoicenumbers[0];
    if (invoicenumbers.length === 0) {
      const bodystuff = 'No invoices found.';
      res.render('review', {
        title: 'Payment Processor - Data Sent',
        body: bodystuff,
        isUser: true,
        isAdmin: false,
      });
    }
    else {
      for (i in invoicenumbers) {
        invoicenumbers[i] = {consumerTrackingId : invoicenumbers[i].invoicenumber};
      }
      const requestresults = await checkPayments(invoicenumbers);
      let invoiceids = await getInvoiceIDs();
      invoiceids = invoiceids[0];
      for (i in invoiceids) {
        invoiceids[i] = invoiceids[i].invoiceid;
      }
      const invoicedata = await getAlmaIndividualInvoiceData(invoiceids);
      let data = {invoice: []}
      for (i in invoicedata.invoice) {
        const invoice = invoicedata.invoice[i];
        const request = requestresults[i];
        const combined = {...invoice, ...request};
        data.invoice.push(combined);
      }
      const version = 'review';
      const bodystuff = await basicDataTable(data, version, library);
      res.render('review', {
          title: 'Payment Processor - Data Sent',
          body: bodystuff,
          isUser: true,
          isAdmin: false,
      });
    }

  }
  else {
    res.redirect('/');
  }
}

exports.getOracleStatus = async (req, res, next) => {
  try {
    const cas_user = req.session[cas.session_name];
    const userdata = await fetchUser(cas_user);

    if (!userdata || !userdata.library) {
      logMessage('DEBUG',"route-controllers: getOracleStatus(). Invalid user or missing library information.");
      return res.redirect("/");
    }

    const library = userdata.library;

    // Fetch unpaid invoices
    const getinvoicedata = await getAllUnpaidInvoices(library);
    if (!getinvoicedata || getinvoicedata.length === 0) {
      logMessage('DEBUG',"No invoice data found.");
      return res.render("review", {
        title: "Payment Processor - Data Sent",
        body: "No invoices found.",
        isUser: true,
        isAdmin: false,
      });
    }

    const thisinvoicedata = getinvoicedata[0];
    const invoicenumbers = thisinvoicedata.map((invoice) => ({
      filter: { invoiceNumber: { contains: invoice.invoicenumber } },
    }));
    const invoiceids = thisinvoicedata.map((invoice) => invoice.invoiceid);

    if (invoicenumbers.length === 0) {
      return res.render("review", {
        title: "Payment Processor - Data Sent",
        body: "No invoices found.",
        isUser: true,
        isAdmin: false,
      });
    }

    // Check status in Oracle and fetch individual invoice data concurrently
    const [requestresults, invoicedata] = await Promise.all([
      checkStatusInOracle(invoicenumbers),
      getAlmaIndividualInvoiceData(invoiceids),
    ]);

    if (!invoicedata || !invoicedata.invoice || invoicedata.invoice.length === 0) {
      logMessage('DEBUG',"No invoice data retrieved from Alma.");
      return res.render("review", {
        title: "Payment Processor - Data Sent",
        body: "No valid invoices found.",
        isUser: true,
        isAdmin: false,
      });
    }

    // Combine data from Oracle and Alma
    const combinedData = invoicedata.invoice.map((invoice, index) => {
      const request = requestresults[index];
      return request ? { ...invoice, ...request } : null;
    }).filter(Boolean);

    // Render the combined data
    const version = "review";
    const bodystuff = await basicDataTable({ invoice: combinedData }, version, library);

    res.render("review", {
      title: "Sent Invoice Status",
      body: bodystuff,
      isUser: true,
      isAdmin: false,
    });
  } catch (error) {
    logMessage('DEBUG',"route-controllers: getOracleStatus:", error.message);
    next(error); // Pass the error to centralized error handling middleware
  }
};

exports.viewPaidInvoices = async (req, res, next) => {
  const cas_user = req.session[cas.session_name];
  const userdata = await fetchUser(cas_user);
  if (userdata) {
  const library = userdata.library;
    const paiddata = await getPaidInvoices(library);
    const invoices = paiddata[0];
    const totalItems = invoices.length;
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = 10;
    const theseinvoices = invoices.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
      res.render('paid-invoice-list', {
        title: 'Paid Invoices',
        invoices: theseinvoices,
        isUser: true,
        isAdmin: false,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
  }
  else {
    res.redirect('/');
  }
}

exports.sendSelectedInvoices = async (req, res, next) => {
  const cas_user = req.session[cas.session_name];
  const userdata = await fetchUser(cas_user);
  const library = userdata.library;
  if (req.body) {
    // for each item in req.body, get value and push to array
    try {
      const invoiceids = [];
      for (i in req.body) {
        invoiceids.push(req.body[i]);
      }
      const step1 = await setSelectedData(invoiceids);
      const variableInputs = await reformatAlmaInvoiceforAPI(step1);
      const consumerTrackingIds = [];
      for (i in variableInputs) {
        consumerTrackingIds.push(variableInputs[i].data.header.consumerTrackingId);
      }
      const requestresults = await aggieEnterprisePaymentRequest(variableInputs);
      if (requestresults && userdata) {
        const invoicedata = await getAlmaIndividualInvoiceData(invoiceids);
        data = {invoice: []}
        for (i in invoicedata.invoice) {
          const invoice = invoicedata.invoice[i];
          const request = requestresults[i];
          if (request.errors) {
            if (request.errors.length > 0) {
              logMessage('DEBUG','route-controllers: sendSelectedInvoices()',request.errors);
              res.redirect('/invoice/' + invoiceids[i]);
            }
          }
          else if (request.data.scmInvoicePaymentCreate.requestStatus.requestStatus === 'PENDING' || request.data.scmInvoicePaymentCreate.validationResults.errorMessages[0].includes("A request already exists for your consumerId and consumerTrackingId")) {
            postAddInvoice(invoice.number,invoice.id, consumerTrackingIds[i], library, request.data);
          }

          const combined = {...invoice, ...request};
          data.invoice.push(combined);
        }
          const version = 'review';
          const bodystuff = await basicDataTable(data, version, library);
          res.render('review', {
            title: 'Payment Processor - Data Sent',
            body: bodystuff,
            isUser: true,
            isAdmin: false
          });
        }
        else {
          res.redirect('/');
        }
      }
    catch (error) {
      logMessage('DEBUG','route-controllers: sendSelectedInvoices()',error);
    }

  }
  else {
    res.redirect('/');
  }

}

exports.getAdminCheckToken = async (req, res, next) => {
  const cas_user = req.session[cas.session_name];
  const admin = process.env.ADMIN;
  if (cas_user === admin) {
  const token = await tokenGenerator();
  postSaveTodaysToken(token.access_token);
  }
}

exports.getAdmincheckERPRoles = async (req, res, next) => {
  checkErpRolesOracle();
}

exports.getAdminView = async (req, res, next) => {
  const cas_user = req.session[cas.session_name];
  const admin = process.env.ADMIN;
  if (cas_user === admin) {
    res.render('admin', {
      title: 'Payment Processor - Admin',
      isUser: false,
      isAdmin: true,
    });
  }
  else {
    res.redirect('/');
  }
};

exports.getAdminManageUsers = async (req, res, next) => {
  const cas_user = req.session[cas.session_name];
  const admin = process.env.ADMIN;
  if (cas_user === admin) {
    res.render('admin-manage-users', {
      title: 'Payment Processor - Admin',
      isUser: false,
      isAdmin: true,
    });
  }
  else {
    res.redirect('/');
  }
};

exports.getAdminViewUsers = async (req, res, next) => {
  const cas_user = req.session[cas.session_name];
  if (cas_user === admin) {
    try {
      const users = await fetchAllUsers();
        res.render('user-list', {
          title: 'View All Users',
          users: users,
          isUser: false,
          isAdmin: true,
        });
    }
    catch (error) {
      logMessage('DEBUG',error);
      res.redirect('/admin');
    }
  } else {
    res.redirect('/');
  }
};

exports.getViewFunds = async (req, res, next) => {
  const cas_user = req.session[cas.session_name];
  const userdata = await fetchUser(cas_user);
  if (userdata) {
    try {
      const funds = await fetchAllFunds();
      // for (fund in funds) {
      //   const id = funds[fund].id;
      //   const fundId = funds[fund].fundId;
      //   const fundCode = funds[fund].fundCode;
      //   for (fund2 in funds) {
      //     if (fund2 !== fund) {
      //       if (funds[fund2].fundId === fundId) {
      //         await deleteFund(id);
      //       }
      //     }
      //   }
      // }
        res.render('fund-list', {
          title: 'View All Funds',
          funds: funds,
          isUser: true,
          isAdmin: false,
        });
    }
    catch (error) {
      logMessage('DEBUG','route-controllers: getViewFunds()',error);
      res.redirect('/');
    }
  } else {
    res.redirect('/');
  }
};

exports.deleteFund = async (req, res, next) => {
  const id = req.body.id;
  try {
    const result = await deleteFund(id);
    if (result) {
      logMessage('INFO',`route-controllers: getViewFunds(). Deleted fund ${id}`);
      res.redirect('/funds');
    }
  }
  catch (error) {
    logMessage('DEBUG','route-controllers: getViewFunds()',error);
  }
};

exports.getViewVendors = async (req, res, next) => {
  const cas_user = req.session[cas.session_name];
  const userdata = await fetchUser(cas_user);
  if (userdata) {
    try {
      const vendors = await fetchAllVendors();
        res.render('vendor-list', {
          title: 'View All Vendors',
          vendors: vendors,
          isUser: true,
          isAdmin: false,
        });
    }
    catch (error) {
      logMessage('DEBUG','route-controllers: getViewVendors()',error);
      res.redirect('/');
    }
  } else {
    res.redirect('/');
  }
};

exports.deleteVendor = async (req, res, next) => {
  const id = req.body.id;
  try {
    const result = await deleteVendor(id);
    if (result) {
      logMessage('INFO',`route-controllers: deleteVendor(). Deleted vendor ${id}`);
      res.redirect('/vendors');
    }
  }
  catch (error) {
    logMessage('DEBUG',error);
  }
};

exports.getAdminAddUser = (req, res) => {
  const cas_user = req.session[cas.session_name];
  if (cas_user === admin) {
    res.render('edit-user', {
      title: 'Add User',
      editMode: false,
      isAdmin: true,
      isUser: false
    });
  } else {
    res.redirect('/');
  }
};

exports.postAdminAddUser = async (req, res, next) => {
  try {
    const body = JSON.parse(JSON.stringify(req.body));
    const response = await postAddUser(req.body.firstname, req.body.lastname, req.body.email, req.body.kerberos, req.body.library);
    if (response) {
      res.render('useradded', {
        body: body,
        title: 'New User Added',
        isUser: false,
        isAdmin: true,
        editMode: true,
      });
    }
    else {
      res.status(500).render('useradded', {
        body: body,
        title: 'Error Adding User',
        isUser: false,
        isAdmin: true,
        editMode: true,
      });
    }
  }
  catch (error) {
    logMessage('DEBUG',error);
    res.status(500).render('useradded', {
      body: body,
      title: 'Error Adding User',
      isUser: false,
      isAdmin: true,
      editMode: true,
    });
  }
};

exports.checkOracleStatusBackground = async (req, res, next) => {
  const archiveClean = await archiveInvoices();
  if (archiveClean) {
    checkOracleStatus();
  }
  // checkOracleStatus();
}

exports.getAdminEditUser = (req, res, next) => {
  const userId = req.params.userId;
  const cas_user = req.session[cas.session_name];
  if (cas_user === admin) {
    User.findByID(userId)
      .then((user) => {
        if (!user) {
          return res.redirect('/admin/user');
        }
        let userobject = user[0][0];
        res.render('edit-user', {
          title: 'Edit User',
          path: '/edit-user',
          user: userobject,
          isUser: false,
          isAdmin: true,
          editMode: true,
        });
      })
      .catch((err) => logMessage('DEBUG',err));
  } else {
    res.redirect('/');
  }
};

exports.postAdminEditUser = async (req, res, next) => {
  const userId = req.body.userId;
  const updatedFirstName = req.body.firstname;
  const updatedLastName = req.body.lastname;
  const updatedEmail = req.body.email;
  const updatedKerberos = req.body.kerberos;
  const updatedLibrary = req.body.library;
  const userid = req.body.userId;

try {
  const result = await postEditUser(updatedFirstName, updatedLastName, updatedEmail, updatedKerberos, updatedLibrary, userid);
  if (result) {
    logMessage('INFO','Updated user');
    res.redirect('/admin/users');
  }
}
catch (error) {
  logMessage('DEBUG',error);
}

};

exports.adminDeleteUser = async (req, res, next) => {
  const userId = req.body.id;
  try {
    const result = await deleteUser(userId);
    if (result) {
      logMessage('INFO','Deleted user');
      res.redirect('/admin/users');
    }
  }
  catch (error) {
    logMessage('DEBUG',error);
  }
};

exports.getAdminViewInvoices = async (req, res, next) => {
  const cas_user = req.session[cas.session_name];
  if (cas_user === admin) {


    try {
      const step1 = await getAllInvoicesAdmin();
      const invoices = step1[0];
      const totalItems = invoices.length;
      const page = +req.query.page || 1;
      const ITEMS_PER_PAGE = 10;
      const theseinvoices = invoices.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
        res.render('invoice-list', {
          title: 'Admin View All Invoices',
          invoices: theseinvoices,
          isUser: false,
          isAdmin: true,
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
    }
    catch (error) {
      logMessage('DEBUG',error);
      res.redirect('/admin');
    }
  } else {
    res.redirect('/');
  }
}

exports.getAdminEditInvoice = (req, res, next) => {
  const id = req.params.id;
  const cas_user = req.session[cas.session_name];
  if (cas_user === admin) {
    getInvoiceById(id)
      .then((invoice) => {
        if (!invoice) {
          return res.redirect('/admin/');
        }
        res.render('edit-invoice', {
          title: 'Edit User',
          path: '/edit-invoice',
          invoice: invoice[0][0],
          isUser: false,
          isAdmin: true,
          editMode: true,
        });
      })
      .catch((err) => logMessage('DEBUG',err));
  } else {
    res.redirect('/');
  }
};

exports.postAdminEditInvoice = async (req, res, next) => {
  const updatedInvoiceNumber = req.body.invoicenumber;
  const updatedInvoiceId = req.body.invoiceid;
  const updatedConsumerTrackingId = req.body.consumerTrackingId;
  const updatedStatus = req.body.status;
  const updatedLibrary = req.body.library;
  const updatedResponseBody = req.body.responsebody;
  const updatedDatetime = req.body.datetime;
  const thisid = req.body.id;

try {
  const result = await postEditInvoice(updatedInvoiceNumber, updatedInvoiceId, updatedConsumerTrackingId, updatedLibrary, updatedStatus, updatedResponseBody, updatedDatetime, thisid);
  if (result) {
    logMessage('INFO','Updated Invoice');
    res.redirect('/admin/');
  }
}
catch (error) {
  logMessage('DEBUG',error);
}

};

exports.postAdminUpdateInvoiceStatus = async (req, res, next) => {
  const status = req.body.status;
  const id = req.body.id;
  try {
    const result = await postUpdateInvoiceStatus(status, id);
    if (result) {
      logMessage('INFO','Updated invoice status');
      res.redirect('/admin/invoices');
    }
  }
  catch (error) {
    logMessage('DEBUG',error);
  }
}



exports.adminDeleteInvoice = async (req, res, next) => {
  const id = req.body.id;
  try {
    const result = await deleteInvoice(id);
    if (result) {
      logMessage('INFO','Deleted invoice');
      res.redirect('/admin/invoices');
    }
  }
  catch (error) {
    logMessage('DEBUG',error);
  }
};

exports.getSearchPage = async (req, res, next) => {
  res.render('search', {
    title: 'Search Invoices',
    isUser: true,
    isAdmin: false,
    extraMessage: '',
  });
}

exports.getAdminSearchPage = async (req, res, next) => {
  res.render('admin-search', {
    title: 'Search Invoices',
    isUser: false,
    isAdmin: true,
    extraMessage: '',
  });
}

exports.postSearchForInvoice = async (req, res, next) => {
  const cas_user = req.session[cas.session_name];
  const admin = process.env.ADMIN;
  const userdata = await fetchUser(cas_user);
  if (userdata) {
    const searchterm = req.body.searchterm;
    const result = await getInvoiceBySearchTerm(searchterm);
    const invoice = result[0];
    if (invoice.length === 0) {
      res.render('search', {
        title: 'Search Invoices',
        isUser: true,
        isAdmin: false,
        extraMessage: 'No invoice found with search term ' + searchterm,
      });
    }
    else if (invoice) {
      const invoiceID = invoice[0].invoiceid;
      const bodystuff = await almatoHTMLTableComplete(invoiceID);
      if (bodystuff) {
        res.render('previewcomplete', {
          title: 'Payment Processor - Complete Data Preview',
          body: bodystuff,
          isUser: true,
          isAdmin: cas_user === admin ? true : false,
          invoicedata: invoice[0],
        });
      }
    }
    else {
      res.render('index', {
        title: 'Payment Processor - Home',
        isUser: false,
        isAdmin: false,
      });
    }
}
else {
  res.render('index', {
    title: 'Payment Processor - Home',
    isUser: false,
    isAdmin: false,
  });
}
}

exports.get404 = async (req, res, next) => {
  res.render('404', {
    title: 'Payment Processor - Home',
    isUser: false,
    isAdmin: false,
});
}