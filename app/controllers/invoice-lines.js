function explicitlyZero(value) {
  return (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '')) &&
    Number.isFinite(Number(value)) && Number(value) === 0;
}

export function paymentInvoiceLines(invoice) {
  return (invoice.invoice_lines?.invoice_line || []).filter(line => {
    if (line.fund_distribution?.length) return true;
    // Alma includes informational adjustment lines with no financial effect.
    // Missing amounts and conflicting nonzero totals must still fail validation.
    if (explicitlyZero(line.price) &&
        (line.total_price == null || explicitlyZero(line.total_price))) return false;
    throw new Error(`Invoice ${invoice.number}, line ${line.number}: missing fund distribution.`);
  });
}
