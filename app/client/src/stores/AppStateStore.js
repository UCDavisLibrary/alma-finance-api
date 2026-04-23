import { AppStateStore } from '@ucd-lib/cork-app-state';

class AppStateStoreImpl extends AppStateStore {
  constructor() {
    super();
    this.lastPage = 'home';

    this.breadcrumbs = {
      home: { text: 'Home', link: '/' },
      preview: { text: 'Pending Invoices', link: '/preview' },
      paid: { text: 'Paid Invoices', link: '/paid' },
      search: { text: 'Search', link: '/search' },
      oracleStatus: { text: 'Oracle Status', link: '/oracle-status' },
      funds: { text: 'Funds', link: '/funds' },
      vendors: { text: 'Vendors', link: '/vendors' },
      admin: { text: 'Admin', link: '/admin' },
      adminInvoices: { text: 'All Invoices', link: '/admin/invoices' },
      adminUsers: { text: 'Users', link: '/admin/users' },
    };

    this.pageTitles = {
      home: 'Payment Processor',
      preview: 'Pending Invoices',
      invoice: 'Invoice Detail',
      paid: 'Paid Invoices',
      search: 'Search Invoices',
      'oracle-status': 'Oracle Status',
      admin: 'Admin',
      'admin-invoices': 'All Invoices',
      'admin-invoice': 'Edit Invoice',
      'admin-users': 'Users',
      'admin-user-new': 'Add User',
      'admin-user': 'Edit User',
      funds: 'Funds',
      vendors: 'Vendors',
    };

    this.events.APP_STATUS_CHANGE = 'app-status-change';
    this.events.APP_HEADER_UPDATE = 'app-header-update';
  }
}

const store = new AppStateStoreImpl();
export default store;
