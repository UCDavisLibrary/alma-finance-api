const db = require('../util/database');

module.exports = class Vendor {
  constructor(vendorId, vendorData) {
    this.vendorId = vendorId;
    this.vendorData = vendorData;
  }

  save() {
    return db.execute(
      'INSERT INTO funds (fundId, fundCode) VALUES (?, ?)',
      [this.fundId, this.fundCode]
    );
  }

  static deleteById(id) {
    return db.execute('DELETE FROM funds WHERE funds.id = ?', [id]);
  }

  static fetchAll() {
    return db.execute('SELECT * FROM funds');
  }

  static findCodeById(id) {
    return db.execute('SELECT fundCode FROM funds WHERE funds.fundId = ?', [id]);
  }

};