import { html } from 'lit';

export function render() {
  if (this.loading) return html`<div class="l-container u-space-my"><p>Loading invoices...</p></div>`;

  return html`
    <div class="l-container u-space-my">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h1 class="heading--highlight">All Invoices (Admin)</h1>
      </div>

      ${this.error ? html`<p class="color-secondary">Error: ${this.error}</p>` : ''}

      ${!this.invoices.length ? html`<p>No invoices found.</p>` : html`
        <p>${this.invoices.length} total. Page ${this.page} of ${this.totalPages}.</p>
        <table class="table--striped">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Invoice ID</th>
              <th>Library</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
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
                <td>
                  <a href="/admin/invoices/${inv.id}" class="btn btn--alt2 btn--sm">Edit</a>
                  <button class="btn btn--alt btn--sm u-space-ml" @click=${() => this._deleteInvoice(inv.id)}>Delete</button>
                </td>
              </tr>
            `)}
          </tbody>
        </table>
        <div class="pagination u-space-mt">
          ${this.page > 1 ? html`<button class="btn btn--alt2 btn--sm" @click=${() => { this.page--; }}>← Previous</button>` : ''}
          ${this.page < this.totalPages ? html`<button class="btn btn--alt2 btn--sm u-space-ml" @click=${() => { this.page++; }}>Next →</button>` : ''}
        </div>
      `}
    </div>
  `;
}
