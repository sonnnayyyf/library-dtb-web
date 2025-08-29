// backend/src/routes/loans.js
import { Router } from 'express';
import { getPool } from '../db/mysql.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
// tiny helper: try a list of CALLs until one works
async function tryCalls(pool, attempts) {
  let lastErr;
  for (const { sql, params } of attempts) {
    try {
      await pool.query(sql, params);
      return;
    } catch (e) {
      const code  = e?.code || '';
      const errno = e?.errno;

      const isWrongCount = code === 'ER_WRONG_PARAM_COUNT' || errno === 1318;
      const isParseErr   = code === 'ER_PARSE_ERROR' || errno === 1064;
      // <- THIS is your case (“OUT or INOUT argument N ... is not a variable ...”)
      const isOutNotVar  = errno === 1414 || /OUT or INOUT argument .* is not a variable/i.test(e?.sqlMessage || '');

      if (isWrongCount || isParseErr || isOutNotVar) {
        lastErr = e;
        continue; // try next signature
      }
      throw e; // real error, bubble up
    }
  }
  throw lastErr || new Error('No matching procedure signature worked');
}

/** My loans (reader) */
router.get('/my', requireAuth, async (req, res, next) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      `SELECT c.id AS checkout_id, c.book_id, c.user_id,
              c.checkout_date, c.due_date, c.return_date, c.status, c.late,
              b.title
         FROM checkouts c
         JOIN books b ON b.id = c.book_id
        WHERE c.user_id = ?
        ORDER BY c.checkout_date DESC
        LIMIT 200`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) { next(err); }
});

/** Borrow a book (reader) — OUT vars: @checkout_id, @success, @message */
router.post('/borrow', requireAuth, async (req, res, next) => {
  try {
    const { book_id } = req.body;
    if (!book_id) return res.status(400).json({ error: 'book_id required' });

    const pool = await getPool();
    const userId = req.user.id;

    await pool.query('CALL sp_borrow_book(?, ?, @checkout_id, @success, @message)', [userId, book_id]);
    const [out] = await pool.query('SELECT @checkout_id AS checkout_id, @success AS success, @message AS message;');

    const row = out?.[0] || {};
    if (!row.success) return res.status(400).json({ error: row.message || 'Borrow failed' });
    res.json({ ok: true, checkout_id: row.checkout_id, message: row.message });
  } catch (err) { next(err); }
});

/** Return a book (reader) — OUT vars: @success, @message */
router.post('/return', requireAuth, async (req, res, next) => {
  try {
    const { checkout_id } = req.body;
    if (!checkout_id) return res.status(400).json({ error: 'checkout_id required' });

    const pool = await getPool();
    const userId = req.user.id;

    await pool.query('CALL sp_return_book(?, ?, @success, @message)', [userId, checkout_id]);
    const [out] = await pool.query('SELECT @success AS success, @message AS message;');

    const row = out?.[0] || {};
    if (!row.success) return res.status(400).json({ error: row.message || 'Return failed' });
    res.json({ ok: true, message: row.message });
  } catch (err) { next(err); }
});


export default router;
