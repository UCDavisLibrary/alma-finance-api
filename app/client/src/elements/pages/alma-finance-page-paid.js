import { LitElement } from 'lit';
import { render } from './alma-finance-page-paid.tpl.js';
import { LitCorkUtils, Mixin } from '@ucd-lib/cork-app-utils';
import AppComponentController from '../../controllers/AppComponentController.js';

function paidInvoiceSortValue(invoice) {
  const timestamp = Date.parse(invoice.datetime);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function sortPaidInvoices(invoices) {
  return [...invoices].sort((a, b) => {
    const dateDiff = paidInvoiceSortValue(b) - paidInvoiceSortValue(a);
    if (dateDiff) return dateDiff;

    return Number(b.id || 0) - Number(a.id || 0);
  });
}

export default class AlmaFinancePagePaid extends Mixin(LitElement).with(LitCorkUtils) {

  static get properties() {
    return {
      invoices: { type: Array },
      loading: { type: Boolean },
      error: { type: String },
      page: { type: Number },
      itemsPerPage: { type: Number },
    };
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.invoices = [];
    this.loading = false;
    this.error = '';
    this.page = 1;
    this.itemsPerPage = 10;
    this.ctl = { appComponent: new AppComponentController(this) };
    this._injectModel('AppStateModel');
  }

  createRenderRoot() { return this; }

  async _onAppStateUpdate(e) {
    if (!this.ctl.appComponent.isOnActivePage) return;
    this.page = 1;
    await this._loadInvoices();
    this.ctl.appComponent.showPage();
  }

  async _loadInvoices() {
    this.loading = true;
    this.error = '';
    try {
      const res = await fetch('/api/invoices/paid');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.invoices = sortPaidInvoices(data.invoices || []);
    } catch (e) {
      this.error = e.message;
    } finally {
      this.loading = false;
    }
  }

  get pagedInvoices() {
    const start = (this.page - 1) * this.itemsPerPage;
    return this.invoices.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.invoices.length / this.itemsPerPage);
  }
}

customElements.define('alma-finance-page-paid', AlmaFinancePagePaid);
