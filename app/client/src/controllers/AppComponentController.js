import { Registry } from '@ucd-lib/cork-app-utils';

export default class AppComponentController {

  constructor(host) {
    this.host = host;
    host.addController(this);
    this.AppStateModel = Registry.getModel('AppStateModel');
    this.parentPageId = null;
    this.parentPage = null;
  }

  get isOnActivePage() {
    if (!this.parentPageId || !this.AppStateModel?.store?.data?.page) return false;
    return this.AppStateModel.store.data.page === this.parentPageId;
  }

  hostConnected() {
    this._setParentPage();
  }

  _setParentPage() {
    let el = this.host;
    while (el) {
      const p = el.getAttribute('page-id');
      if (p) {
        this.parentPageId = p;
        this.parentPage = el;
        return el;
      }
      if (el.parentElement) {
        el = el.parentElement;
      } else if (el.parentNode?.host) {
        el = el.parentNode.host;
      } else {
        return false;
      }
    }
  }

  showPage() {
    if (!this.parentPageId) return;
    this.AppStateModel.showLoaded(this.parentPageId);
  }
}
