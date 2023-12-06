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

  static fetchVendorDataFromId(id) {
    return db.execute('SELECT vendorData FROM vendors WHERE vendors.vendorId = ?', [id]);
  }

};