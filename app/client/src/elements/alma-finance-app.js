import { LitElement } from 'lit';
import { render } from './alma-finance-app.tpl.js';

// brand components
import '@ucd-lib/theme-elements/brand/ucd-theme-primary-nav/ucd-theme-primary-nav.js';
import '@ucd-lib/theme-elements/ucdlib/ucdlib-branding-bar/ucdlib-branding-bar.js';
import '@ucd-lib/theme-elements/brand/ucd-theme-header/ucd-theme-header.js';
import '@ucd-lib/theme-elements/ucdlib/ucdlib-pages/ucdlib-pages.js';

// global event bus and model registry
import { LitCorkUtils, Mixin, Registry } from '@ucd-lib/cork-app-utils';
import '../models/index.js';
Registry.ready();

// pages
import './pages/alma-finance-page-home.js';
import './pages/alma-finance-page-preview.js';
import './pages/alma-finance-page-invoice.js';
import './pages/alma-finance-page-paid.js';
import './pages/alma-finance-page-search.js';
import './pages/alma-finance-page-oracle-status.js';
import './pages/alma-finance-page-admin.js';
import './pages/alma-finance-page-admin-invoices.js';
import './pages/alma-finance-page-admin-invoice.js';
import './pages/alma-finance-page-admin-users.js';
import './pages/alma-finance-page-admin-user-new.js';
import './pages/alma-finance-page-admin-user.js';
import './pages/alma-finance-page-funds.js';
import './pages/alma-finance-page-vendors.js';

export default class AlmaFinanceApp extends Mixin(LitElement).with(LitCorkUtils) {

  static get properties() {
    return {
      page: { type: String },
      pageTitle: { type: String },
      showPageTitle: { type: Boolean },
      status: { type: String },
      errorMessage: { type: String },
    };
  }

  constructor() {
    super();
    this.render = render.bind(this);

    this.page = 'loading';
    this.pageTitle = '';
    this.showPageTitle = false;
    this.status = 'loading';

    this._injectModel('AppStateModel');
    this.AppStateModel.refresh();
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.style.display = 'block';
    const loader = document.querySelector('#whole-screen-load');
    if (loader) loader.style.display = 'none';
  }

  _onAppStateUpdate(e) {
    this.page = e.page;
    window.scroll(0, 0);
    this.AppStateModel.showLoaded(e.page);
  }

  _onAppHeaderUpdate(e) {
    if (e.title) {
      this.showPageTitle = e.title.show;
      this.pageTitle = e.title.text;
    }
  }

  _onAppStatusChange(status) {
    this.status = status.status;
    if (status.page) {
      this.page = status.page;
    }
    if (Object.prototype.hasOwnProperty.call(status, 'errorMessage')) {
      this.errorMessage = status.errorMessage;
    }
  }
}

customElements.define('alma-finance-app', AlmaFinanceApp);
