import { LitElement } from 'lit';
import { render } from './alma-finance-page-invoice.tpl.js';
import { LitCorkUtils, Mixin } from '@ucd-lib/cork-app-utils';
import AppComponentController from '../../controllers/AppComponentController.js';

export default class AlmaFinancePageInvoice extends Mixin(LitElement).with(LitCorkUtils) {

  static get properties() {
    return {
      dbInvoice: { type: Object },
      almaInvoice: { type: Object },
      vendor: { type: Object },
      paymentStatus: { type: Object },
      oracleStatus: { type: Object },
      loading: { type: Boolean },
      error: { type: String },
      invoiceId: { type: String },
    };
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.dbInvoice = null;
    this.almaInvoice = null;
    this.vendor = null;
    this.paymentStatus = null;
    this.oracleStatus = null;
    this.loading = false;
    this.error = '';
    this.invoiceId = '';
    this.ctl = { appComponent: new AppComponentController(this) };
    this._injectModel('AppStateModel');
  }

  createRenderRoot() { return this; }

  async _onAppStateUpdate(e) {
    if (!this.ctl.appComponent.isOnActivePage) return;
    const id = e.location?.path?.[1];
    if (!id) return;
    if (id !== this.invoiceId) {
      this.invoiceId = id;
      await this._loadInvoice(id);
    }
    this.ctl.appComponent.showPage();
  }

  async _loadInvoice(id) {
    this.loading = true;
    this.error = '';
    this.dbInvoice = null;
    this.almaInvoice = null;
    this.vendor = null;
    this.paymentStatus = null;
    this.oracleStatus = null;

    try {
      const [dbRes, almaRes, paymentRes, oracleRes] = await Promise.all([
        fetch(`/api/invoices/${id}`),
        fetch(`/api/invoices/${id}/alma`),
        fetch(`/api/invoices/${id}/payment-status`),
        fetch(`/api/invoices/${id}/oracle-status`),
      ]);

      const readBody = async (res) => {
        try {
          return await res.clone().json();
        } catch (e) {
          try {
            return await res.text();
          } catch (err) {
            return null;
          }
        }
      };

      console.log('Invoice detail endpoint statuses:', {
        db: `${dbRes.status} ${dbRes.statusText}`,
        alma: `${almaRes.status} ${almaRes.statusText}`,
        payment: `${paymentRes.status} ${paymentRes.statusText}`,
        oracle: `${oracleRes.status} ${oracleRes.statusText}`,
      });

      if (dbRes.ok) {
        const data = await dbRes.json();
        this.dbInvoice = data.invoice || null;
      } else {
        console.log('DB invoice endpoint response:', await readBody(dbRes));
      }

      if (almaRes.ok) {
        const data = await almaRes.json();
        this.almaInvoice = data.invoice || null;
        this.vendor = data.vendor || null;
      } else if (almaRes.status === 404) {
        this.error = 'Invoice not found in Alma.';
        console.log('Alma invoice endpoint response:', await readBody(almaRes));
      } else {
        console.log('Alma invoice endpoint response:', await readBody(almaRes));
      }

      if (paymentRes.ok) {
        const data = await paymentRes.json();
        console.log('Payment status endpoint response:', data);
        this.paymentStatus = data.data || null;
      } else {
        console.log('Payment status endpoint response:', await readBody(paymentRes));
      }

      if (oracleRes.ok) {
        const data = await oracleRes.json();
        console.log('Oracle status endpoint response:', data);
        this.oracleStatus = data.data || null;
      } else {
        console.log('Oracle status endpoint response:', await readBody(oracleRes));
      }

      if (!this.dbInvoice && !this.almaInvoice) {
        this.error = 'Invoice not found.';
      }
    } catch (e) {
      this.error = e.message;
    } finally {
      this.loading = false;
    }
  }
}

customElements.define('alma-finance-page-invoice', AlmaFinancePageInvoice);
