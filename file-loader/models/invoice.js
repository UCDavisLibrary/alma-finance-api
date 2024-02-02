const db = require('../util/database');

// optional; can be stored in database
const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

module.exports = class Invoice {
  constructor(number, id, library, responsebody) {
    this.number = number;
    this.id = id;
    this.library = library;
    this.responsebody = responsebody;
  }

  save() {
    return db.execute(
      'INSERT INTO invoices (invoicenumber, invoiceid, library, status, responsebody, datetime) VALUES (?, ?, ?, ?, ?, ?)',
      [this.number, this.id, this.library, 'SENT', this.responsebody, now]
    );
  }

  static deleteById(id) {
    return db.execute('DELETE FROM invoices WHERE invoices.id = ?', [id]);
  }

  static fetchAll(library) {
    return db.execute('SELECT * FROM invoices WHERE invoices.library = ?', [library]);
  }

  static fetchInvoiceIDs(library) {
    return db.execute('SELECT invoiceid FROM invoices WHERE invoices.library = ?', [library]);
  }

  static fetchInvoiceNumbers(library) {
    return db.execute('SELECT invoicenumber FROM invoices WHERE invoices.library = ?', [library]);
  }

  static fetchAllInvoiceNumbers() {
    return db.execute('SELECT invoicenumber FROM invoices');
  }

  static fetchUnpaidInvoiceNumbers(library) {
    return db.execute('SELECT invoicenumber FROM invoices WHERE invoices.status != ? AND invoices.library = ?', ['PAID', library]);
  }

  static fetchAllUnpaidInvoices() {
    return db.execute('SELECT * FROM invoices WHERE invoices.status != ?', ['PAID']);
  }

  static fetchPaidInvoices(library) {
    return db.execute('SELECT * FROM invoices WHERE invoices.status = ? AND invoices.library = ? ORDER BY invoices.id DESC', ['PAID', library]);
  }

  static findById(id) {
    return db.execute('SELECT * FROM invoices WHERE invoices.id = ?', [id]);
  }

  static updateStatus(status, responsebody, invoiceid) {
    return db.execute('UPDATE invoices SET status = ?, responsebody = ? WHERE invoiceid = ?', [status, responsebody, invoiceid]);
  }

};
