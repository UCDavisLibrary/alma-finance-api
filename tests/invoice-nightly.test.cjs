const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');

function scanner({ records = [], oracleError = false, status = 'SENT' } = {}) {
  const calls = [];
  const deps = {
    './dbcalls': {
      getAllUnpaidInvoices: async () => [[{ invoiceid: '123', invoicenumber: 'INV-1', status }]],
      updateStatus: async next => { await Promise.resolve(); calls.push(next); },
      fetchAllUsers: async () => [],
    },
    './graphqlcalls': {
      checkStatusInOracle: async () => {
        if (oracleError) throw new Error('Oracle unavailable');
        return [{ data: { scmInvoicePaymentSearch: { data: records } } }];
      },
    },
    './formatdata': { changeToXML: async () => calls.push('XML') },
    './attention': { scanProcessingFailures: async () => calls.push('BOUNDARY') },
    '../util/database': {},
    '../util/logger': { logMessage() {} },
    '../util/nodemailer-transporter': { checkTransporter: () => ({ sendMail() {} }) },
    fs: {},
  };
  const module = { exports: {} };
  vm.runInNewContext(fs.readFileSync('file-loader/controllers/background-scripts.js', 'utf8'), {
    exports: module.exports, require: name => { assert.ok(name in deps, name); return deps[name]; },
    process: { env: {} }, console, Date,
  });
  return { run: module.exports.checkOracleStatus, calls };
}
test('nightly job finishes confirmed payment updates before Boundary failure scanning', async () => {
  const s = scanner({ records: [{ invoiceNumber: 'INV-1', paymentStatusCode: 'Y' }] });
  await s.run();
  assert.deepEqual(s.calls, ['XML', 'PAID', 'BOUNDARY']);
});
test('Oracle unpaid result does not clear Needs Attention', async () => {
  const s = scanner({ status: 'NEEDS_ATTENTION', records: [{ invoiceNumber: 'INV-1', paymentStatusCode: 'N' }] });
  await s.run();
  assert.deepEqual(s.calls, ['BOUNDARY']);
});
test('Oracle lookup failure still allows Boundary processing scan', async () => {
  const s = scanner({ oracleError: true });
  await s.run();
  assert.deepEqual(s.calls, ['BOUNDARY']);
});
test('substring Oracle matches do not mark a different invoice paid', async () => {
  const s = scanner({ records: [{ invoiceNumber: 'INV-10', paymentStatusCode: 'Y' }] });
  await s.run();
  assert.deepEqual(s.calls, ['BOUNDARY']);
});
