const db = require('../util/database');
// const {now} = require('../util/vars');
const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

module.exports = class Token {
  constructor(token) {
    this.token = token;
  }

  save() {
    return db.execute(
      'INSERT INTO tokens (token, datetime) VALUES (?, ?)',
      [this.token, now]
    );
  }

//   static deleteById(id) {
//     return db.execute('DELETE FROM invoices WHERE invoices.id = ?', [id]);
//   }

  static fetchOne() {
    return db.execute('SELECT * FROM tokens ORDER BY datetime DESC LIMIT 1');
  }

//   static fetchInvoiceIDs() {
//     return db.execute('SELECT invoiceid FROM invoices');
//   }

//   static fetchInvoiceNumbers() {
//     return db.execute('SELECT invoicenumber FROM invoices');
//   }

//   static findById(id) {
//     return db.execute('SELECT * FROM invoices WHERE invoices.id = ?', [id]);
//   }
};
