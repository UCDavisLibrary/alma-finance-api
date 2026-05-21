import { html } from 'lit';

function formatDate(raw) {
  if (!raw) return '—';
  const d = new Date(raw);
  return isNaN(d) ? raw : d.toLocaleDateString();
}

function formatCurrency(val) {
  if (val == null) return '—';
  return `$${Number(val).toFixed(2)}`;
}

function formatQuantity(val) {
  return val && Number(val) > 0 ? val : 1;
}

function formatRawData(data) {
  if (data == null) return "can't find data";
  if (Array.isArray(data) && !data.length) return "can't find data";
  if (typeof data === 'object' && !Object.keys(data).length) return "can't find data";
  return JSON.stringify(data, null, 2);
}

export function render() {
  if (this.loading) return html`<div class="l-container u-space-my"><p>Loading invoice...</p></div>`;
  if (this.error && !this.almaInvoice && !this.dbInvoice) {
    return html`<div class="l-container u-space-my"><p class="color-secondary">${this.error}</p><a href="/preview">← Back</a></div>`;
  }

  const alma = this.almaInvoice;
  const db = this.dbInvoice;
  const vendor = this.vendor;

  const invoiceNumber = alma?.number || db?.invoicenumber || db?.number || this.invoiceId;

  console.log('Aggie Enterprise payment status:', this.paymentStatus);
  console.log('Oracle payment record:', this.oracleStatus);

  return html`
    <div class="l-container u-space-my">
      <a href="/preview" style="display:inline-block;" class="u-space-mb">← Back to Pending Invoices</a>
      <h1 class="heading--highlight">Invoice ${invoiceNumber}</h1>

      <!-- Invoice + Vendor Details -->
      <div class="l-2col u-space-mt">
        <div class="l-first">
          <h2>Invoice Details</h2>
          <dl>
            <dt>Invoice Number</dt><dd>${alma?.number || db?.invoicenumber || '—'}</dd>
            <dt>Invoice ID</dt><dd>${alma?.id || db?.invoiceid || '—'}</dd>
            <dt>Invoice Date</dt><dd>${formatDate(alma?.invoice_date)}</dd>
            <dt>Library</dt><dd>${alma?.owner?.value || db?.library || '—'}</dd>
            <dt>Currency</dt><dd>${alma?.invoice_amount?.currency || '—'}</dd>
            <dt>Total Amount</dt><dd>${formatCurrency(alma?.total_amount ?? alma?.invoice_amount?.sum)}</dd>
            <dt>Payment Method</dt><dd>${alma?.payment_method?.value || '—'}</dd>
            <dt>Status</dt><dd>${alma?.invoice_workflow_status?.value || db?.status || '—'}</dd>
          </dl>
        </div>
        <div class="l-second">
          <h2>Vendor Details</h2>
          <dl>
            <dt>Vendor Code</dt><dd>${alma?.vendor?.value || '—'}</dd>
            <dt>Vendor Name</dt><dd>${alma?.vendor?.desc || vendor?.name || '—'}</dd>
            ${vendor ? html`
              <dt>Financial System Code</dt><dd>${vendor.financial_sys_code || '—'}</dd>
              <dt>Additional Code</dt><dd>${vendor.additional_code || '—'}</dd>
              <dt>Status</dt><dd>${vendor.status?.value || '—'}</dd>
            ` : ''}
          </dl>
        </div>
      </div>

      <!-- Invoice Lines -->
      ${alma?.invoice_lines?.invoice_line?.length ? html`
        <div class="u-space-mt">
          <h2>Invoice Lines</h2>
          <table class="table--striped">
            <thead>
              <tr>
                <th>Line #</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Fund Code</th>
              </tr>
            </thead>
            <tbody>
              ${alma.invoice_lines.invoice_line.map(line => html`
                <tr>
                  <td>${line.number || '—'}</td>
                  <td>${line.description || line.id || '—'}</td>
                  <td>${formatQuantity(line.quantity)}</td>
                  <td>${formatCurrency(line.price)}</td>
                  <td>${line.fund_distribution?.map(d => d.fund_code?.value).filter(Boolean).join(', ') || '—'}</td>
                </tr>
              `)}
            </tbody>
          </table>
        </div>
      ` : ''}

      <!-- Aggie Enterprise + Oracle Status -->
      <div class="l-2col u-space-mt">
        <div class="l-first">
          <h2>Aggie Enterprise Payment Status</h2>
          <pre>${formatRawData(this.paymentStatus)}</pre>
        </div>
        <div class="l-second">
          <h2>Oracle Payment Record</h2>
          <pre>${formatRawData(this.oracleStatus)}</pre>
        </div>
      </div>
    </div>
  `;
}
