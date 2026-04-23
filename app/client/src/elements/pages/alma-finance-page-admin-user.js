import { LitElement } from 'lit';
import { render } from './alma-finance-page-admin-user.tpl.js';
import { LitCorkUtils, Mixin } from '@ucd-lib/cork-app-utils';
import AppComponentController from '../../controllers/AppComponentController.js';

export default class AlmaFinancePageAdminUser extends Mixin(LitElement).with(LitCorkUtils) {

  static get properties() {
    return {
      user: { type: Object },
      form: { type: Object },
      loading: { type: Boolean },
      saving: { type: Boolean },
      error: { type: String },
      success: { type: Boolean },
      userId: { type: String },
    };
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.user = null;
    this.form = {};
    this.loading = false;
    this.saving = false;
    this.error = '';
    this.success = false;
    this.userId = '';
    this.ctl = { appComponent: new AppComponentController(this) };
    this._injectModel('AppStateModel');
  }

  createRenderRoot() { return this; }

  async _onAppStateUpdate(e) {
    if (!this.ctl.appComponent.isOnActivePage) return;
    const id = e.location?.path?.[2];
    if (id && id !== this.userId) {
      this.userId = id;
      await this._loadUser(id);
    }
    this.success = false;
    this.ctl.appComponent.showPage();
  }

  async _loadUser(id) {
    this.loading = true;
    this.error = '';
    this.user = null;
    try {
      const res = await fetch(`/api/admin/users/${id}`);
      if (res.status === 404) { this.error = 'User not found.'; return; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.user = data.user;
      this.form = { ...data.user };
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
      const res = await fetch(`/api/admin/users/${this.userId}`, {
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

customElements.define('alma-finance-page-admin-user', AlmaFinancePageAdminUser);
