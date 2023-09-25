const {almatoHTMLTableComplete, basicDataTable} = require('../controllers/tables');
const {aggieEnterprisePaymentRequest, checkPayments, checkStatusInOracle, checkErpRolesOracle} = require('../controllers/graphqlcalls');
const {getAlmaInvoicesWaitingToBESent, getAlmaIndividualInvoiceData} = require('../controllers/almaapicalls');
const {reformatAlmaInvoiceforAPI, filterOutSubmittedInvoices} = require('../controllers/formatdata');
const {getInvoices, getInvoiceIDs, getInvoiceNumbers, postSaveTodaysToken, postAddUser, fetchAllUsers, fetchUser, checkLibrary, checkIfUserExists} = require('../controllers/dbcalls');
const {tokenGenerator} = require('../controllers/tokengenerator');
const express = require('express');
const router = express.Router();
const session = require('express-session');
const CASAuthentication = require('node-cas-authentication');
const User = require('../models/user');
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
  });
  }
  else {
    res.render('index', {
      title: 'Payment Processor - Home',
      isUser: false,
    });
  };

}

exports.getPreviewCompletePage = async (req, res, next) => {
    const bodystuff = await almatoHTMLTableComplete();
    res.render('previewcomplete', {
      title: 'Payment Processor - Complete Data Preview',
      body: bodystuff,
      isUser: false
    });
}

exports.getPreviewSingleInvoicePage = async (req, res, next) => {
  const invoiceID = req.params.invoiceId;
  const bodystuff = await almatoHTMLTableComplete(invoiceID);
  res.render('previewcomplete', {
    title: 'Payment Processor - Complete Data Preview',
    body: bodystuff,
    isUser: false
  });
}

exports.getPreviewPage = async (req, res, next) => {
  const cas_user = req.session[cas.session_name];
  const userdata = await fetchUser(cas_user);
  if (userdata) {
    const library = userdata.library;
    if (library) {
      const data1 = await getAlmaInvoicesWaitingToBESent(library);
      const data = await filterOutSubmittedInvoices(data1);
      const version = 'preview';
      const bodystuff = await basicDataTable(data, version);
      res.render('preview', {
        title: 'Payment Processor - Select Data',
        body: bodystuff,
        isUser: false
      });
    }
}
else {
  res.render('index', {
    title: 'Payment Processor - Home',
    isUser: false,
  });
}
}

exports.getPreviewJSON = async (req, res, next) => {
    const data = await getAlmaInvoicesWaitingToBESent();
    const bodyraw = await reformatAlmaInvoiceforAPI(data);
    const bodystuff = JSON.stringify(bodyraw, null, 2);
    res.render('preview-json', {
      title: 'Payment Processor - JSON Preview',
      body: bodystuff,
      isUser: false
    });
}

exports.getReviewPage = async (req, res, next) => {
  const data = await getAlmaInvoicesWaitingToBESent();
  const version = 'review';
  const bodystuff = await basicDataTable(data, version);
  res.render('review', {
    title: 'Payment Processor - Select Data',
    body: bodystuff,
    isUser: false
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
        isUser: false
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
      isUser: false
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
            isUser: false
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

exports.checkERPRoles = async (req, res, next) => {
  checkErpRolesOracle();
}

exports.getAdminView = async (req, res, next) => {
  const cas_user = req.session[cas.session_name];
  const admin = process.env.ADMIN;
  if (cas_user === admin) {
    res.render('admin', {
      title: 'Payment Processor - Admin',
    });
  }
  else {
    res.render('index', {
      title: 'Payment Processor - Home',
    });
  }
};

exports.getAdminManageUsers = async (req, res, next) => {
  const cas_user = req.session[cas.session_name];
  const admin = process.env.ADMIN;
  if (cas_user === admin) {
    res.render('admin-manage-users', {
      title: 'Payment Processor - Admin',
    });
  }
  else {
    res.render('index', {
      title: 'Payment Processor - Home',
    });
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

exports.getAdminAddUser = (req, res) => {
  const cas_user = req.session[cas.session_name];
  if (cas_user === admin) {
    res.render('edit-user', {
      title: 'Add Judge',
      editMode: false,
      isAdmin: true,
    });
  } else {
    res.redirect('/');
  }
};

exports.getEditJudge = (req, res, next) => {
  const judgeId = req.params.judgeId;
  const cas_user = req.session[cas.session_name];
  if (cas_user === admin) {
    Judge.findByPk(judgeId)
      .then((judge) => {
        if (!judge) {
          return res.redirect('/admin/judges');
        }
        res.render('edit-judge', {
          title: 'Edit Judge',
          path: '/edit-application',
          judge: judge,
          editMode: true,
          isJudge: false,
          isAdmin: true,
        });
      })
      .catch((err) => console.log(err));
  } else {
    res.redirect('/');
  }
};

exports.postAdminAddUser = async (req, res, next) => {
  console.log('req.body = ' + JSON.stringify(req.body));

  try {

  const body = JSON.parse(JSON.stringify(req.body));
  const response = await postAddUser(req.body.firstname, req.body.lastname, req.body.email, req.body.kerberos, req.body.library);
  console.log('response = ' + JSON.stringify(response));
  if (response) {
    res.render('useradded', {
      body: body,
      title: 'New User Added',
      isAdmin: true,
      editMode: true,
    });
  }
  else {
    res.status(500).render('useradded', {
      body: body,
      title: 'Error Adding User',
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
    isAdmin: true,
    editMode: true,
  });
}
};

exports.postAdminEditUser = (req, res, next) => {
  const judgeId = req.body.judgeId;
  const updatedfirstname = req.body.firstname;
  const updatedlastname = req.body.lastname;
  const updatedEmail = req.body.email;
  const updatedKerberos = req.body.kerberos;
  const updatedIsActive = req.body.isActive;

  Judge.findByPk(judgeId)
    .then((judge) => {
      judge.firstname = updatedfirstname;
      judge.lastname = updatedlastname;
      judge.email = updatedEmail;
      judge.kerberos = updatedKerberos;
      judge.isActive = updatedIsActive;

      return judge.save();
    })
    .then((result) => {
      console.log('Updated Judge');
      res.redirect('/admin/judges');
    })
    .catch((err) => console.log(err));
};