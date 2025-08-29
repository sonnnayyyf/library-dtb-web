// backend/src/routes/reviews.js
import { Router } from 'express';
import { getPool } from '../db/mysql.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

async function tryCalls(pool, attempts) {
  let lastErr;
  for (const { sql, params } of attempts) {
    try { await pool.query(sql, params); return; }
    catch (e) {
      if (e?.code === 'ER_WRONG_PARAM_COUNT' || e?.errno === 1318 || e?.code === 'ER_PARSE_ERROR') {
        lastErr = e; continue;
      }
      throw e;
    }
  }
  throw lastErr || new Error('No matching procedure signature worked');
}

/** Create/replace a review — OUT vars: @success, @message */
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { book_id, rating, comment } = req.body;
    if (!book_id || rating == null) return res.status(400).json({ error: 'book_id and rating required' });

    const pool = await getPool();
    const userId = req.user.id;
    const r = Math.max(1, Math.min(5, Number(rating)));
    const text = (comment || '').trim() || null;

    await pool.query('CALL sp_review_book(?, ?, ?, ?, @success, @message)', [userId, book_id, r, text]);
    const [out] = await pool.query('SELECT @success AS success, @message AS message;');

    const row = out?.[0] || {};
    if (!row.success) return res.status(400).json({ error: row.message || 'Review failed' });
    res.json({ ok: true, message: row.message });
  } catch (err) { next(err); }
});


/** List reviews for a book (public) */
router.get('/book/:id', async (req, res, next) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.name AS user_name
         FROM reviews r
         JOIN users u ON u.id = r.user_id
        WHERE r.book_id = ?
        ORDER BY r.created_at DESC
        LIMIT 100`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) { next(err); }
});

export default router;
