import { LitElement, html } from 'lit';
import { LitCorkUtils, Mixin } from '@ucd-lib/cork-app-utils';
import AppComponentController from '../../controllers/AppComponentController.js';
import { apiFetch } from '../../lib/api.js';
import { formatCurrency, formatDate } from '../../lib/formatters.js';

class AlmaFinancePageAttention extends Mixin(LitElement).with(LitCorkUtils) {
  static properties = {
    invoices: { type: Array }, loading: { type: Boolean }, error: { type: String },
    sending: { type: String }, message: { type: String },
  };
  constructor() {
    super();
    this.invoices = [];
    this.loading = false;
    this.error = '';
    this.message = '';
    this.sending = '';
    this.ctl = { appComponent: new AppComponentController(this) };
    this._injectModel('AppStateModel');
  }
  createRenderRoot() { return this; }
  async _onAppStateUpdate() {
    if (!this.ctl.appComponent.isOnActivePage) return;
    this.message = '';
    await this._load();
    this.ctl.appComponent.showPage();
  }
  async _load() {
    this.loading = true;
    this.error = '';
    try {
      const res = await apiFetch('/api/invoices/needs-attention');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      this.invoices = data.invoices || [];
    } catch (error) { this.error = error.message; }
    finally { this.loading = false; }
  }
  async _resubmit(invoice) {
    if (this.sending || !confirm(`Resubmit invoice ${invoice.invoicenumber}? Review and correct its source data first. This creates a new payment request.`)) return;
    this.sending = invoice.invoiceid;
    this.error = '';
    this.message = '';
    try {
      const res = await apiFetch(`/api/invoices/${invoice.invoiceid}/resubmit`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.results?.[0]?.error?.map(error => error.message).join('; ') || data.error || `HTTP ${res.status}`);
      this.message = `Invoice ${invoice.invoicenumber} was submitted and is now in Unpaid Invoices.`;
      await this._load();
    } catch (error) { this.error = error.message; }
    finally { this.sending = ''; }
  }
  render() {
    return html`<div class="l-container u-space-my">
      <h1 class="heading--highlight">Needs Attention</h1>
      <p>These invoices failed processing after submission. Review the error and correct the source data before resubmitting.</p>
      <button class="btn btn--alt2 btn--sm" ?disabled=${this.loading || !!this.sending} @click=${this._load}>Reload</button>
      ${this.error ? html`<p role="alert" class="color-secondary">${this.error}</p>` : ''}
      ${this.message ? html`<p role="status">${this.message} <a href="/unpaid">View unpaid invoices</a></p>` : ''}
      ${this.loading ? html`<p>Loading invoices...</p>` : !this.invoices.length ? html`<p>No invoices need attention.</p>` : html`
        <table class="table--striped u-space-mt"><thead><tr>
          <th>Invoice</th><th>Amount</th><th>Detected</th><th>Processing error</th><th>Action</th>
        </tr></thead><tbody>${this.invoices.map(invoice => html`<tr>
          <td><a href="/invoice/${invoice.invoiceid}">${invoice.invoicenumber}</a></td>
          <td>${formatCurrency(invoice.totalAmount)}</td>
          <td>${formatDate(invoice.failureDetectedAt)}</td>
          <td><details><summary>View error</summary><pre style="white-space:pre-wrap;overflow-wrap:anywhere">${invoice.failureSummary}</pre></details></td>
          <td><button class="btn btn--primary btn--sm" ?disabled=${!!this.sending} @click=${() => this._resubmit(invoice)}>${this.sending === invoice.invoiceid ? 'Sending...' : 'Resubmit'}</button></td>
        </tr>`)}</tbody></table>`}
    </div>`;
  }
}
customElements.define('alma-finance-page-attention', AlmaFinancePageAttention);
