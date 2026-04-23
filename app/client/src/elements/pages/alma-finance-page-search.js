import { LitElement } from 'lit';
import { render } from './alma-finance-page-search.tpl.js';
import { LitCorkUtils, Mixin } from '@ucd-lib/cork-app-utils';
import AppComponentController from '../../controllers/AppComponentController.js';

export default class AlmaFinancePageSearch extends Mixin(LitElement).with(LitCorkUtils) {

  static get properties() {
    return {
      searchTerm: { type: String },
      results: { type: Array },
      loading: { type: Boolean },
      error: { type: String },
      searched: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.searchTerm = '';
    this.results = [];
    this.loading = false;
    this.error = '';
    this.searched = false;
    this.ctl = { appComponent: new AppComponentController(this) };
    this._injectModel('AppStateModel');
  }

  createRenderRoot() { return this; }

  async _onAppStateUpdate(e) {
    if (!this.ctl.appComponent.isOnActivePage) return;
    this.searched = false;
    this.results = [];
    this.error = '';
    this.ctl.appComponent.showPage();
  }

  async _doSearch() {
    if (!this.searchTerm.trim()) return;
    this.loading = true;
    this.error = '';
    this.searched = false;
    try {
      const res = await fetch(`/api/invoices/search?q=${encodeURIComponent(this.searchTerm)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.results = data.invoices || [];
      this.searched = true;
    } catch (e) {
      this.error = e.message;
    } finally {
      this.loading = false;
    }
  }

  _onKeydown(e) {
    if (e.key === 'Enter') this._doSearch();
  }
}

customElements.define('alma-finance-page-search', AlmaFinancePageSearch);
