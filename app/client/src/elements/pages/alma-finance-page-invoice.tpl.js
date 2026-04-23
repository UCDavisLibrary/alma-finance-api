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

export function render() {
  if (this.loading) return html`<div class="l-container u-space-my"><p>Loading invoice...</p></div>`;
  if (this.error && !this.almaInvoice && !this.dbInvoice) {
    return html`<div class="l-container u-space-my"><p class="color-secondary">${this.error}</p><a href="/preview">← Back</a></div>`;
  }

  const alma = this.almaInvoice;
  const db = this.dbInvoice;
  const vendor = this.vendor;

  const invoiceNumber = alma?.number || db?.invoicenumber || db?.number || this.invoiceId;

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
                  <td>${line.quantity || '—'}</td>
                  <td>${formatCurrency(line.price)}</td>
                  <td>${line.fund_distribution?.map(d => d.fund_code?.value).filter(Boolean).join(', ') || '—'}</td>
                </tr>
              `)}
            </tbody>
          </table>
        </div>
      ` : ''}

      <!-- Aggie Enterprise + Oracle Status -->
      ${db ? html`
        <div class="l-2col u-space-mt">
          <div class="l-first">
            <h2>Aggie Enterprise Payment Status</h2>
            <dl>
              <dt>Submitted</dt><dd>${formatDate(db.datetime)}</dd>
              <dt>Consumer Tracking ID</dt><dd>${db.consumertrackingid || '—'}</dd>
              <dt>DB Status</dt><dd>${db.status || '—'}</dd>
            </dl>
            ${this.paymentStatus ? html`
              <dl class="u-space-mt">
                <dt>Request Status</dt><dd>${this.paymentStatus.scmInvoicePaymentRequestStatusByConsumerTracking?.requestStatus?.requestStatus || '—'}</dd>
                <dt>Request ID</dt><dd>${this.paymentStatus.scmInvoicePaymentRequestStatusByConsumerTracking?.requestStatus?.requestId || '—'}</dd>
                <dt>Last Status</dt><dd>${formatDate(this.paymentStatus.scmInvoicePaymentRequestStatusByConsumerTracking?.requestStatus?.lastStatusDateTime)}</dd>
                <dt>Processed</dt><dd>${formatDate(this.paymentStatus.scmInvoicePaymentRequestStatusByConsumerTracking?.requestStatus?.processedDateTime)}</dd>
                <dt>Job Status</dt><dd>${this.paymentStatus.scmInvoicePaymentRequestStatusByConsumerTracking?.processingResult?.jobs?.[0]?.jobStatus || '—'}</dd>
                <dt>Error Messages</dt><dd>${this.paymentStatus.scmInvoicePaymentRequestStatusByConsumerTracking?.requestStatus?.errorMessages?.join(', ') || 'None'}</dd>
              </dl>
            ` : html`<p class="u-space-mt">No payment status data available.</p>`}
          </div>
          <div class="l-second">
            <h2>Oracle Payment Record</h2>
            ${this.oracleStatus?.data?.length ? html`
              <dl>
                <dt>Invoice Number</dt><dd>${this.oracleStatus.data[0].invoiceNumber || '—'}</dd>
                <dt>Payment Status</dt><dd>${this.oracleStatus.data[0].paymentStatusCode || '—'}</dd>
                <dt>Check Status</dt><dd>${this.oracleStatus.data[0].checkStatusCode || '—'}</dd>
                <dt>Check Number</dt><dd>${this.oracleStatus.data[0].checkNumber || '—'}</dd>
                <dt>Payment Amount</dt><dd>${formatCurrency(this.oracleStatus.data[0].paymentAmount)}</dd>
                <dt>Payment Date</dt><dd>${formatDate(this.oracleStatus.data[0].paymentDate)}</dd>
                <dt>Invoice Date</dt><dd>${formatDate(this.oracleStatus.data[0].invoiceDate)}</dd>
                <dt>Supplier</dt><dd>${this.oracleStatus.data[0].supplierName || '—'}</dd>
                <dt>Payment Method</dt><dd>${this.oracleStatus.data[0].paymentMethodCode || '—'}</dd>
                <dt>Batch</dt><dd>${this.oracleStatus.data[0].batchName || '—'}</dd>
              </dl>
            ` : html`<p>No Oracle payment record found.</p>`}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}
