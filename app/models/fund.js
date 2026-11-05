import db from '../util/database.js';

export default class Fund {
  constructor(fundId, fundCode) {
    this.fundId = fundId;
    this.fundCode = fundCode;
  }

  save() {
    return db.execute(
      'INSERT INTO funds (fundId, fundCode, lastCheckedAt, syncStatus, syncError) VALUES (?, ?, UTC_TIMESTAMP(), ?, NULL) ON DUPLICATE KEY UPDATE fundCode = VALUES(fundCode), lastCheckedAt = VALUES(lastCheckedAt), syncStatus = VALUES(syncStatus), syncError = NULL',
      [this.fundId, this.fundCode, 'OK']
    );
  }

  static deleteById(id) {
    return db.execute('DELETE FROM funds WHERE funds.id = ?', [id]);
  }

  static deleteByFundId(fundId) {
    return db.execute('DELETE FROM funds WHERE funds.fundId = ?', [fundId]);
  }

  static fetchAll() {
    return db.execute('SELECT * FROM funds');
  }

  static findCodeById(id) {
    return db.execute('SELECT fundCode FROM funds WHERE funds.fundId = ?', [id]);
  }
}
