import { html } from 'lit';

function fundSummary(invoice) {
  const lines = invoice.invoice_lines?.invoice_line;
  if (!lines?.length) return '—';
  const totals = {};
  for (const line of lines) {
    for (const dist of (line.fund_distribution || [])) {
      const code = dist.fund_code?.value;
      if (!code) continue;
      const amount = dist.amount?.sum ?? (line.price * (dist.percent ?? 100) / 100);
      totals[code] = (totals[code] || 0) + Number(amount);
    }
  }
  const entries = Object.entries(totals);
  if (!entries.length) return '—';
  return entries.map(([code, amt]) => `${code}: $${amt.toFixed(2)}`).join(', ');
}

function formatDate(raw) {
  if (!raw) return '—';
  const d = new Date(raw);
  return isNaN(d) ? raw : d.toLocaleDateString();
}

export function render() {
  if (this.loading) return html`<div class="l-container u-space-my"><p>Loading invoices...</p></div>`;
  if (this.error && this.sendState !== 'error') return html`<div class="l-container u-space-my"><p class="color-secondary">Error: ${this.error}</p></div>`;

  if (this.sendState === 'done') {
    return html`
      <div class="l-container u-space-my">
        <h1 class="heading--highlight">Invoices Sent</h1>
        <p>The following invoices were submitted to Aggie Enterprise:</p>
        <table class="table--striped">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Vendor Name</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${this.sendResults.map(r => html`
              <tr>
                <td>${r.invoice?.number || '—'}</td>
                <td>${r.invoice?.vendor?.desc || '—'}</td>
                <td>${r.invoice?.total_amount != null ? `$${Number(r.invoice.total_amount).toFixed(2)}` : '—'}</td>
                <td>${r.error ? html`<span class="color-secondary">Error</span>` : html`<span class="color-gold">Submitted</span>`}</td>
              </tr>
            `)}
          </tbody>
        </table>
        <div class="u-space-mt">
          <button class="btn btn--primary" @click=${() => { this.sendState = 'idle'; this._loadInvoices(); }}>Back to Invoices Waiting to be Sent</button>
        </div>
      </div>
    `;
  }

  return html`
    <div class="l-container u-space-my">
      <div style="display:flex;align-items:center;gap:1rem">
        <h1 class="heading--highlight" style="margin:0">Invoices Waiting to be Sent</h1>
      </div>

      ${!this.invoices.length ? html`
        <div class="brand-textbox u-space-my">
          <h3>No Invoices</h3>
          <p>No invoices are waiting to be sent.</p>
          <p>If you feel you are reading this message in error, within Alma go to <strong>Acquisitions → Waiting for Payment</strong>.</p>
        </div>
      ` : html`
        <div class="u-space-mb">
          <button class="btn btn--alt2 btn--sm" @click=${() => this._selectAll()}>Select All</button>
          <button class="btn btn--alt2 btn--sm u-space-ml" @click=${() => this._clearAll()}>Clear</button>
          <button class="btn btn--alt2 btn--sm u-space-ml" @click=${() => this._loadInvoices()}>Reload Invoices</button>
        </div>
        <table class="table--striped">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Vendor Name</th>
              <th>Date</th>
              <th>Fund External ID: Amount</th>
              <th>Invoice Total</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            ${this.invoices.map(inv => html`
              <tr>
                <td><a href="/invoice/${inv.id}">${inv.number}</a></td>
                <td>${inv.vendor?.desc || '—'}</td>
                <td>${formatDate(inv.invoice_date)}</td>
                <td>${fundSummary(inv)}</td>
                <td>${inv.total_amount != null ? `$${Number(inv.total_amount).toFixed(2)}` : '—'}</td>
                <td>
                  <input type="checkbox"
                    .checked=${!!this.selected[inv.id]}
                    @change=${() => this._toggleSelect(inv.id)}>
                </td>
              </tr>
            `)}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" style="text-align:right"><strong>Total</strong></td>
              <td><strong>$${this.invoices.filter(inv => this.selected[inv.id]).reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0).toFixed(2)}</strong></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
        <div class="u-space-mt">
          <button class="btn btn--primary"
            ?disabled=${!Object.keys(this.selected).length || this.sendState === 'sending'}
            @click=${() => this._sendSelected()}>
            ${this.sendState === 'sending' ? 'Sending...' : `Send ${Object.keys(this.selected).length} Selected`}
          </button>
          ${this.sendState === 'error' ? html`
            <p class="color-secondary u-space-mt">Error sending: ${this.error}</p>
            ${this.sendResults?.length ? html`
              <table class="table--striped u-space-mt">
                <thead>
                  <tr>
                    <th>Invoice Number</th>
                    <th>Error</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.sendResults.map(result => html`
                    <tr>
                      <td>${result.invoice?.number || '—'}</td>
                      <td>${(result.error || []).map(error => error.message || String(error)).join('; ') || 'Unknown error'}</td>
                    </tr>
                  `)}
                </tbody>
              </table>
            ` : ''}
          ` : ''}
        </div>
      `}
    </div>
  `;
}
