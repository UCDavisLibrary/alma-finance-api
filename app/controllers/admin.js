import { tokenGenerator } from './tokengenerator.js';
import { checkErpRolesOracle } from './graphqlcalls.js';
import {
  postSaveTodaysToken,
  fetchAllUsers,
  postAddUser,
  postEditUser,
  deleteUser,
  getAllInvoicesAdmin,
  getInvoiceById,
  postEditInvoice,
  postUpdateInvoiceStatus,
  deleteInvoice,
} from './dbcalls.js';
import { logMessage } from '../util/logger.js';
import User from '../models/user.js';

const ITEMS_PER_PAGE = 10;

export async function getAdminCheckToken(req, res) {
  const token = await tokenGenerator();
  postSaveTodaysToken(token);
  res.sendStatus(200);
}

export async function getAdmincheckERPRoles(req, res) {
  await checkErpRolesOracle();
  res.sendStatus(200);
}

export function getAdminView(req, res) {
  res.render('admin', { title: 'Payment Processor - Admin', isUser: false, isAdmin: true });
}

export async function getAdminViewUsers(req, res) {
  try {
    const users = await fetchAllUsers();
    res.render('user-list', { title: 'View All Users', users, isUser: false, isAdmin: true });
  } catch (error) {
    logMessage('DEBUG', 'admin: getAdminViewUsers()', error);
    res.redirect('/admin');
  }
}

export function getAdminAddUser(req, res) {
  res.render('edit-user', { title: 'Add User', editMode: false, isAdmin: true, isUser: false });
}

export async function postAdminAddUser(req, res) {
  const body = req.body;
  try {
    const response = await postAddUser(body.firstname, body.lastname, body.email, body.kerberos, body.library);
    const status = response ? 200 : 500;
    res.status(status).render('useradded', {
      body,
      title: response ? 'New User Added' : 'Error Adding User',
      isUser: false,
      isAdmin: true,
      editMode: true,
    });
  } catch (error) {
    logMessage('DEBUG', 'admin: postAdminAddUser()', error);
    res.status(500).render('useradded', { body, title: 'Error Adding User', isUser: false, isAdmin: true, editMode: true });
  }
}

export function getAdminEditUser(req, res) {
  const { userId } = req.params;
  User.findByID(userId)
    .then((user) => {
      if (!user) return res.redirect('/admin/users');
      res.render('edit-user', {
        title: 'Edit User',
        path: '/edit-user',
        user: user[0][0],
        isUser: false,
        isAdmin: true,
        editMode: true,
      });
    })
    .catch((err) => logMessage('DEBUG', 'admin: getAdminEditUser()', err));
}

export async function postAdminEditUser(req, res) {
  const { firstname, lastname, email, kerberos, library, userId } = req.body;
  try {
    const result = await postEditUser(firstname, lastname, email, kerberos, library, userId);
    if (result) {
      logMessage('INFO', 'Updated user');
      res.redirect('/admin/users');
    }
  } catch (error) {
    logMessage('DEBUG', 'admin: postAdminEditUser()', error);
  }
}

export async function adminDeleteUser(req, res) {
  const id = req.body.id;
  try {
    const result = await deleteUser(id);
    if (result) {
      logMessage('INFO', 'Deleted user');
      res.redirect('/admin/users');
    }
  } catch (error) {
    logMessage('DEBUG', 'admin: adminDeleteUser()', error);
  }
}

export async function getAdminViewInvoices(req, res) {
  try {
    const step1 = await getAllInvoicesAdmin();
    const invoices = step1[0];
    const totalItems = invoices.length;
    const page = +req.query.page || 1;

    res.render('invoice-list', {
      title: 'Admin View All Invoices',
      invoices: invoices.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
      isUser: false,
      isAdmin: true,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
    });
  } catch (error) {
    logMessage('DEBUG', 'admin: getAdminViewInvoices()', error);
    res.redirect('/admin');
  }
}

export function getAdminEditInvoice(req, res) {
  const { id } = req.params;
  getInvoiceById(id)
    .then((invoice) => {
      if (!invoice) return res.redirect('/admin/');
      res.render('edit-invoice', {
        title: 'Edit Invoice',
        path: '/edit-invoice',
        invoice: invoice[0][0],
        isUser: false,
        isAdmin: true,
        editMode: true,
      });
    })
    .catch((err) => logMessage('DEBUG', 'admin: getAdminEditInvoice()', err));
}

export async function postAdminEditInvoice(req, res) {
  const { invoicenumber, invoiceid, consumerTrackingId, status, library, responsebody, datetime, id } = req.body;
  try {
    const result = await postEditInvoice(invoicenumber, invoiceid, consumerTrackingId, library, status, responsebody, datetime, id);
    if (result) {
      logMessage('INFO', 'Updated Invoice');
      res.redirect('/admin/');
    }
  } catch (error) {
    logMessage('DEBUG', 'admin: postAdminEditInvoice()', error);
  }
}

export async function postAdminUpdateInvoiceStatus(req, res) {
  const { status, id } = req.body;
  try {
    const result = await postUpdateInvoiceStatus(status, id);
    if (result) {
      logMessage('INFO', 'Updated invoice status');
      res.redirect('/admin/invoices');
    }
  } catch (error) {
    logMessage('DEBUG', 'admin: postAdminUpdateInvoiceStatus()', error);
  }
}

export async function adminDeleteInvoice(req, res) {
  const id = req.body.id;
  try {
    const result = await deleteInvoice(id);
    if (result) {
      logMessage('INFO', 'Deleted invoice');
      res.redirect('/admin/invoices');
    }
  } catch (error) {
    logMessage('DEBUG', 'admin: adminDeleteInvoice()', error);
  }
}
