import { LitElement } from 'lit';
import { render } from './alma-finance-page-oracle-status.tpl.js';
import { LitCorkUtils, Mixin } from '@ucd-lib/cork-app-utils';
import AppComponentController from '../../controllers/AppComponentController.js';

export default class AlmaFinancePageOracleStatus extends Mixin(LitElement).with(LitCorkUtils) {

  static get properties() {
    return {
      invoices: { type: Array },
      loading: { type: Boolean },
      error: { type: String },
      updating: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.invoices = [];
    this.loading = false;
    this.error = '';
    this.updating = false;
    this.ctl = { appComponent: new AppComponentController(this) };
    this._injectModel('AppStateModel');
  }

  createRenderRoot() { return this; }

  async _onAppStateUpdate(e) {
    if (!this.ctl.appComponent.isOnActivePage) return;
    await this._loadStatus();
    this.ctl.appComponent.showPage();
  }

  async _loadStatus() {
    this.loading = true;
    this.error = '';
    try {
      const res = await fetch('/api/invoices/oracle-status');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.invoices = data.invoices || [];
    } catch (e) {
      this.error = e.message;
    } finally {
      this.loading = false;
    }
  }

  async _triggerUpdate() {
    this.updating = true;
    try {
      await fetch('/api/invoices/oracle-update', { method: 'POST' });
      await this._loadStatus();
    } catch (e) {
      this.error = e.message;
    } finally {
      this.updating = false;
    }
  }
}

customElements.define('alma-finance-page-oracle-status', AlmaFinancePageOracleStatus);
