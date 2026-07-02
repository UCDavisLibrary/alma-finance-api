import { html } from 'lit';

export function render() {
  return html`
    <div class="l-container u-space-my">
      <h1 class="heading--highlight">Payment Processor</h1>
      ${this.user ? html`
        <p>Welcome, <strong>${this.user.firstname} ${this.user.lastname}</strong>.</p>
        <p>Library: <strong>${this.user.library === 'LAW' ? 'Mabie Law Library' : 'Shields Library'}</strong></p>
      ` : html`<p>Loading user information...</p>`}

      <div class="l-3col u-space-mt">
        <div class="l-first">
          <div class="category-brand--double-decker u-space-mb">
            <h2 class="heading--highlight">Invoices</h2>
            <ul class="list--arrow">
              <li><a href="/preview">Invoices Waiting to be Sent</a></li>
              <li><a href="/paid">Paid Invoices</a></li>
              <li><a href="/search">Search Invoices</a></li>
              <li><a href="/unpaid">Unpaid Invoices</a></li>
            </ul>
          </div>
        </div>
        <div class="l-second">
          <div class="category-brand--delta u-space-mb">
            <h2 class="heading--highlight">Reference Data</h2>
            <ul class="list--arrow">
              <li><a href="/funds">Funds</a></li>
              <li><a href="/vendors">Vendors</a></li>
            </ul>
          </div>
        </div>
        <div class="l-third">
          <div class="category-brand--redwood u-space-mb">
            <h2 class="heading--highlight">Administration</h2>
            <ul class="list--arrow">
              <li><a href="/admin">Admin Home</a></li>
              <li><a href="/admin/invoices">All Invoices</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}
