import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

let pool;
export async function getPool() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

  const u = new URL(process.env.DATABASE_URL);
  const dbInUrl = (u.pathname || '').replace(/^\//, '');
  const targetDb =
    dbInUrl.toLowerCase() === 'defaultdb' && process.env.DB_NAME
      ? process.env.DB_NAME
      : dbInUrl;

  const sslMode = (u.searchParams.get('ssl-mode') || '').toUpperCase();

  // Resolve CA path relative to the project root
  const rawCa = process.env.MYSQL_SSL_CA;
  const caPath = rawCa
    ? (path.isAbsolute(rawCa) ? rawCa : path.resolve(__dirname, '../../', rawCa))
    : null;

  const cfg = {
    host: u.hostname,
    port: Number(u.port || 3306),
    user: decodeURIComponent(u.username || ''),
    password: decodeURIComponent(u.password || ''),
    database: targetDb || 'smart_library',
    waitForConnections: true,
    connectionLimit: 10,
  };

  if (sslMode && sslMode !== 'DISABLED') {
    if (caPath && fs.existsSync(caPath)) {
      cfg.ssl = { ca: fs.readFileSync(caPath), rejectUnauthorized: true };
    } else {
      console.warn('[mysql] SSL enabled but CA file not found, proceeding with rejectUnauthorized=false');
      cfg.ssl = { rejectUnauthorized: false };
    }
  }

  pool ??= await mysql.createPool(cfg);
  return pool;
}
