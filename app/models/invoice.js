const db = require('../util/database');

// optional; can be stored in database
const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

module.exports = class Invoice {
  constructor(number, id, responsebody) {
    this.number = number;
    this.id = id;
    this.responsebody = responsebody;
  }

  save() {
    return db.execute(
      'INSERT INTO invoices (invoicenumber, invoiceid, responsebody, datetime) VALUES (?, ?, ?, ?)',
      [this.number, this.id, this.responsebody, now]
    );
  }

  static deleteById(id) {
    return db.execute('DELETE FROM invoices WHERE invoices.id = ?', [id]);
  }

  static fetchAll() {
    return db.execute('SELECT * FROM invoices');
  }

  static fetchInvoiceIDs() {
    return db.execute('SELECT invoiceid FROM invoices');
  }

  static findById(id) {
    return db.execute('SELECT * FROM invoices WHERE invoices.id = ?', [id]);
  }
};
