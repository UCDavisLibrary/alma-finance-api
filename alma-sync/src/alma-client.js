import config from './config.js';
import { log } from './log.js';

async function fetchJson(path, label) {
  const response = await fetch(`${config.alma.baseUrl}${path}`);
  const remaining = response.headers.get('X-Exl-Api-Remaining');

  if (remaining) {
    log('INFO', 'Alma API quota remaining', { label, remaining });
  }

  if (!response.ok) {
    throw new Error(`Alma request failed for ${label}: HTTP ${response.status}`);
  }

  return response.json();
}

export async function getReadyInvoices(owner) {
  const invoices = [];

  for (let page = 0; page < config.alma.readyInvoiceMaxPages; page += 1) {
    const offset = page * config.alma.readyInvoiceLimit;
    const params = new URLSearchParams({
      q: 'all',
      limit: String(config.alma.readyInvoiceLimit),
      offset: String(offset),
      expand: 'none',
      invoice_workflow_status: 'Ready to be Paid',
      owner,
    });

    const data = await fetchJson(
      `/almaws/v1/acq/invoices/?${params.toString()}`,
      `ready-to-be-paid:${owner}:${offset}`
    );

    invoices.push(...(data.invoice || []));

    const total = Number(data.total_record_count ?? invoices.length);
    if (invoices.length >= total) break;
  }

  return invoices;
}

export function getFundData(fundCode, library) {
  const params = new URLSearchParams({
    limit: '1',
    q: `fund_code~${fundCode}`,
    library,
    view: 'brief',
    mode: 'POL',
    status: 'ALL',
    entity_type: 'ALL',
    fiscal_period: 'ALL',
    parent_id: 'ALL',
    owner: 'ALL',
  });

  return fetchJson(`/almaws/v1/acq/funds?${params.toString()}`, `fund:${library}:${fundCode}`);
}

export function getVendorData(vendorCode) {
  return fetchJson(
    `/almaws/v1/acq/vendors/${encodeURIComponent(vendorCode)}`,
    `vendor:${vendorCode}`
  );
}

export async function getVendorPoLines(vendorCode, targetPoLines) {
  const targets = new Set([...targetPoLines].filter(Boolean));
  const found = new Set();
  const poLines = [];
  let offset = 0;
  let total = null;

  do {
    const params = new URLSearchParams({
      limit: String(config.alma.poLineLimit),
      offset: String(offset),
    });
    const data = await fetchJson(
      `/almaws/v1/acq/vendors/${encodeURIComponent(vendorCode)}/po-lines?${params.toString()}`,
      `vendor-po-lines:${vendorCode}:${offset}`
    );

    for (const poLine of (data.po_line || [])) {
      if (!targets.has(poLine.number)) continue;
      found.add(poLine.number);
      poLines.push({
        number: poLine.number,
        vendor: poLine.vendor?.value || vendorCode,
        resource_metadata: {
          title: poLine.resource_metadata?.title || '',
        },
      });
    }

    total = Number(data.total_record_count ?? 0);
    offset += config.alma.poLineLimit;
  } while (offset < total && found.size < targets.size);

  return poLines;
}
