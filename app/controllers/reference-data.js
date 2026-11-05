export function validVendor(value) {
  if (typeof value === 'string') {
    try { value = JSON.parse(value); } catch { return null; }
  }
  if (!value || value.errorsExist) return null;
  const number = value.financial_sys_code;
  const site = value.additional_code;
  if (typeof number !== 'string' || !number.trim() || number.trim().length > 30 ||
      typeof site !== 'string' || !site.trim() || site.trim().length > 15) return null;
  return { ...value, financial_sys_code: number.trim(), additional_code: site.trim() };
}

export function validFund(value) {
  if (typeof value !== 'string') return null;
  const separator = value.includes('|') ? '|' : '.';
  const parts = value.split(separator).map(part => part.trim());
  // The payload uses five GL segments or four project accounting segments.
  if (parts.length !== (separator === '|' ? 4 : 5) || parts.some(part => !part)) return null;
  return parts.join(separator);
}

export function createReferenceResolver({ fetchVendorDataFromId, getVendorData, saveVendor, fetchFundCodeFromId, getFundData, saveFund }) {
  const vendors = new Map();
  const funds = new Map();
  return {
    vendor(id, fresh = false) {
      if (!vendors.has(id)) vendors.set(id, (async () => {
        const cached = fresh ? null : validVendor(await fetchVendorDataFromId(id));
        if (cached) return cached;
        const live = validVendor(await getVendorData(id));
        if (!live) throw new Error(`Vendor ${id}: Alma did not return a valid supplier number and supplier site. Correct the vendor in Alma before sending.`);
        if (!await saveVendor(id, live)) throw new Error(`Vendor ${id}: unable to save repaired vendor data. Invoice was not sent.`);
        return live;
      })());
      return vendors.get(id);
    },
    fund(id, library, fresh = false) {
      const key = `${library}:${id}`;
      if (!funds.has(key)) funds.set(key, (async () => {
        const cached = fresh ? null : validFund(await fetchFundCodeFromId(id));
        if (cached) return cached;
        const live = await getFundData(id, library);
        const value = validFund(live?.fund?.[0]?.external_id);
        if (!value) throw new Error(`Fund ${id}: Alma did not return a complete GL or project accounting code. Correct the fund in Alma before sending.`);
        if (!await saveFund(id, value)) throw new Error(`Fund ${id}: unable to save repaired fund data. Invoice was not sent.`);
        return value;
      })());
      return funds.get(key);
    },
  };
}
