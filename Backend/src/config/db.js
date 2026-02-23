const { Pool } = require('pg');

const useSsl = process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false };

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSsl,
  max: Number(process.env.DB_POOL_MAX || 20),
  idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS || 30000),
  connectionTimeoutMillis: Number(process.env.DB_CONNECT_TIMEOUT_MS || 10000),
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
};
