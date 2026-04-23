import { LitElement } from 'lit';
import { render } from './alma-finance-page-funds.tpl.js';
import { LitCorkUtils, Mixin } from '@ucd-lib/cork-app-utils';
import AppComponentController from '../../controllers/AppComponentController.js';

export default class AlmaFinancePageFunds extends Mixin(LitElement).with(LitCorkUtils) {

  static get properties() {
    return {
      funds: { type: Array },
      loading: { type: Boolean },
      error: { type: String },
    };
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.funds = [];
    this.loading = false;
    this.error = '';
    this.ctl = { appComponent: new AppComponentController(this) };
    this._injectModel('AppStateModel');
  }

  createRenderRoot() { return this; }

  async _onAppStateUpdate(e) {
    if (!this.ctl.appComponent.isOnActivePage) return;
    await this._loadFunds();
    this.ctl.appComponent.showPage();
  }

  async _loadFunds() {
    this.loading = true;
    this.error = '';
    try {
      const res = await fetch('/api/funds');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.funds = data.funds || [];
    } catch (e) {
      this.error = e.message;
    } finally {
      this.loading = false;
    }
  }

  async _deleteFund(id) {
    if (!confirm('Delete this fund?')) return;
    try {
      const res = await fetch(`/api/funds/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await this._loadFunds();
    } catch (e) {
      this.error = e.message;
    }
  }
}

customElements.define('alma-finance-page-funds', AlmaFinancePageFunds);
