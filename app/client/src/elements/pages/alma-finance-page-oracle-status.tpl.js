import { html } from 'lit';

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
                <td>${inv.vendor?.value?.[0]?.desc || '—'}</td>
                <td>${inv.invoice_amount?.sum || '—'} ${inv.invoice_amount?.currency || ''}</td>
                <td>${inv.requestStatus?.requestStatus || inv.status || '—'}</td>
              </tr>
            `)}
          </tbody>
        </table>
      `}
    </div>
  `;
}
