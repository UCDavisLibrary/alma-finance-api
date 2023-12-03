const db = require('../util/database');

module.exports = class Fund {
  constructor(fundId, fundCode) {
    this.fundId = fundId;
    this.fundCode = fundCode;
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