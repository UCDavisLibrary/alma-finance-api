const db = require('../util/database');

module.exports = class Invoice {
  constructor(id, responsebody) {
    this.id = id;
    this.responsebody = responsebody;
  }

  save() {
    return db.execute(
      'INSERT INTO invoices (id, responsebody) VALUES (?, ?)',
      [this.id, this.responsebody]
    );
  }

  static deleteById(id) {
    return db.execute('DELETE FROM invoices WHERE invoices.id = ?', [id]);
  }

  static fetchAll() {
    return db.execute('SELECT * FROM invoices');
  }

  static findById(id) {
    return db.execute('SELECT * FROM invoices WHERE invoices.id = ?', [id]);
  }
};
