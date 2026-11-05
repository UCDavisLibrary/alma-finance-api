import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createLoginAttentionHandler } from '../app/controllers/login-attention.js';
import { createAttentionScanner } from '../app/controllers/scan-attention.js';
import { processingFailure } from '../app/controllers/processing-status.js';
import nightlyClassifier from '../file-loader/controllers/processing-status.js';

function response(library = 'LAW') {
  return { locals: { userdata: { library } }, statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; } };
}
const logMessage = () => {};

test('first login checks the active library and requests a popup after classification', async () => {
  const events = [];
  const handler = createLoginAttentionHandler({
    scan: async library => events.push(`scan:${library}`),
    count: async library => { events.push(`count:${library}`); return 2; }, logMessage,
  });
  const req = { session: {}, sessionID: 'login-1' };
  const res = response();
  await handler(req, res);
  assert.deepEqual(events, ['scan:LAW', 'count:LAW']);
  assert.deepEqual(res.body, { count: 2, showNotice: true });
  const reload = response();
  await handler(req, reload);
  assert.equal(events.filter(event => event.startsWith('scan')).length, 1);
  assert.equal(reload.body.showNotice, false);
});
test('a new login checks again, and switching libraries gets its own check', async () => {
  const scanned = [];
  const handler = createLoginAttentionHandler({ scan: async library => scanned.push(library), count: async () => 1, logMessage });
  const req = { session: {}, sessionID: 'login-1' };
  await handler(req, response('LAW'));
  await handler(req, response('SHLDS'));
  await handler({ session: {}, sessionID: 'login-2' }, response('LAW'));
  assert.deepEqual(scanned, ['LAW', 'SHLDS', 'LAW']);
});
test('no failures means no popup', async () => {
  const handler = createLoginAttentionHandler({ scan: async () => {}, count: async () => 0, logMessage });
  const res = response();
  await handler({ session: {}, sessionID: 'login' }, res);
  assert.equal(res.body.showNotice, false);
});
test('Boundary unavailable still shows existing failures and allows a later retry', async () => {
  const handler = createLoginAttentionHandler({ scan: async () => { throw new Error('Boundary down'); }, count: async () => 1, logMessage });
  const req = { session: {}, sessionID: 'login' };
  const res = response();
  await handler(req, res);
  assert.equal(res.body.showNotice, true);
  assert.equal(res.body.checkFailed, true);
  assert.equal(req.session.attentionCheckedLibraries, undefined);
});
test('missing library or session is rejected without calling Boundary', async () => {
  let scans = 0;
  const handler = createLoginAttentionHandler({ scan: async () => scans++, count: async () => 1, logMessage });
  const noLibrary = response(null);
  await handler({ session: {}, sessionID: 'login' }, noLibrary);
  assert.equal(noLibrary.statusCode, 403);
  const noSession = response();
  await handler({}, noSession);
  assert.equal(noSession.statusCode, 401);
  assert.equal(scans, 0);
});
test('concurrent requests in one session share a scan and only one requests a popup', async () => {
  let resolve;
  const pending = new Promise(done => { resolve = done; });
  let scans = 0;
  const handler = createLoginAttentionHandler({ scan: async () => { scans++; await pending; }, count: async () => 1, logMessage });
  const req = { session: {}, sessionID: 'login' };
  const first = response(), second = response();
  const a = handler(req, first), b = handler(req, second);
  resolve();
  await Promise.all([a, b]);
  assert.equal(scans, 1);
  assert.equal([first.body, second.body].filter(body => body.showNotice).length, 1);
});
test('login and nightly classifiers agree on errors and pending responses', () => {
  const statuses = [null, {}, { requestStatus: { requestStatus: 'ERROR' } }, { processingResult: { status: 'ERROR' } }, { requestStatus: { requestStatus: 'PENDING' } }, { processingResult: { jobs: [{ jobId: 'ap_invoices', jobStatus: 'ERROR', failedRecords: 'ORA_PJC VALIDATION FAILURE' }] } }];
  for (const status of statuses) assert.equal(processingFailure(status), nightlyClassifier.processingFailure(status));
});
test('scan scopes queries to the active library and associates failures by tracking ID', async () => {
  const calls = [];
  const scanner = createAttentionScanner({
    db: { execute: async (sql, args) => {
      calls.push({ sql, args });
      if (sql.startsWith('SELECT')) return [[{ id: 1, consumerTrackingId: 'first' }, { id: 2, consumerTrackingId: 'second' }]];
      return [{ affectedRows: 1 }];
    } },
    checkPayments: async () => [
      { consumerTrackingId: 'second', data: { scmInvoicePaymentRequestStatusByConsumerTracking: { processingResult: { status: 'ERROR' } } } },
      { consumerTrackingId: 'first', errors: [{ message: 'HTTP 503' }] },
    ], logMessage,
  });
  await scanner('LAW');
  assert.deepEqual(calls[0].args, ['LAW']);
  const updates = calls.filter(call => call.sql.startsWith('UPDATE invoices'));
  assert.equal(updates.length, 1);
  assert.deepEqual(updates[0].args.slice(2), [2, 'second', 'LAW']);
  assert.match(updates[0].sql, /status <> 'PAID'/);
});
