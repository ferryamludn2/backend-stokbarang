// pake dataabase supabase
// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//   user: process.env.PGUSER,
//   host: process.env.PGHOST,
//   database: process.env.PGDATABASE,
//   password: String(process.env.DB_PASSWORD),
// //   password: process.env.PGPASSWORD,
//   port: process.env.PGPORT,
//   ssl: { rejectUnauthorized: false }
// });

// module.exports = pool;


// coba di lokal
// local database connection using pg
const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD),
  port: Number(process.env.DB_PORT),
  ssl: false,
});

module.exports = pool;
