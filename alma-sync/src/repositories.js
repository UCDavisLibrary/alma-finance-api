import db from './db.js';

export async function findFund(fundId) {
  const [rows] = await db.execute('SELECT * FROM `funds` WHERE `fundId` = ?', [fundId]);
  return rows[0] || null;
}

export async function saveFund(fundId, fundCode, fundData, metadata = {}) {
  const data = fundData == null ? null : JSON.stringify(fundData);

  await db.execute(
    `INSERT INTO ` +
      '`funds` (`fundId`, `fundCode`, `library`, `fundName`, `status`, `fundData`, `lastCheckedAt`, `syncStatus`, `syncError`) ' +
      `VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        ` +
      '`fundCode` = VALUES(`fundCode`), ' +
      '`library` = VALUES(`library`), ' +
      '`fundName` = VALUES(`fundName`), ' +
      '`status` = VALUES(`status`), ' +
      '`fundData` = VALUES(`fundData`), ' +
      '`lastCheckedAt` = VALUES(`lastCheckedAt`), ' +
      '`syncStatus` = VALUES(`syncStatus`), ' +
      '`syncError` = VALUES(`syncError`)',
    [
      fundId,
      fundCode,
      metadata.library ?? null,
      metadata.fundName ?? null,
      metadata.status ?? null,
      data,
      metadata.lastCheckedAt ?? new Date(),
      metadata.syncStatus ?? 'OK',
      metadata.syncError ?? null,
    ]
  );
}

export async function findVendor(vendorId) {
  const [rows] = await db.execute('SELECT * FROM `vendors` WHERE `vendorId` = ?', [vendorId]);
  return rows[0] || null;
}

export async function saveVendor(vendorId, vendorData, metadata = {}) {
  const data = vendorData == null ? '{}' : JSON.stringify(vendorData);

  await db.execute(
    `INSERT INTO ` +
      '`vendors` (`vendorId`, `vendorData`, `vendorName`, `financialSysCode`, `additionalCode`, `status`, `lastCheckedAt`, `syncStatus`, `syncError`) ' +
      `VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        ` +
      '`vendorData` = VALUES(`vendorData`), ' +
      '`vendorName` = VALUES(`vendorName`), ' +
      '`financialSysCode` = VALUES(`financialSysCode`), ' +
      '`additionalCode` = VALUES(`additionalCode`), ' +
      '`status` = VALUES(`status`), ' +
      '`lastCheckedAt` = VALUES(`lastCheckedAt`), ' +
      '`syncStatus` = VALUES(`syncStatus`), ' +
      '`syncError` = VALUES(`syncError`)',
    [
      vendorId,
      data,
      metadata.vendorName ?? null,
      metadata.financialSysCode ?? null,
      metadata.additionalCode ?? null,
      metadata.status ?? null,
      metadata.lastCheckedAt ?? new Date(),
      metadata.syncStatus ?? 'OK',
      metadata.syncError ?? null,
    ]
  );
}

export async function findPoLine(poLine, vendorId) {
  const [rows] = await db.execute(
    'SELECT * FROM `po_lines` WHERE `poLine` = ? AND `vendorId` = ?',
    [poLine, vendorId]
  );
  return rows[0] || null;
}

export async function savePoLine(poLine, vendorId, title, poLineData, metadata = {}) {
  const data = poLineData == null ? null : JSON.stringify(poLineData);

  await db.execute(
    `INSERT INTO ` +
      '`po_lines` (`poLine`, `vendorId`, `title`, `poLineData`, `lastCheckedAt`, `syncStatus`, `syncError`) ' +
      `VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        ` +
      '`title` = VALUES(`title`), ' +
      '`poLineData` = VALUES(`poLineData`), ' +
      '`lastCheckedAt` = VALUES(`lastCheckedAt`), ' +
      '`syncStatus` = VALUES(`syncStatus`), ' +
      '`syncError` = VALUES(`syncError`)',
    [
      poLine,
      vendorId,
      title ?? '',
      data,
      metadata.lastCheckedAt ?? new Date(),
      metadata.syncStatus ?? 'OK',
      metadata.syncError ?? null,
    ]
  );
}
