const {almatoHTMLTableComplete, basicDataTable, paidInvoicesTable} = require('../controllers/tables');
const {aggieEnterprisePaymentRequest, checkPayments, checkStatusInOracle, checkErpRolesOracle} = require('../controllers/graphqlcalls');
const { getAlmaIndividualInvoiceData, getAlmaInvoicesReadyToBePaid} = require('../controllers/almaapicalls');
const {reformatAlmaInvoiceforAPI, filterOutSubmittedInvoices } = require('../controllers/formatdata');
const { getInvoiceIDs, getInvoiceNumbers, postSaveTodaysToken, postAddUser, fetchAllUsers, fetchUser, postEditUser, postAddInvoice, getPaidInvoices, getUnpaidInvoiceNumbers, fetchAllFunds, fetchAllVendors, deleteFund, deleteVendor, getAllUnpaidInvoices} = require('../controllers/dbcalls');
const {tokenGenerator} = require('../controllers/tokengenerator');
const {checkOracleStatus, archiveInvoices} = require('../controllers/background-scripts');
const express = require('express');
const router = express.Router();
const session = require('express-session');
const CASAuthentication = require('node-cas-authentication');
const User = require('../models/user');
const { get } = require('../routes/routes');
const admin = process.env.ADMIN;

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
    const bodystuff = await almatoHTMLTableComplete();
    res.render('previewcomplete', {
      title: 'Payment Processor - Complete Data Preview',
      body: bodystuff,
      isUser: false,
      isAdmin: false,

    });
}

