#!/usr/bin/env node
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { getPool } from '../src/db/mysql.js';

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME || 'Admin';

if (!email || !password) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
const pool = await getPool();

const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);

if (rows.length) {
  await pool.query(
    // role = 'admin'
    'UPDATE users SET role = ?, name = ?, password_hash = ? WHERE id = ?',
    ['admin', name, hash, rows[0].id]
  );
  console.log('Updated admin:', email);
} else {
  await pool.query(
    // role = 'admin'
    'INSERT INTO users (role, name, email, password_hash) VALUES (?, ?, ?, ?)',
    ['admin', name, email, hash]
  );
  console.log('Created admin:', email);
}

await pool.end();
