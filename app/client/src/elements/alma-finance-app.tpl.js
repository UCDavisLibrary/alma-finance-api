import { html } from 'lit';
import logo from '@ucd-lib/theme-elements/ucdlib/ucdlib-branding-bar/logo.js';

export function render() {
  return html`
    <ucd-theme-header>
      <ucdlib-branding-bar slogan="Payment Processor">
      </ucdlib-branding-bar>
      <ucd-theme-primary-nav>
        <a href="/">Home</a>
        <ul link-text="Invoices" href="/preview">
          <li><a href="/preview">Pending Invoices</a></li>
          <li><a href="/paid">Paid Invoices</a></li>
          <li><a href="/search">Search</a></li>
          <li><a href="/unpaid">Unpaid Invoices</a></li>
        </ul>
        <a href="/funds">Funds</a>
        <a href="/vendors">Vendors</a>
        <ul link-text="Admin" href="/admin">
          <li><a href="/admin">Admin Home</a></li>
          <li><a href="/admin/invoices">All Invoices</a></li>
          <li><a href="/admin/users">Users</a></li>
        </ul>
      </ucd-theme-primary-nav>
    </ucd-theme-header>

    <section ?hidden=${!this.showPageTitle}>
      <div class="l-container">
        <h1 class="page-title">${this.pageTitle}</h1>
      </div>
    </section>

    <ucdlib-pages id="main-pages" selected=${this.page} attr-for-selected="page-id">
      <div page-id="loading" class="l-container u-space-my">
        ${this.status === 'error'
          ? html`<p class="color-secondary">Error: ${this.errorMessage || 'Something went wrong.'}</p>`
          : html`<p>Loading...</p>`}
      </div>

      <alma-finance-page-home page-id="home"></alma-finance-page-home>
      <alma-finance-page-preview page-id="preview"></alma-finance-page-preview>
      <alma-finance-page-invoice page-id="invoice"></alma-finance-page-invoice>
      <alma-finance-page-paid page-id="paid"></alma-finance-page-paid>
      <alma-finance-page-search page-id="search"></alma-finance-page-search>
      <alma-finance-page-oracle-status page-id="unpaid"></alma-finance-page-oracle-status>
      <alma-finance-page-admin page-id="admin"></alma-finance-page-admin>
      <alma-finance-page-admin-invoices page-id="admin-invoices"></alma-finance-page-admin-invoices>
      <alma-finance-page-admin-invoice page-id="admin-invoice"></alma-finance-page-admin-invoice>
      <alma-finance-page-admin-users page-id="admin-users"></alma-finance-page-admin-users>
      <alma-finance-page-admin-user-new page-id="admin-user-new"></alma-finance-page-admin-user-new>
      <alma-finance-page-admin-user page-id="admin-user"></alma-finance-page-admin-user>
      <alma-finance-page-funds page-id="funds"></alma-finance-page-funds>
      <alma-finance-page-vendors page-id="vendors"></alma-finance-page-vendors>
    </ucdlib-pages>

    <footer class="site-footer">
      <div class="l-container">
        <div class="site-footer__inner">
          <div class="site-footer__figure">
            <a href="https://library.ucdavis.edu" aria-label="UC Davis Library">
              ${logo}
            </a>
          </div>
          <div class="site-footer__copy">
            <p>&copy; ${new Date().getFullYear()} The Regents of the University of California, Davis campus</p>
          </div>
        </div>
      </div>
    </footer>
  `;
}