exports.getPreviewSingleInvoicePage = async (req, res, next) => {
  const cas_user = req.session[cas.session_name];
  const userdata = await fetchUser(cas_user);
  if (userdata) {
  const invoiceID = req.params.invoiceId;
  const bodystuff = await almatoHTMLTableComplete(invoiceID);
  res.render('previewcomplete', {
    title: 'Payment Processor - Complete Data Preview',
    body: bodystuff,
    isUser: true,
    isAdmin: false,
  });
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
  const cas_user = req.session[cas.session_name];
  const userdata = await fetchUser(cas_user);
  if (userdata) {
    const library = userdata.library;
    if (library) {
      const data1 = await getAlmaInvoicesReadyToBePaid(library);
      const data = await filterOutSubmittedInvoices(data1, library);
      const version = 'preview';
      if (data.invoice.length === 0) {
        const bodystuff = `<h3>No Invoices</h3>
        <p>No invoices are waiting to be sent.</p>
        <p>If you feel you are reading this message in error, within Alma go to Acquisitions -> Waiting for Payment.</p>`;
        res.render('preview', {
          title: 'Payment Processor - Select Data',
          body: bodystuff,
          isUser: true,
          isAdmin: false,
        });
      }
      else {
        const bodystuff = await basicDataTable(data, version, library);
        res.render('preview', {
          title: 'Payment Processor - Select Data',
          body: bodystuff,
          isUser: true,
          isAdmin: false,
        });
      }
    }
  }
  else {
    res.redirect('/');
  }
}

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
  console.log('oracle status');
  const cas_user = req.session[cas.session_name];
  const userdata = await fetchUser(cas_user);
  if (userdata) {
  const library = userdata.library;
  const getinvoicedata = await getAllUnpaidInvoices(library);
  const thisinvoicedata = getinvoicedata[0];
  const invoicenumbers = [];
  const invoiceids = [];
  for (i in thisinvoicedata) {
    invoicenumbers[i] = thisinvoicedata[i].invoicenumber;
    invoiceids[i] = thisinvoicedata[i].invoiceid;
  }
  console.log('invoicenumbers is ' + JSON.stringify(invoicenumbers));
  console.log('invoiceids is ' + JSON.stringify(invoiceids));
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
      invoicenumbers[i] =
        { "filter":   
      {
        "invoiceNumber": {"contains": invoicenumbers[i].invoicenumber}
      }
    }
    }
    const requestresults = await checkStatusInOracle(invoicenumbers);

    // for (i in invoiceids) {
    //   invoiceids[i] = invoiceids[i].invoiceid;
    // }
    const invoicedata = await getAlmaIndividualInvoiceData(invoiceids);
    console.log('invoicedata is ' + JSON.stringify(invoicedata));
    data = {invoice: []}
    for (i in invoicedata.invoice) {
      if (invoicedata.invoice[i].id && requestresults[i]) {
      const invoice = invoicedata.invoice[i];
      const request = requestresults[i];
      const combined = {...invoice, ...request};
      data.invoice.push(combined);
      }
    }
    const version = 'review';
    // console.log('data is ' + JSON.stringify(data));
    const bodystuff = await basicDataTable(data, version, library);
    res.render('review', {
        title: 'Sent Invoice Status',
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

exports.viewPaidInvoices = async (req, res, next) => {
  const cas_user = req.session[cas.session_name];
  const userdata = await fetchUser(cas_user);
  if (userdata) {
  const library = userdata.library;
    let paiddata = await getPaidInvoices(library);
    paiddata = paiddata[0];
    let invoiceids = [];
    for (i in paiddata) {
      invoiceids[i] = paiddata[i].invoiceid;
    }
    const invoicedata = await getAlmaIndividualInvoiceData(invoiceids);
    data = {invoice: []}
    for (i in invoicedata.invoice) {
      if (invoicedata.invoice[i] && paiddata[i].responsebody) {
        const invoice = invoicedata.invoice[i];
        const response = {responsebody: JSON.parse(paiddata[i].responsebody)};
        const combined = {...invoice, ...response};
        data.invoice.push(combined);
      }
    }
    const bodystuff = await paidInvoicesTable(data);
    res.render('review', {
        title: 'Most Recently Paid Invoices',
        body: bodystuff,
        isUser: true,
        isAdmin: false,
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
      const requestresults = await aggieEnterprisePaymentRequest(invoiceids);
      if (requestresults && userdata) {
        const invoicedata = await getAlmaIndividualInvoiceData(invoiceids);
        data = {invoice: []}
        for (i in invoicedata.invoice) {
          const invoice = invoicedata.invoice[i];
          const request = requestresults[i];
          if (request.data.scmInvoicePaymentCreate.requestStatus.requestStatus === 'PENDING' || request.data.scmInvoicePaymentCreate.validationResults.errorMessages[0].includes("A request already exists for your consumerId and consumerTrackingId")) {
            postAddInvoice(invoice.number,invoice.id, library, request.data);
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
      console.log(error);
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
      isUser: true,
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
      isUser: true,
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
          isUser: true,
          isAdmin: true,
        });
    }
    catch (error) {
      console.log(error);
      res.redirect('/admin');
    }
  } else {
    res.redirect('/');
  }
};

exports.getAdminViewFunds = async (req, res, next) => {
  const cas_user = req.session[cas.session_name];
  if (cas_user === admin) {
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
          isAdmin: true,
        });
    }
    catch (error) {
      console.log(error);
      res.redirect('/admin');
    }
  } else {
    res.redirect('/');
  }
};

exports.adminDeleteFund = async (req, res, next) => {
  const id = req.body.id;
  try {
    const result = await deleteFund(id);
    if (result) {
      console.log('Deleted fund');
      res.redirect('/admin/funds');
    }
  }
  catch (error) {
    console.log(error);
  }
};

exports.getAdminViewVendors = async (req, res, next) => {
  const cas_user = req.session[cas.session_name];
  if (cas_user === admin) {
    try {
      const vendors = await fetchAllVendors();
        res.render('vendor-list', {
          title: 'View All Vendors',
          vendors: vendors,
          isUser: true,
          isAdmin: true,
        });
    }
    catch (error) {
      console.log(error);
      res.redirect('/admin');
    }
  } else {
    res.redirect('/');
  }
};

exports.adminDeleteVendor = async (req, res, next) => {
  const id = req.body.id;
  try {
    const result = await deleteVendor(id);
    if (result) {
      console.log('Deleted vendor');
      res.redirect('/admin/vendors');
    }
  }
  catch (error) {
    console.log(error);
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
        isUser: true,
        isAdmin: true,
        editMode: true,
      });
    }
    else {
      res.status(500).render('useradded', {
        body: body,
        title: 'Error Adding User',
        isUser: true,
        isAdmin: true,
        editMode: true,
      });
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).render('useradded', {
      body: body,
      title: 'Error Adding User',
      isUser: true,
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
        console.log(user);
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
      .catch((err) => console.log(err));
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
    console.log('Updated user');
    res.redirect('/admin/users');
  }
}
catch (error) {
  console.log(error);
}

};

exports.get404 = async (req, res, next) => {
  res.render('404', {
    title: 'Payment Processor - Home',
    isUser: false,
    isAdmin: false,
});
}