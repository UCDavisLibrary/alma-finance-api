import { AppStateModel } from '@ucd-lib/cork-app-state';
import AppStateStore from '../stores/AppStateStore.js';

class AppStateModelImpl extends AppStateModel {

  constructor() {
    super();
    this.defaultPage = 'home';
    this.currentPage = this.defaultPage;
    this.store = AppStateStore;
  }

  set(update) {
    this.setPage(update);
    this.setTitle(false, update);
    this.closeNav();
    return super.set(update);
  }

  refresh() {
    const location = this.store.data;
    this.setTitle(false, location);
    this.store.emit(this.store.events.APP_STATE_UPDATE, location);
  }

  setPage(update) {
    const path = update.location.path;
    const [p0, p1, p2] = path;
    let p;

    if (!p0) {
      p = this.defaultPage;
    } else if (p0 === 'preview') {
      p = 'preview';
    } else if (p0 === 'invoice') {
      p = 'invoice';
    } else if (p0 === 'paid') {
      p = 'paid';
    } else if (p0 === 'search') {
      p = 'search';
    } else if (p0 === 'oracle-status') {
      p = 'oracle-status';
    } else if (p0 === 'admin') {
      if (!p1) {
        p = 'admin';
      } else if (p1 === 'invoices') {
        p = p2 ? 'admin-invoice' : 'admin-invoices';
      } else if (p1 === 'users') {
        if (p2 === 'new') {
          p = 'admin-user-new';
        } else if (p2) {
          p = 'admin-user';
        } else {
          p = 'admin-users';
        }
      } else {
        p = 'admin';
      }
    } else if (p0 === 'funds') {
      p = 'funds';
    } else if (p0 === 'vendors') {
      p = 'vendors';
    } else {
      p = this.defaultPage;
    }

    update.page = p;
    this.currentPage = p;
  }

  setTitle(titleUpdate, update) {
    if (titleUpdate) {
      this.store.emit('app-header-update', { title: titleUpdate });
      return;
    }
    const text = this.store.pageTitles[update.page] || '';
    this.store.emit('app-header-update', {
      title: { show: !!text, text },
    });
  }

  showLoading(returnPage) {
    if (returnPage) this.store.lastPage = returnPage;
    this.store.emit('app-status-change', { status: 'loading' });
  }

  showError(msg = '') {
    this.store.emit('app-status-change', { status: 'error', errorMessage: msg });
  }

  showLoaded(page) {
    page = page || this.store.lastPage;
    this.store.emit('app-status-change', { status: 'loaded', page });
  }

  closeNav() {
    const ele = document.querySelector('ucd-theme-header');
    if (ele) ele.close?.();
  }
}

const model = new AppStateModelImpl();
export default model;
