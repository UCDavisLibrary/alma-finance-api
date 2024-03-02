const db = require('../util/database');

module.exports = class Vendor {
  constructor(vendorId, vendorData) {
    this.vendorId = vendorId;
    this.vendorData = vendorData;
  }

  save() {
    return db.execute(
      'INSERT INTO vendors (vendorId, vendorData) VALUES (?, ?)',
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

};