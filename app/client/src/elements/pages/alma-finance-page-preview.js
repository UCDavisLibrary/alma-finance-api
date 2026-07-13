import { LitElement } from 'lit';
import { render } from './alma-finance-page-preview.tpl.js';
import { LitCorkUtils, Mixin } from '@ucd-lib/cork-app-utils';
import AppComponentController from '../../controllers/AppComponentController.js';

export default class AlmaFinancePagePreview extends Mixin(LitElement).with(LitCorkUtils) {

  static get properties() {
    return {
      invoices: { type: Array },
      loading: { type: Boolean },
      error: { type: String },
      selected: { type: Object },
      sendState: { type: String }, // 'idle' | 'sending' | 'done' | 'error'
      sendResults: { type: Array },
    };
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.invoices = [];
    this.loading = false;
    this.error = '';
    this.selected = {};
    this.sendState = 'idle';
    this.sendResults = [];
    this.ctl = { appComponent: new AppComponentController(this) };
    this._injectModel('AppStateModel');
  }

  createRenderRoot() { return this; }

  async _onAppStateUpdate(e) {
    if (!this.ctl.appComponent.isOnActivePage) return;
    this.sendState = 'idle';
    this.selected = {};
    await this._loadInvoices();
    this.ctl.appComponent.showPage();
  }

  async _loadInvoices() {
    this.loading = true;
    this.error = '';
    try {
      const res = await fetch('/api/invoices/pending');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.invoices = data.invoice || [];
    } catch (e) {
      this.error = e.message;
    } finally {
      this.loading = false;
    }
  }

  _toggleSelect(invoiceId) {
    const next = { ...this.selected };
    if (next[invoiceId]) {
      delete next[invoiceId];
    } else {
      next[invoiceId] = true;
    }
    this.selected = next;
  }

  _selectAll() {
    const next = {};
    this.invoices.forEach(inv => { next[inv.id] = true; });
    this.selected = next;
  }

  _clearAll() {
    this.selected = {};
  }

  async _sendSelected() {
    const invoiceids = Object.keys(this.selected);
    if (!invoiceids.length) return;

    this.sendState = 'sending';
    try {
      const res = await fetch('/api/invoices/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceids }),
      });
      const data = await res.json();
      this.sendResults = data.results || [];
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      this.sendState = 'done';
      await this._loadInvoices();
    } catch (e) {
      this.error = e.message;
      this.sendState = 'error';
    }
  }
}

customElements.define('alma-finance-page-preview', AlmaFinancePagePreview);
