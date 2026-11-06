import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paymentInvoiceLines } from '../app/controllers/invoice-lines.js';
const invoice = lines => ({ number: '1226104', invoice_lines: { invoice_line: lines } });
const funded = { number: '1', price: 5250, total_price: 5250, fund_distribution: [{ fund_code: { value: 'onl' }, amount: 5250 }] };
test('omits zero-dollar unfunded Alma adjustment and preserves the payable line', () => {
  assert.deepEqual(paymentInvoiceLines(invoice([funded, { number: '999995', price: 0, total_price: 0, fund_distribution: [] }])), [funded]);
});
test('accepts zero strings and retains funded zero lines', () => {
  const fundedZero = { ...funded, price: 0, total_price: 0 };
  assert.deepEqual(paymentInvoiceLines(invoice([fundedZero, { price: '0.00', total_price: '0', fund_distribution: [] }])), [fundedZero]);
});
test('unfunded nonzero charges and credits still fail', () => {
  for (const price of [25, -25]) assert.throws(() => paymentInvoiceLines(invoice([{ number: '999995', price }])), /Invoice 1226104, line 999995: missing fund distribution/);
});
test('unknown or conflicting amounts cannot bypass validation', () => {
  for (const line of [{}, { price: null }, { price: '' }, { price: false }, { price: 'bad' }, { price: 0, total_price: 10 }, { price: 10, total_price: 0 }]) assert.throws(() => paymentInvoiceLines(invoice([line])), /missing fund distribution/);
});
