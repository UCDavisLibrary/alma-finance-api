import { html } from 'lit';

function vendorData(vendor) {
  if (!vendor?.vendorData) return {};
  if (typeof vendor.vendorData === 'object') return vendor.vendorData;
  try {
    return JSON.parse(vendor.vendorData);
  } catch (e) {
    return {};
  }
}

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
              <th>ID</th>
              <th>Vendor ID</th>
              <th>Name</th>
              <th>Financial System Code</th>
              <th>Supplier Site Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this.vendors.map(vendor => {
              const data = vendorData(vendor);
              return html`
                <tr>
                  <td>${vendor.id || '—'}</td>
                  <td>${vendor.vendorId || '—'}</td>
                  <td>${data.name || '—'}</td>
                  <td>${data.financial_sys_code || '—'}</td>
                  <td>${data.additional_code || '—'}</td>
                  <td>
                    <button class="btn btn--alt btn--sm" @click=${() => this._deleteVendor(vendor.id)}>Delete</button>
                  </td>
                </tr>
              `;
            })}
          </tbody>
        </table>
      `}
    </div>
  `;
}
