import db from '../util/database.js';

export default class PoLine {
  constructor(poLine, vendorId, title, poLineData) {
    this.poLine = poLine;
    this.vendorId = vendorId;
    this.title = title;
    this.poLineData = poLineData;
  }

  save() {
    const data = this.poLineData == null ? null : JSON.stringify(this.poLineData);

    return db.execute(
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
        this.poLine,
        this.vendorId,
        this.title ?? '',
        data,
        new Date(),
        'OK',
        null,
      ]
    );
  }

  static findByPoLine(poLine) {
    return db.execute(
      'SELECT * FROM `po_lines` WHERE `poLine` = ? ORDER BY `lastCheckedAt` DESC LIMIT 1',
      [poLine]
    );
  }
}
