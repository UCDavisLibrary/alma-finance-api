import db from '../util/database.js';

export default class Token {
  constructor(token) {
    this.token = token;
  }

  save() {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return db.execute(
      'INSERT INTO tokens (token, datetime) VALUES (?, ?)',
      [this.token, now]
    );
  }

  static fetchOne() {
    return db.execute('SELECT token FROM tokens ORDER BY id DESC LIMIT 1');
  }
}
