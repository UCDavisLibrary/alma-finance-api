import { LitElement } from 'lit';
import { render } from './alma-finance-page-admin.tpl.js';
import { LitCorkUtils, Mixin } from '@ucd-lib/cork-app-utils';
import AppComponentController from '../../controllers/AppComponentController.js';

export default class AlmaFinancePageAdmin extends Mixin(LitElement).with(LitCorkUtils) {

  constructor() {
    super();
    this.render = render.bind(this);
    this.ctl = { appComponent: new AppComponentController(this) };
    this._injectModel('AppStateModel');
  }

  createRenderRoot() { return this; }

  _onAppStateUpdate(e) {
    if (!this.ctl.appComponent.isOnActivePage) return;
    this.ctl.appComponent.showPage();
  }
}

customElements.define('alma-finance-page-admin', AlmaFinancePageAdmin);
