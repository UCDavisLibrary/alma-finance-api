import db from '../util/database.js';

export default class Vendor {
  constructor(vendorId, vendorData) {
    this.vendorId = vendorId;
    this.vendorData = vendorData;
  }

  save() {
    return db.execute(
      'INSERT INTO vendors (vendorId, vendorData) VALUES (?, ?) ON DUPLICATE KEY UPDATE vendorData = VALUES(vendorData)',
      [this.vendorId, this.vendorData]
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
