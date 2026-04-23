import { html } from 'lit';

export function render() {
  if (this.loading) return html`<div class="l-container u-space-my"><p>Loading paid invoices...</p></div>`;
  if (this.error) return html`<div class="l-container u-space-my"><p class="color-secondary">Error: ${this.error}</p></div>`;

  return html`
    <div class="l-container u-space-my">
      <h1 class="heading--highlight">Paid Invoices</h1>

      ${!this.invoices.length ? html`
        <p>No paid invoices found.</p>
      ` : html`
        <p>${this.invoices.length} total invoices. Page ${this.page} of ${this.totalPages}.</p>
        <table class="table--striped">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Invoice ID</th>
              <th>Library</th>
              <th>Status</th>
              <th>Date</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            ${this.pagedInvoices.map(inv => html`
              <tr>
                <td>${inv.invoicenumber}</td>
                <td>${inv.invoiceid}</td>
                <td>${inv.library}</td>
                <td>${inv.status}</td>
                <td>${inv.datetime ? new Date(inv.datetime).toLocaleDateString() : '—'}</td>
                <td><a href="/invoice/${inv.invoiceid}">View</a></td>
              </tr>
            `)}
          </tbody>
        </table>

        <div class="pagination u-space-mt">
          ${this.page > 1 ? html`
            <button class="btn btn--alt2 btn--sm" @click=${() => { this.page--; }}>← Previous</button>
          ` : ''}
          ${this.page < this.totalPages ? html`
            <button class="btn btn--alt2 btn--sm u-space-ml" @click=${() => { this.page++; }}>Next →</button>
          ` : ''}
        </div>
      `}
    </div>
  `;
}
