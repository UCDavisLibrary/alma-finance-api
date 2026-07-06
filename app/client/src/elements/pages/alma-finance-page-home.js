import { LitElement } from 'lit';
import { render } from './alma-finance-page-home.tpl.js';
import { LitCorkUtils, Mixin } from '@ucd-lib/cork-app-utils';
import AppComponentController from '../../controllers/AppComponentController.js';

export default class AlmaFinancePageHome extends Mixin(LitElement).with(LitCorkUtils) {

  static get properties() {
    return {
      user: { type: Object },
    };
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.user = null;
    this.ctl = { appComponent: new AppComponentController(this) };
    this._injectModel('AppStateModel');
  }

  createRenderRoot() { return this; }

  async _onAppStateUpdate(e) {
    if (!this.ctl.appComponent.isOnActivePage) return;
    await this._loadUser();
    this.ctl.appComponent.showPage();
  }

  async _loadUser() {
    try {
      const res = await fetch('/api/me');
      if (res.ok) {
        const data = await res.json();
        this.user = data.user;
      }
    } catch (e) {
      console.error('Failed to load user', e);
    }
  }
}

customElements.define('alma-finance-page-home', AlmaFinancePageHome);
