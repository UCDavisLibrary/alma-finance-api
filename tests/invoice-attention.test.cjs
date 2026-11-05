const { test } = require('node:test');
const assert = require('node:assert/strict');
const { processingFailure } = require('../file-loader/controllers/processing-status');
const { scanProcessingFailures } = require('../file-loader/controllers/attention');

function fixture({ status, lookupError = false, mailError = false, priorStatus = 'SENT', notified = null } = {}) {
  const invoice = { id: 1, invoiceid: '123', invoicenumber: '804465A', library: 'LAW', consumerTrackingId: '804465A-25', status: priorStatus, failureNotifiedAt: notified };
  const calls = [];
  const db = { execute: async (sql, args = []) => {
    calls.push({ sql, args });
    if (sql.startsWith('SELECT *') && sql.includes("status <> 'PAID'")) return [[invoice]];
    if (sql.startsWith('SELECT *')) return [[...(invoice.status === 'NEEDS_ATTENTION' && !invoice.failureNotifiedAt ? [invoice] : [])]];
    if (sql.startsWith('SELECT DISTINCT')) return [[{ email: 'staff@example.edu' }]];
    if (sql.includes("SET status = 'NEEDS_ATTENTION'")) { invoice.status = 'NEEDS_ATTENTION'; invoice.failureSummary = args[1]; }
    if (sql.includes('SET failureNotifiedAt')) invoice.failureNotifiedAt = 'notified';
    return [{ affectedRows: 1 }];
  } };
  const mail = [];
  return { invoice, calls, mail, deps: {
    db, logMessage() {},
    checkPayments: async () => {
      if (lookupError) throw new Error('Network down');
      return [{ data: { scmInvoicePaymentRequestStatusByConsumerTracking: status } }];
    },
    transporter: { sendMail: async message => { mail.push(message); if (mailError) throw new Error('SMTP failed'); return { rejected: [] }; } },
  } };
}
const failed = { requestStatus: { requestStatus: 'ERROR', errorMessages: ['See requestJobStatus for error details'] }, processingResult: { status: 'ERROR', jobs: [{ jobId: 'ap_invoices', jobStatus: 'ERROR', failedRecords: 'ORA_PJC VALIDATION FAILURE' }] } };
process.env.APP_URL = 'https://finance.example.edu';

test('extracts the reported late Oracle import failure', () => {
  assert.match(processingFailure(failed), /ORA_PJC VALIDATION FAILURE/);
});
test('detects job errors even if parent status has not updated', () => {
  assert.match(processingFailure({ processingResult: { jobs: [{ jobId: 'ap', jobStatus: 'ERROR' }] } }), /ap/);
});
test('pending, success and missing status are not processing failures', () => {
  for (const status of [null, {}, { requestStatus: { requestStatus: 'PENDING' } }, { processingResult: { status: 'SUCCESS' } }]) assert.equal(processingFailure(status), null);
});
test('moves a late failure and emails once; subsequent scans do not repeat the email', async () => {
  const f = fixture({ status: failed });
  await scanProcessingFailures(f.deps);
  await scanProcessingFailures(f.deps);
  assert.equal(f.invoice.status, 'NEEDS_ATTENTION');
  assert.equal(f.mail.length, 1);
  assert.deepEqual(f.mail[0].to, ['staff@example.edu']);
  assert.match(f.mail[0].text, /https:\/\/finance.example.edu\/invoice\/123/);
  assert.match(f.mail[0].text, /ORA_PJC/);
});
test('network failure does not reclassify an invoice', async () => {
  const f = fixture({ lookupError: true });
  await scanProcessingFailures(f.deps);
  assert.equal(f.invoice.status, 'SENT');
  assert.equal(f.mail.length, 0);
});
test('SMTP failures leave notification pending for retry', async () => {
  const f = fixture({ status: failed, mailError: true });
  await scanProcessingFailures(f.deps);
  assert.equal(f.invoice.status, 'NEEDS_ATTENTION');
  assert.equal(f.invoice.failureNotifiedAt, null);
});
test('pending notification retries even if Boundary is unavailable today', async () => {
  const f = fixture({ lookupError: true, priorStatus: 'NEEDS_ATTENTION' });
  await scanProcessingFailures(f.deps);
  assert.equal(f.mail.length, 1);
  assert.ok(f.invoice.failureNotifiedAt);
});
