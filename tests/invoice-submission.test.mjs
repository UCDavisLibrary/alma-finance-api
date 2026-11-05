import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSubmitInvoice } from '../app/controllers/submission-flow.js';

function fixture({ existing = [], response, owner = 'LAW', lock = 1, formatted = true } = {}) {
  const calls = [];
  let sends = 0;
  const connection = {
    async execute(sql, args) {
      calls.push({ sql, args });
      if (sql.includes('GET_LOCK')) return [[{ acquired: lock }]];
      if (sql.startsWith('SELECT *')) return [existing];
      return [{ affectedRows: 1 }];
    },
    async beginTransaction() {}, async commit() {}, async rollback() {}, release() {},
  };
  return { calls, get sends() { return sends; }, send: createSubmitInvoice({
    db: { async getConnection() { return connection; } },
    setSelectedData: async () => ({ invoice: [{ id: '123', number: '804465A', owner: { value: owner }, vendor: { value: 'VENDOR' }, total_amount: 10 }] }),
    reformatAlmaInvoiceforAPI: async () => formatted ? [{ data: { header: {}, payload: { invoiceLines: [{}] } } }] : [],
    aggieEnterprisePaymentRequest: async () => { sends++; return [response || { data: { scmInvoicePaymentCreate: { requestStatus: { requestStatus: 'PENDING' } } } }]; },
    randomUUID: () => 'unique-attempt-id',
  }) };
}
test('resubmission updates the existing row and preserves a separate attempt', async () => {
  const f = fixture({ existing: [{ id: 7, library: 'LAW', status: 'NEEDS_ATTENTION' }] });
  const result = await f.send('123', 'LAW', true);
  assert.ok(result.request);
  assert.equal(f.sends, 1);
  assert.ok(f.calls.some(call => call.sql.startsWith('INSERT INTO invoice_submission_attempts')));
  assert.ok(f.calls.some(call => call.sql.includes("status = 'SENT'") && call.args[1] === '804465A-unique-attempt-id'));
  assert.ok(!f.calls.some(call => call.sql.startsWith('INSERT INTO invoices ')));
});
test('stale resubmit and duplicate initial submission never reach Boundary', async () => {
  for (const retry of [true, false]) {
    const f = fixture({ existing: [{ id: 7, library: 'LAW', status: 'SENT' }] });
    assert.ok((await f.send('123', 'LAW', retry)).error);
    assert.equal(f.sends, 0);
  }
});
test('cross-library invoice and concurrent sends are blocked', async () => {
  for (const options of [{ owner: 'SHLDS' }, { lock: 0 }, { existing: [{ library: 'SHLDS', status: 'NEEDS_ATTENTION' }] }]) {
    const f = fixture(options);
    assert.ok((await f.send('123', 'LAW')).error);
    assert.equal(f.sends, 0);
  }
});
test('missing vendor payload produces an invoice-specific failure without sending', async () => {
  const f = fixture({ formatted: false });
  const result = await f.send('123', 'LAW');
  assert.equal(result.invoice.id, '123');
  assert.ok(result.error);
  assert.equal(f.sends, 0);
});
test('Boundary validation rejection does not reset Needs Attention', async () => {
  const f = fixture({ existing: [{ id: 7, library: 'LAW', status: 'NEEDS_ATTENTION' }], response: { data: { scmInvoicePaymentCreate: { validationResults: { errorMessages: ['Invalid project'] } } } } });
  const result = await f.send('123', 'LAW', true);
  assert.match(result.error[0].message, /Invalid project/);
  assert.ok(!f.calls.some(call => call.sql.startsWith('UPDATE invoices')));
});
