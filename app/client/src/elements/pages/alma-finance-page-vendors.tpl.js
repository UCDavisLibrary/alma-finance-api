import { html } from 'lit';

export function render() {
  if (this.loading) return html`<div class="l-container u-space-my"><p>Loading vendors...</p></div>`;

  return html`
    <div class="l-container u-space-my">
      <h1 class="heading--highlight">Vendors</h1>

      ${this.error ? html`<p class="color-secondary">Error: ${this.error}</p>` : ''}

      ${!this.vendors.length ? html`<p>No vendors found.</p>` : html`
        <table class="table--striped u-space-mt">
          <thead>
            <tr>
              <th>Vendor Code</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this.vendors.map(vendor => html`
              <tr>
                <td>${vendor.vendorcode || vendor.vendor_code || '—'}</td>
                <td>${vendor.name || '—'}</td>
                <td>
                  <button class="btn btn--alt btn--sm" @click=${() => this._deleteVendor(vendor.id)}>Delete</button>
                </td>
              </tr>
            `)}
          </tbody>
        </table>
      `}
    </div>
  `;
}
