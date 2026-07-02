import { html } from 'lit';

export function render() {
  const isAdmin = !!this.user?.isAdmin;

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
            <h2 class="heading--highlight">Actions</h2>
            <ul class="list--arrow">
              <li><a href="/preview">Send Invoices</a></li>
              <li><a href="/search">Search Invoices</a></li>
              <li><a href="/paid">View Paid Invoices</a></li>
              <li><a href="/unpaid">View Unpaid Invoices</a></li>
            </ul>
          </div>
        </div>
        ${isAdmin ? html`
          <div class="l-second">
            <div class="category-brand--redwood u-space-mb">
              <h2 class="heading--highlight">Administration</h2>
              <ul class="list--arrow">
                <li><a href="/admin/invoices">All Invoices</a></li>
                <li><a href="/funds">Funds</a></li>
                <li><a href="/vendors">Vendors</a></li>
              </ul>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}
