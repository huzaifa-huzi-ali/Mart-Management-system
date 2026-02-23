require('dotenv').config();
const app = require('./app');
const { validateEnv } = require('./config/env');
const db = require('./config/db');

const PORT = process.env.PORT || 5000;

async function start() {
  validateEnv();
  await db.query('SELECT 1');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Startup failed:', err.message);
  process.exit(1);
});
