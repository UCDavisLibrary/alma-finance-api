import { html } from 'lit';
import logo from '@ucd-lib/theme-elements/ucdlib/ucdlib-branding-bar/logo.js';

function libraryLabel(library) {
  return library === 'LAW' ? 'Law' : 'Shields';
}

export function render() {
  const isAdmin = !!this.user?.isAdmin;
  const showLibrarySwitch = this.user?.availableLibraries?.length > 1;

  return html`
    <ucd-theme-header>
      <ucdlib-branding-bar slogan="Payment Processor">
      </ucdlib-branding-bar>
      <ucd-theme-primary-nav>
        <a href="/">Home</a>
        <a href="/preview">Send Invoices</a>
        <a href="/search">Search Invoices</a>
        <a href="/paid">Paid Invoices</a>
        <a href="/unpaid">Unpaid Invoices</a>
        <a href="/funds">Funds</a>
        <a href="/vendors">Vendors</a>
        ${isAdmin ? html`
          <ul link-text="Admin" href="/admin/invoices">
            <li><a href="/admin/invoices">All Invoices</a></li>
          </ul>
        ` : ''}
      </ucd-theme-primary-nav>
    </ucd-theme-header>

    ${showLibrarySwitch ? html`
      <section class="l-container" aria-label="Library context">
        <div style="display:flex;align-items:center;justify-content:flex-end;gap:.5rem;padding-top:.75rem">
          <span>Library</span>
          ${this.user.availableLibraries.map(library => html`
            <button class="btn ${this.user.library === library ? 'btn--primary' : 'btn--alt2'} btn--sm"
              ?disabled=${this.librarySwitching || this.user.library === library}
              @click=${() => this._setLibrary(library)}>
              ${libraryLabel(library)}
            </button>
          `)}
        </div>
      </section>
    ` : ''}

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
      <alma-finance-page-admin-invoices page-id="admin-invoices"></alma-finance-page-admin-invoices>
      <alma-finance-page-admin-invoice page-id="admin-invoice"></alma-finance-page-admin-invoice>
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
