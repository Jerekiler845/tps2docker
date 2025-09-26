const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'app_db'
});

async function ensureTable(){
  await pool.query(`
    CREATE TABLE IF NOT EXISTS visits (
      id SERIAL PRIMARY KEY,
      count INTEGER NOT NULL
    );
  `);
  const res = await pool.query('SELECT * FROM visits WHERE id = 1;');
  if(res.rows.length === 0){
    await pool.query('INSERT INTO visits(id, count) VALUES (1, 0);');
  }
}

app.get('/', (req, res) => {
  res.json({
    message: 'Mi App Dockerizada',
    env: process.env.NODE_ENV || 'development',
    port
  });
});

app.get('/visit', async (req, res) => {
  try{
    const r = await pool.query('UPDATE visits SET count = count + 1 WHERE id = 1 RETURNING count;');
    res.json({ visits: r.rows[0].count });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

app.get('/count', async (req, res) => {
  const r = await pool.query('SELECT count FROM visits WHERE id = 1;');
  res.json({ visits: r.rows[0].count });
});

app.get('/health', async (req, res) => {
  try{
    await pool.query('SELECT 1;');
    res.json({ status: 'ok' });
  }catch(e){
    res.status(500).json({ status: 'db error' });
  }
});

(async () => {
  try{
    await ensureTable();
    app.listen(port, () => console.log(`Listening on ${port}`));
  }catch(e){
    console.error('Startup error', e);
    process.exit(1);
  }
})();
