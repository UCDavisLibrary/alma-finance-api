const db = require('../util/database');

// optional; can be stored in database
const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

module.exports = class User {
  constructor(kerberos, email, firstname, lastname, library) {
    this.kerberos = kerberos;
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.library = library;
  }

  static findById(id) {
    return db.execute('SELECT * FROM users WHERE users.id = ?', [id]);
  }

  static checkLibrary(kerberos) {
    return db.execute('SELECT library FROM users WHERE users.kerberos = ?', [kerberos]);
  }
};
