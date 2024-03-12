const db = require('../util/database');

// optional; can be stored in database
const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

module.exports = class Invoice {
  constructor(number, id, trackingid, library, responsebody) {
    this.number = number;
    this.id = id;
    this.trackingid = trackingid;
    this.library = library;
    this.responsebody = responsebody;
  }

  save() {
    return db.execute(
      'INSERT INTO invoices (invoicenumber, invoiceid, consumerTrackingId, library, status, responsebody, datetime) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [this.number, this.id, this.trackingid, this.library, 'SENT', this.responsebody, now]
    );
  }

  static deleteById(id) {
    return db.execute('DELETE FROM invoices WHERE invoices.id = ?', [id]);
  }

  static fetchAll(library) {
    return db.execute('SELECT * FROM invoices WHERE invoices.library = ?', [library]);
  }

  static fetchAllAdmin() {
    return db.execute('SELECT * FROM invoices');
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

  static fetchAllUnpaidInvoices(library) {
    return db.execute('SELECT * FROM invoices WHERE invoices.status != ? AND invoices.library = ?', ['PAID',library]);
  }

  static fetchPaidInvoices(library) {
    return db.execute('SELECT * FROM invoices WHERE invoices.status = ? AND invoices.library = ? ORDER BY invoices.id DESC LIMIT 100', ['PAID', library]);
  }

  static findById(id) {
    return db.execute('SELECT * FROM invoices WHERE invoices.id = ?', [id]);
  }

  static findByInvoiceId(invoiceid) {
    return db.execute('SELECT * FROM invoices WHERE invoices.invoiceid = ?', [invoiceid]);
  }

  static findByInvoiceNumber(invoicenumber) {
    return db.execute('SELECT * FROM invoices WHERE invoices.invoicenumber = ?', [invoicenumber]);
  }

  static updateStatus(status, responsebody, invoiceid) {
    return db.execute('UPDATE invoices SET status = ?, responsebody = ? WHERE invoiceid = ?', [status, responsebody, invoiceid]);
  }

  static fetchBySearchTerm(searchterm) {
    return db.execute('SELECT * FROM invoices WHERE invoices.invoicenumber LIKE ? OR invoices.invoiceid LIKE ?', ['%' + searchterm + '%', '%' + searchterm + '%']);
  }

  static update = (number, invoiceid, trackingid, library, status, responsebody, datetime, id) => {
    return db.execute('UPDATE invoices SET invoicenumber = ?, invoiceid = ?, consumerTrackingId = ?, library = ?, status = ?, responsebody = ?, datetime = ? WHERE id = ?', [number, invoiceid, trackingid, library, status, responsebody, datetime, id]);
  }

  static updateInvoiceStatus = (status, id) => {
    return db.execute('UPDATE invoices SET status = ? WHERE id = ?', [status, id]);
  }

};
