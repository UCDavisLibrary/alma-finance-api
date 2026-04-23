import { LitElement } from 'lit';
import { render } from './alma-finance-page-admin-invoice.tpl.js';
import { LitCorkUtils, Mixin } from '@ucd-lib/cork-app-utils';
import AppComponentController from '../../controllers/AppComponentController.js';

export default class AlmaFinancePageAdminInvoice extends Mixin(LitElement).with(LitCorkUtils) {

  static get properties() {
    return {
      invoice: { type: Object },
      loading: { type: Boolean },
      saving: { type: Boolean },
      error: { type: String },
      success: { type: Boolean },
      invoiceId: { type: String },
      form: { type: Object },
    };
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.invoice = null;
    this.loading = false;
    this.saving = false;
    this.error = '';
    this.success = false;
    this.invoiceId = '';
    this.form = {};
    this.ctl = { appComponent: new AppComponentController(this) };
    this._injectModel('AppStateModel');
  }

  createRenderRoot() { return this; }

  async _onAppStateUpdate(e) {
    if (!this.ctl.appComponent.isOnActivePage) return;
    const id = e.location?.path?.[2];
    if (id && id !== this.invoiceId) {
      this.invoiceId = id;
      await this._loadInvoice(id);
    }
    this.success = false;
    this.ctl.appComponent.showPage();
  }

  async _loadInvoice(id) {
    this.loading = true;
    this.error = '';
    this.invoice = null;
    try {
      const res = await fetch(`/api/admin/invoices/${id}`);
      if (res.status === 404) { this.error = 'Invoice not found.'; return; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.invoice = data.invoice;
      this.form = { ...data.invoice };
    } catch (e) {
      this.error = e.message;
    } finally {
      this.loading = false;
    }
  }

  _updateField(field, value) {
    this.form = { ...this.form, [field]: value };
  }

  async _save() {
    this.saving = true;
    this.error = '';
    try {
      const res = await fetch(`/api/admin/invoices/${this.invoiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.success = true;
    } catch (e) {
      this.error = e.message;
    } finally {
      this.saving = false;
    }
  }
}

customElements.define('alma-finance-page-admin-invoice', AlmaFinancePageAdminInvoice);
