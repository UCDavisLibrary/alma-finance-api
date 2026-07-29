import config from './config.js';
import db from './db.js';
import {
  getFundData,
  getPoLine,
  getReadyInvoices,
  getVendorData,
} from './alma-client.js';
import {
  findFund,
  findPoLine,
  findVendor,
  saveFund,
  savePoLine,
  saveVendor,
} from './repositories.js';
import { flushLogs, log } from './log.js';

const cacheTtlMs = config.sync.cacheTtlHours * 60 * 60 * 1000;
let running = false;

function isFresh(row) {
  if (!row?.lastCheckedAt) return false;
  const checkedAt = new Date(row.lastCheckedAt).getTime();
  return Number.isFinite(checkedAt) && Date.now() - checkedAt < cacheTtlMs;
}

function poLineValue(line) {
  if (typeof line?.po_line === 'string') return line.po_line.trim();
  return line?.po_line?.value || line?.po_line?.number || '';
}

function parseJson(value, fallback = {}) {
  if (!value) return fallback;
  if (typeof value !== 'string') return value;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function collectReferences(invoices, library) {
  const vendors = new Set();
  const funds = new Map();
  const poLines = new Map();

  for (const invoice of invoices) {
    const vendorId = invoice.vendor?.value;
    if (vendorId) vendors.add(vendorId);

    for (const line of (invoice.invoice_lines?.invoice_line || [])) {
      const poLine = poLineValue(line);
      if (poLine) {
        poLines.set(poLine, { poLine, vendorId: vendorId || null });
      }

      for (const distribution of (line.fund_distribution || [])) {
        const fundId = distribution.fund_code?.value;
        if (fundId) funds.set(fundId, { fundId, library });
      }
    }
  }

  return { vendors, funds, poLines };
}

async function syncVendor(vendorId, stats) {
  const cached = await findVendor(vendorId);
  if (isFresh(cached)) {
    stats.vendorsSkipped += 1;
    return;
  }

  try {
    const vendorData = await getVendorData(vendorId);
    if (!vendorData || vendorData.errorsExist) throw new Error(`Unable to fetch vendor ${vendorId}`);

    await saveVendor(vendorId, vendorData, {
      vendorName: vendorData.name ?? null,
      financialSysCode: vendorData.financial_sys_code ?? null,
      additionalCode: vendorData.additional_code ?? null,
      status: vendorData.status?.value ?? vendorData.status ?? null,
    });
    stats.vendorsSynced += 1;
  } catch (error) {
    await saveVendor(vendorId, parseJson(cached?.vendorData), {
      syncStatus: 'ERROR',
      syncError: error.message,
    });
    throw error;
  }
}

async function syncFund(fundRef, stats) {
  const cached = await findFund(fundRef.fundId);
  if (isFresh(cached) && cached.fundCode) {
    stats.fundsSkipped += 1;
    return;
  }

  try {
    const fundData = await getFundData(fundRef.fundId, fundRef.library);
    const fund = fundData?.fund?.[0];
    const externalId = fund?.external_id;
    if (!externalId) throw new Error(`Unable to fetch external ID for fund ${fundRef.fundId}`);

    await saveFund(fundRef.fundId, externalId, fundData, {
      library: fundRef.library,
      fundName: fund.name || fund.description || null,
      status: fund.status?.value || fund.status || null,
    });
    stats.fundsSynced += 1;
  } catch (error) {
    await saveFund(fundRef.fundId, cached?.fundCode || fundRef.fundId, null, {
      library: fundRef.library,
      syncStatus: 'ERROR',
      syncError: error.message,
    });
    throw error;
  }
}

async function syncPoLine(poLineRef, stats) {
  const cached = await findPoLine(poLineRef.poLine);
  if (isFresh(cached)) {
    stats.poLinesSkipped += 1;
    return;
  }

  try {
    const poLine = await getPoLine(poLineRef.poLine);
    const vendorId = poLine.vendor?.value || poLineRef.vendorId;
    if (!vendorId) throw new Error(`PO line ${poLineRef.poLine} did not include a vendor`);

    await savePoLine(
      poLine.number || poLineRef.poLine,
      vendorId,
      poLine.resource_metadata?.title || '',
      poLine
    );
    stats.poLinesSynced += 1;
  } catch (error) {
    const vendorId = cached?.vendorId || poLineRef.vendorId || '';
    await savePoLine(poLineRef.poLine, vendorId, '', null, {
      syncStatus: 'NOT_FOUND',
      syncError: error.message,
    });
    stats.poLinesNotFound += 1;
    throw error;
  }
}

async function runCycle() {
  if (running) {
    log('WARN', 'Previous sync cycle still running; skipping tick');
    return;
  }

  running = true;
  const stats = {
    libraries: config.sync.libraries.length,
    invoicesFound: 0,
    vendorsSynced: 0,
    vendorsSkipped: 0,
    fundsSynced: 0,
    fundsSkipped: 0,
    poLinesSynced: 0,
    poLinesSkipped: 0,
    poLinesNotFound: 0,
    errors: 0,
  };

  try {
    log('INFO', 'Sync cycle started', { libraries: config.sync.libraries });

    for (const library of config.sync.libraries) {
      const invoices = await getReadyInvoices(library);
      stats.invoicesFound += invoices.length;

      const refs = collectReferences(invoices, library);

      for (const vendorId of refs.vendors) {
        try {
          await syncVendor(vendorId, stats);
        } catch (error) {
          stats.errors += 1;
          log('ERROR', 'Vendor sync failed', { vendorId, error: error.message });
        }
      }

      for (const fundRef of refs.funds.values()) {
        try {
          await syncFund(fundRef, stats);
        } catch (error) {
          stats.errors += 1;
          log('ERROR', 'Fund sync failed', { fundId: fundRef.fundId, error: error.message });
        }
      }

      for (const poLineRef of refs.poLines.values()) {
        try {
          await syncPoLine(poLineRef, stats);
        } catch (error) {
          stats.errors += 1;
          log('ERROR', 'PO-line sync failed', { poLine: poLineRef.poLine, error: error.message });
        }
      }
    }

    log('INFO', 'Sync cycle completed', stats);
  } catch (error) {
    stats.errors += 1;
    log('ERROR', 'Sync cycle failed', { error: error.message, stats });
  } finally {
    running = false;
  }
}

async function shutdown() {
  log('INFO', 'Shutting down');
  await flushLogs();
  await db.end();
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

await runCycle();

if (config.sync.once) {
  await flushLogs();
  await db.end();
  process.exit(0);
}

setInterval(runCycle, config.sync.intervalMs);
