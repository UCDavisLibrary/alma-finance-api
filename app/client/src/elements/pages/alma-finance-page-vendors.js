import { LitElement } from 'lit';
import { render } from './alma-finance-page-vendors.tpl.js';
import { LitCorkUtils, Mixin } from '@ucd-lib/cork-app-utils';
import AppComponentController from '../../controllers/AppComponentController.js';

export default class AlmaFinancePageVendors extends Mixin(LitElement).with(LitCorkUtils) {

  static get properties() {
    return {
      vendors: { type: Array },
      loading: { type: Boolean },
      error: { type: String },
    };
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.vendors = [];
    this.loading = false;
    this.error = '';
    this.ctl = { appComponent: new AppComponentController(this) };
    this._injectModel('AppStateModel');
  }

  createRenderRoot() { return this; }

  async _onAppStateUpdate(e) {
    if (!this.ctl.appComponent.isOnActivePage) return;
    await this._loadVendors();
    this.ctl.appComponent.showPage();
  }

  async _loadVendors() {
    this.loading = true;
    this.error = '';
    try {
      const res = await fetch('/api/vendors');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.vendors = data.vendors || [];
    } catch (e) {
      this.error = e.message;
    } finally {
      this.loading = false;
    }
  }

  async _deleteVendor(id) {
    if (!confirm('Delete this vendor?')) return;
    try {
      const res = await fetch(`/api/vendors/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await this._loadVendors();
    } catch (e) {
      this.error = e.message;
    }
  }
}

customElements.define('alma-finance-page-vendors', AlmaFinancePageVendors);
