import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createReferenceResolver, validFund, validVendor } from '../app/controllers/reference-data.js';

const vendor = { financial_sys_code: '14631', additional_code: 'PUR-12' };
const fund = 'CPLIBUNV27|8700201|526513|MAINBK';
function fixture(overrides = {}) {
  const calls = { vendor: 0, fund: 0, saveVendor: [], saveFund: [] };
  const resolver = createReferenceResolver({
    fetchVendorDataFromId: async () => JSON.stringify(vendor),
    getVendorData: async () => { calls.vendor++; return vendor; },
    saveVendor: async (...args) => { calls.saveVendor.push(args); return true; },
    fetchFundCodeFromId: async () => fund,
    getFundData: async () => { calls.fund++; return { fund: [{ external_id: fund }] }; },
    saveFund: async (...args) => { calls.saveFund.push(args); return true; },
    ...overrides,
  });
  return { resolver, calls };
}
test('valid cached vendor and fund need no Alma calls', async () => {
  const { resolver, calls } = fixture();
  assert.deepEqual(await resolver.vendor('SAGE/CQ PRESS'), vendor);
  assert.equal(await resolver.fund('H/SS', 'SHLDS'), fund);
  assert.equal(calls.vendor, 0);
  assert.equal(calls.fund, 0);
});
test('empty, malformed and incomplete vendor caches are repaired and saved', async () => {
  for (const cached of [undefined, null, '{}', 'not-json', '{"financial_sys_code":"14631"}', { financial_sys_code: ' ', additional_code: 'PUR-12' }]) {
    const { resolver, calls } = fixture({ fetchVendorDataFromId: async () => cached });
    await Promise.all([resolver.vendor('SAGE/CQ PRESS'), resolver.vendor('SAGE/CQ PRESS')]);
    assert.equal(calls.vendor, 1);
    assert.deepEqual(calls.saveVendor, [['SAGE/CQ PRESS', vendor]]);
  }
});
test('invalid accounting caches are repaired once per unique reference', async () => {
  for (const cached of [null, '', 'H/SS', 'ERROR: unable to retrieve fund data', 'project|org||task', 'entity.fund.department.account']) {
    const { resolver, calls } = fixture({ fetchFundCodeFromId: async () => cached });
    assert.deepEqual(await Promise.all([resolver.fund('H/SS', 'SHLDS'), resolver.fund('H/SS', 'SHLDS')]), [fund, fund]);
    assert.equal(calls.fund, 1);
    assert.deepEqual(calls.saveFund, [['H/SS', fund]]);
  }
});
test('invalid fresh vendor and fund stop rather than saving bad data', async () => {
  const { resolver, calls } = fixture({ fetchVendorDataFromId: async () => '{}', getVendorData: async () => ({}), fetchFundCodeFromId: async () => '', getFundData: async () => ({ fund: [{ external_id: 'project|org||task' }] }) });
  await assert.rejects(resolver.vendor('VENDOR'), /Vendor VENDOR.*supplier/);
  await assert.rejects(resolver.fund('FUND', 'LAW'), /Fund FUND.*accounting/);
  assert.equal(calls.saveVendor.length, 0);
  assert.equal(calls.saveFund.length, 0);
});
test('failed repair persistence stops submission', async () => {
  const { resolver } = fixture({ fetchVendorDataFromId: async () => '{}', saveVendor: async () => false, fetchFundCodeFromId: async () => '', saveFund: async () => false });
  await assert.rejects(resolver.vendor('VENDOR'), /unable to save repaired vendor/);
  await assert.rejects(resolver.fund('FUND', 'LAW'), /unable to save repaired fund/);
});
test('fresh resubmission refreshes and persists even otherwise valid cached data', async () => {
  const { resolver, calls } = fixture();
  await resolver.vendor('VENDOR', true);
  await resolver.fund('FUND', 'LAW', true);
  assert.equal(calls.vendor, 1);
  assert.equal(calls.fund, 1);
  assert.equal(calls.saveVendor.length, 1);
  assert.equal(calls.saveFund.length, 1);
});
test('normalizes required fields and supports both accounting formats', () => {
  assert.deepEqual(validVendor({ financial_sys_code: ' 14631 ', additional_code: ' PUR-12 ' }), vendor);
  assert.equal(validFund(' entity . fund . department . account . purpose '), 'entity.fund.department.account.purpose');
  assert.equal(validFund('project.with.dots|org|expenditure|task'), 'project.with.dots|org|expenditure|task');
  assert.equal(validVendor({ financial_sys_code: 'a'.repeat(31), additional_code: 'SITE' }), null);
  assert.equal(validVendor({ ...vendor, errorsExist: true }), null);
});
