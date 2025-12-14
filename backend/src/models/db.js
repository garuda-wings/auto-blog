// backend/src/models/db.js
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'bloguser',
  password: process.env.DB_PASSWORD || 'blogpassword',
  database: process.env.DB_NAME || 'autoblog',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432
});

// simple helper to log connection problems early
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
