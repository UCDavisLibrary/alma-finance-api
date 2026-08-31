import { html } from 'lit';

export function formatDate(raw) {
  if (!raw) return '—';

  const dateOnly = String(raw).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dateOnly) {
    const [, year, month, day] = dateOnly;
    return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString();
  }

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? raw : date.toLocaleDateString();
}

export function formatCurrency(val, currency = '') {
  if (val == null || val === '') return '—';

  const number = Number(val);
  const formatted = Number.isFinite(number) ? `$${number.toFixed(2)}` : val;
  return currency ? `${formatted} ${currency}` : formatted;
}

export function formatQuantity(val) {
  return val && Number(val) > 0 ? val : 1;
}

export function fundEntries(invoices) {
  const totals = {};
  for (const invoice of invoices) {
    const lines = invoice.invoice_lines?.invoice_line;
    if (!lines?.length) continue;
    for (const line of lines) {
      for (const dist of (line.fund_distribution || [])) {
        const externalId = dist.fund_external_id?.value;
        if (!externalId) continue;
        const amount = dist.amount?.sum ?? dist.amount ?? (line.price * (dist.percent ?? 100) / 100);
        totals[externalId] = (totals[externalId] || 0) + Number(amount);
      }
    }
  }
  return Object.entries(totals);
}

export function renderFundEntries(entries, isStrong = false) {
  if (!entries.length) return '—';
  return entries.map(([code, amt]) => html`
    <div>
      ${isStrong ? html`<strong>${code}: ${formatCurrency(amt)}</strong>` : html`${code}: ${formatCurrency(amt)}`}
    </div>
  `);
}

export function fundSummary(invoice) {
  return renderFundEntries(fundEntries([invoice]));
}

export function formatPoLine(line) {
  if (typeof line?.po_line === 'string') return line.po_line;
  return line?.po_line?.value || line?.po_line?.number || '';
}

export function formatRawData(data) {
  if (data == null) return "can't find data";
  if (Array.isArray(data) && !data.length) return "can't find data";
  if (typeof data === 'object' && !Object.keys(data).length) return "can't find data";
  return JSON.stringify(data, null, 2);
}

export function sentInvoiceLines(invoice) {
  return (invoice?.invoice_lines?.invoice_line || [])
    .filter(line => line.fund_distribution?.length);
}

export function oracleSearch(invoice) {
  return invoice.data?.scmInvoicePaymentSearch;
}

export function oraclePayment(invoice) {
  return oracleSearch(invoice)?.data?.[0];
}

export function vendorName(invoice) {
  return invoice.vendor?.desc || oraclePayment(invoice)?.supplierName || '—';
}

export function invoiceAmount(invoice) {
  return formatCurrency(
    invoice.total_amount ?? invoice.invoice_amount?.sum ?? oraclePayment(invoice)?.paymentAmount,
    invoice.invoice_amount?.currency
  );
}

export function oracleStatus(invoice) {
  const search = oracleSearch(invoice);
  if (!search) return invoice.status || '—';
  if (search.metadata?.returnedResultCount === 0 || !search.data?.length) return 'Not found';

  const paymentStatusCode = search.data[0].paymentStatusCode;
  if (paymentStatusCode === 'Y') return 'Payment scheduled';
  if (paymentStatusCode === 'N') return 'Not yet paid';
  return paymentStatusCode || 'Unknown';
}

export function invoiceId(invoice) {
  return invoice.id || invoice.invoiceid;
}

export function vendorData(vendor) {
  if (!vendor?.vendorData) return {};
  if (typeof vendor.vendorData === 'object') return vendor.vendorData;
  try {
    return JSON.parse(vendor.vendorData);
  } catch (e) {
    return {};
  }
}
