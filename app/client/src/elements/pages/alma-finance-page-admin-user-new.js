import { LitElement } from 'lit';
import { render } from './alma-finance-page-admin-user-new.tpl.js';
import { LitCorkUtils, Mixin } from '@ucd-lib/cork-app-utils';
import AppComponentController from '../../controllers/AppComponentController.js';

export default class AlmaFinancePageAdminUserNew extends Mixin(LitElement).with(LitCorkUtils) {

  static get properties() {
    return {
      form: { type: Object },
      saving: { type: Boolean },
      error: { type: String },
      success: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.form = { firstname: '', lastname: '', email: '', kerberos: '', library: '' };
    this.saving = false;
    this.error = '';
    this.success = false;
    this.ctl = { appComponent: new AppComponentController(this) };
    this._injectModel('AppStateModel');
  }

  createRenderRoot() { return this; }

  _onAppStateUpdate(e) {
    if (!this.ctl.appComponent.isOnActivePage) return;
    this.form = { firstname: '', lastname: '', email: '', kerberos: '', library: '' };
    this.success = false;
    this.error = '';
    this.ctl.appComponent.showPage();
  }

  _updateField(field, value) {
    this.form = { ...this.form, [field]: value };
  }

  async _submit() {
    this.saving = true;
    this.error = '';
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.success = true;
      this.form = { firstname: '', lastname: '', email: '', kerberos: '', library: '' };
    } catch (e) {
      this.error = e.message;
    } finally {
      this.saving = false;
    }
  }
}

customElements.define('alma-finance-page-admin-user-new', AlmaFinancePageAdminUserNew);
