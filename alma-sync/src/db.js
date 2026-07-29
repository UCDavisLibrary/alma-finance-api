import mysql from 'mysql2/promise';
import config from './config.js';

const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  database: config.db.database,
  password: config.db.password,
  waitForConnections: true,
  connectionLimit: 5,
});

export default pool;
