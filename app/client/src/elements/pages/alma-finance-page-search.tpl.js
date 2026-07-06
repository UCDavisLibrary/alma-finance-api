import { html } from 'lit';

export function render() {
  return html`
    <div class="l-container u-space-my">
      <h1 class="heading--highlight">Search Invoices</h1>

      <div class="search-form u-space-mb" style="display:flex;gap:0.5rem;align-items:center;">
        <input type="text"
          class="form-input"
          placeholder="Invoice number or vendor..."
          style="max-width:400px;width:100%;"
          .value=${this.searchTerm}
          @input=${e => { this.searchTerm = e.target.value; }}
          @keydown=${this._onKeydown}>
        <button class="btn btn--primary" @click=${this._doSearch} ?disabled=${this.loading}>
          ${this.loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      ${this.error ? html`<p class="color-secondary">Error: ${this.error}</p>` : ''}

      ${this.searched && !this.results.length ? html`
        <p>No invoices found for <strong>${this.searchTerm}</strong>.</p>
      ` : ''}

      ${this.results.length ? html`
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
            ${this.results.map(inv => html`
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
      ` : ''}
    </div>
  `;
}
