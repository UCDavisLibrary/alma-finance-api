import { html } from 'lit';

function oracleSearch(invoice) {
  return invoice.data?.scmInvoicePaymentSearch;
}

function oraclePayment(invoice) {
  return oracleSearch(invoice)?.data?.[0];
}

function formatCurrency(amount, currency = '') {
  if (amount == null || amount === '') return '—';
  const value = Number(amount);
  const formatted = Number.isFinite(value) ? `$${value.toFixed(2)}` : amount;
  return currency ? `${formatted} ${currency}` : formatted;
}

function vendorName(invoice) {
  return invoice.vendor?.desc || oraclePayment(invoice)?.supplierName || '—';
}

function invoiceAmount(invoice) {
  return formatCurrency(
    invoice.total_amount ?? invoice.invoice_amount?.sum ?? oraclePayment(invoice)?.paymentAmount,
    invoice.invoice_amount?.currency
  );
}

function oracleStatus(invoice) {
  const search = oracleSearch(invoice);
  if (!search) return invoice.status || '—';
  if (search.metadata?.returnedResultCount === 0 || !search.data?.length) return 'Not found';

  const paymentStatusCode = search.data[0].paymentStatusCode;
  if (paymentStatusCode === 'Y') return 'Payment scheduled';
  if (paymentStatusCode === 'N') return 'Not yet paid';
  return paymentStatusCode || 'Unknown';
}

export function render() {
  if (this.loading) return html`<div class="l-container u-space-my"><p>Loading Oracle status...</p></div>`;

  return html`
    <div class="l-container u-space-my">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h1 class="heading--highlight">Unpaid Invoices</h1>
        <button class="btn btn--primary btn--sm" @click=${this._triggerUpdate} ?disabled=${this.updating}>
          ${this.updating ? 'Updating...' : 'Refresh Status'}
        </button>
      </div>

      ${this.error ? html`<p class="color-secondary u-space-mt">Error: ${this.error}</p>` : ''}

      ${!this.invoices.length ? html`
        <p class="u-space-mt">No unpaid invoices found to check.</p>
      ` : html`
        <table class="table--striped u-space-mt">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Vendor</th>
              <th>Amount</th>
              <th>Oracle Status</th>
            </tr>
          </thead>
          <tbody>
            ${this.invoices.map(inv => html`
              <tr>
                <td>${inv.number || inv.invoicenumber || '—'}</td>
                <td>${vendorName(inv)}</td>
                <td>${invoiceAmount(inv)}</td>
                <td>${oracleStatus(inv)}</td>
              </tr>
            `)}
          </tbody>
        </table>
      `}
    </div>
  `;
}
