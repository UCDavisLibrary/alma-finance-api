import { getPoLineData } from './almaapicalls.js';
import { fetchPoLineData, savePoLineData } from './dbcalls.js';

export function poLineValue(line) {
  if (typeof line?.po_line === 'string') return line.po_line.trim();
  const value = line?.po_line?.value || line?.po_line?.number || '';
  return String(value).trim();
}

function parseCachedPoLineData(data) {
  if (!data) return null;
  if (typeof data !== 'string') return data;

  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function cleanPoLineTitle(title) {
  if (typeof title !== 'string') return '';
  const trimmed = title.trim();
  return trimmed ? trimmed.slice(0, 240) : '';
}

async function getPoLineTitleById(poLineId, vendorId = '') {
  const cached = await fetchPoLineData(poLineId);
  const cachedTitle = cleanPoLineTitle(cached?.title);
  if (cachedTitle) return cachedTitle;

  const cachedData = parseCachedPoLineData(cached?.poLineData);
  const cachedDataTitle = cleanPoLineTitle(cachedData?.resource_metadata?.title);
  if (cachedDataTitle) return cachedDataTitle;

  const poLine = await getPoLineData(poLineId);
  if (!poLine || poLine.errorsExist) return '';

  const title = cleanPoLineTitle(poLine.resource_metadata?.title);

  const poLineVendorId = poLine.vendor?.value || vendorId;
  if (poLineVendorId) {
    await savePoLineData(
      poLine.number || poLineId,
      poLineVendorId,
      title,
      poLine
    );
  }

  return title;
}

export async function getPoLineTitle(line, vendorId = '', poLineCache = new Map()) {
  const poLineId = poLineValue(line);
  if (!poLineId) return '';
  const existingTitle = cleanPoLineTitle(line.po_line_title);
  if (existingTitle) return existingTitle;

  if (!poLineCache.has(poLineId)) {
    poLineCache.set(poLineId, getPoLineTitleById(poLineId, vendorId));
  }

  return poLineCache.get(poLineId);
}

export async function enrichInvoiceLineTitles(invoice, poLineCache = new Map()) {
  const invoiceVendorId = invoice.vendor?.value || '';
  const invoiceLines = await Promise.all(
    (invoice.invoice_lines?.invoice_line || []).map(async (line) => ({
      ...line,
      po_line_title: await getPoLineTitle(line, invoiceVendorId, poLineCache),
    }))
  );

  return {
    ...invoice,
    invoice_lines: {
      ...invoice.invoice_lines,
      invoice_line: invoiceLines,
    },
  };
}
