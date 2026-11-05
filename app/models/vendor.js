import db from '../util/database.js';

export default class Vendor {
  constructor(vendorId, vendorData) {
    this.vendorId = vendorId;
    this.vendorData = vendorData;
  }

  save() {
    return db.execute(
      'INSERT INTO vendors (vendorId, vendorData, vendorName, financialSysCode, additionalCode, lastCheckedAt, syncStatus, syncError) VALUES (?, ?, ?, ?, ?, UTC_TIMESTAMP(), ?, NULL) ON DUPLICATE KEY UPDATE vendorData = VALUES(vendorData), vendorName = VALUES(vendorName), financialSysCode = VALUES(financialSysCode), additionalCode = VALUES(additionalCode), lastCheckedAt = VALUES(lastCheckedAt), syncStatus = VALUES(syncStatus), syncError = NULL',
      [this.vendorId, JSON.stringify(this.vendorData), this.vendorData.name ?? null, this.vendorData.financial_sys_code ?? null, this.vendorData.additional_code ?? null, 'OK']
    );
  }

  static fetchAll() {
    return db.execute('SELECT * FROM vendors');
  }

  static fetchVendorDataFromId(id) {
    return db.execute('SELECT vendorData FROM vendors WHERE vendors.vendorId = ?', [id]);
  }

  static deleteById(id) {
    return db.execute('DELETE FROM vendors WHERE vendors.id = ?', [id]);
  }

  static deleteByVendorId(id) {
    return db.execute('DELETE FROM vendors WHERE vendors.vendorId = ?', [id]);
  }
}
