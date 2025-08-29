#!/usr/bin/env node
// Pure Node runner: reads .env, connects via mysql2 w/ TLS, creates DB,
// and applies all .sql files. No mysql.exe required.

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mysql = require('mysql2/promise');

const RESET = process.argv.includes('--reset');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL missing in .env');
  process.exit(1);
}

const url = new URL(process.env.DATABASE_URL);
const host = url.hostname;
const port = Number(url.port || 3306);
const user = decodeURIComponent(url.username || '');
const password = decodeURIComponent(url.password || '');
const initialDb = (url.pathname || '').replace(/^\//, '') || 'mysql';
const DB_NAME = process.env.DB_NAME || 'smart_library';
const sslMode = (url.searchParams.get('ssl-mode') || '').toUpperCase();
const caPath = process.env.MYSQL_SSL_CA ? path.resolve(process.env.MYSQL_SSL_CA) : '';

const ssl =
  sslMode && sslMode !== 'DISABLED'
    ? (caPath && fs.existsSync(caPath)
        ? { ca: fs.readFileSync(caPath), rejectUnauthorized: true }
        : { rejectUnauthorized: false })
    : undefined;

const SQL_DIR = path.resolve(__dirname, '../../sql');
const filesInOrder = [
  '000_settings.sql',
  '100_schema_tables.sql',
  '300_functions.sql',
  '401_sp_borrow_book.sql',
  '402_sp_return_book.sql',
  '403_sp_review_book.sql',
  '404_sp_add_book.sql',
  '405_sp_update_inventory.sql',
  '406_sp_retire_book.sql',
  '500_triggers.sql',
  // '900_seed_sample.sql',
];

function safeTransform(sql) {
  // Default SAFE mode removes destructive ops and makes CREATE idempotent
  let s = sql;
  s = s.replace(/^\s*DROP\s+(DATABASE|TABLE)\b[^;]*;/gim, '-- [SAFE] drop removed'); 
  s = s.replace(/^\s*TRUNCATE\s+TABLE?\b[^;]*;/gim, '-- [SAFE] truncate removed');
  s = s.replace(/^\s*DELETE\s+FROM\s+[^\s;]+\s*;/gim, '-- [SAFE] delete-all removed');
  s = s.replace(/\bCREATE\s+TABLE\s+(?!IF\s+NOT\s+EXISTS)/gi, 'CREATE TABLE IF NOT EXISTS ');
  s = s.replace(/\bCREATE\s+DATABASE\s+(?!IF\s+NOT\s+EXISTS)/gi, 'CREATE DATABASE IF NOT EXISTS ');
  return s;
}

// Splitter that understands DELIMITER blocks ($$ or //) enough for our files.
// Strategy:
//  - remove DELIMITER lines
//  - turn `... $$` or `... //` line endings into a split marker
//  - for non-DELIMITER files, split on plain semicolons at line ends
function splitStatements(sqlRaw) {
  let sql = sqlRaw.replace(/\r/g, '');
  const hasDelimiter = /(^|\n)\s*DELIMITER\s+/i.test(sql);

  // remove DELIMITER directives
  sql = sql.replace(/^\s*DELIMITER\s+.+$/gmi, '');

  // Mark routine boundaries first (handles our $$ or // usage)
  sql = sql.replace(/(\$\$|\/\/)\s*$/gm, ';/*<SPLIT>*/');

  const parts = [];
  if (hasDelimiter) {
    // Split only on our split markers so CREATE PROCEDURE bodies stay intact
    sql.split(/\/\*<SPLIT>\*\//).forEach(chunk => {
      const stmt = chunk.trim();
      if (stmt) parts.push(stmt);
    });
  } else {
    // Simple files: split on semicolons at line ends
    sql.split(/;\s*(?=\n|$)/).forEach(chunk => {
      const stmt = chunk.trim();
      if (stmt) parts.push(stmt.endsWith(';') ? stmt : stmt + ';');
    });
  }
  return parts;
}

async function getConn(db) {
  return mysql.createConnection({
    host, port, user, password, database: db,
    multipleStatements: false, // important for routines
    ssl
  });
}

(async () => {
  console.log('ℹ Connecting to bootstrap DB:', initialDb);
  const conn0 = await getConn(initialDb);
  if (RESET) {
    console.log(`⚠️  RESET: dropping & recreating \`${DB_NAME}\``);
    await conn0.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\`;`);
    await conn0.query(`CREATE DATABASE \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`);
  } else {
    console.log(`ℹ SAFE: ensuring \`${DB_NAME}\` exists`);
    await conn0.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`);
  }
  await conn0.end();

  const conn = await getConn(DB_NAME);

  for (const f of filesInOrder) {
    const full = path.join(SQL_DIR, f);
    if (!fs.existsSync(full)) {
      console.error('❌ Missing SQL file:', f);
      process.exit(1);
    }
    console.log(`\n▶ Applying ${f}${RESET ? '' : ' (SAFE)'}`);
    let sql = fs.readFileSync(full, 'utf8');
    if (!RESET) sql = safeTransform(sql);

    const statements = splitStatements(sql);
    for (const stmt of statements) {
      await conn.query(stmt);
    }
  }

  await conn.end();
  console.log('\n✅ All SQL applied successfully.');
})().catch(err => {
  console.error('\n❌ Failed:', err.message);
  process.exit(1);
});
