const db = require('../util/database');

// optional; can be stored in database
const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

module.exports = class User {
  constructor(firstname, lastname, email, kerberos, library) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.kerberos = kerberos;
    this.library = library;
  }

  static fetchAll() {
    return db.execute('SELECT * FROM users');
  }

  static findByKerberos(kerberos) {
    return db.execute('SELECT * FROM users WHERE users.kerberos = ?', [kerberos]);
  }

  static update(firstname, lastname, email, kerberos, library, id) {
    return db.execute('UPDATE users SET firstname = ?, lastname = ?, email = ?, kerberos = ?, library = ? WHERE id = ?', [firstname, lastname, email, kerberos, library, id]);
  }

  static findByID(id) {
    return db.execute('SELECT * FROM users WHERE users.id = ?', [id]);
  }

  static checkLibrary(kerberos) {
    return db.execute('SELECT library FROM users WHERE users.kerberos = ?', [kerberos]);
  }

  save() {
    return db.execute(
      'INSERT INTO users (firstname, lastname, email, kerberos, library) VALUES (?, ?, ?, ?, ?)',
      [this.firstname, this.lastname, this.email, this.kerberos, this.library]
    );
  }

  static deleteById(id) {
    return db.execute('DELETE FROM users WHERE users.id = ?', [id]);
  }
};
