import { LitElement } from 'lit';
import { render } from './alma-finance-page-admin-users.tpl.js';
import { LitCorkUtils, Mixin } from '@ucd-lib/cork-app-utils';
import AppComponentController from '../../controllers/AppComponentController.js';

export default class AlmaFinancePageAdminUsers extends Mixin(LitElement).with(LitCorkUtils) {

  static get properties() {
    return {
      users: { type: Array },
      loading: { type: Boolean },
      error: { type: String },
    };
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.users = [];
    this.loading = false;
    this.error = '';
    this.ctl = { appComponent: new AppComponentController(this) };
    this._injectModel('AppStateModel');
  }

  createRenderRoot() { return this; }

  async _onAppStateUpdate(e) {
    if (!this.ctl.appComponent.isOnActivePage) return;
    await this._loadUsers();
    this.ctl.appComponent.showPage();
  }

  async _loadUsers() {
    this.loading = true;
    this.error = '';
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.users = data.users || [];
    } catch (e) {
      this.error = e.message;
    } finally {
      this.loading = false;
    }
  }

  async _deleteUser(id) {
    if (!confirm('Delete this user?')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await this._loadUsers();
    } catch (e) {
      this.error = e.message;
    }
  }
}

customElements.define('alma-finance-page-admin-users', AlmaFinancePageAdminUsers);
