import { Router } from 'express';
import { getPool } from '../db/mysql.js';
import { requireRole } from '../middleware/auth.js';

const router = Router();

/** List/search books (no authors join; minimal columns) */
router.get('/', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const pool = await getPool();

    let sql = `
      SELECT
        b.id, b.title, b.genre, b.publisher,
        b.copies, b.available_copies, b.is_retired, b.image_url,
        (SELECT ROUND(AVG(r.rating),1) FROM reviews r WHERE r.book_id = b.id) AS avg_rating
      FROM books b
    `;
    const params = [];
    if (q) {
      const like = `%${q}%`;
      sql += ` WHERE (b.title LIKE ? OR b.genre LIKE ? OR b.publisher LIKE ?)`;
      params.push(like, like, like);
    }
    sql += ` ORDER BY b.title ASC LIMIT 200`;

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/** Add a book (admin/staff) – calls sp_add_book(title, genre, publisher, copies, image_url, OUT book_id) */
router.post('/', requireRole('staff', 'admin'), async (req, res, next) => {
  try {
    const { title, genre = null, publisher = null, copies = 1, image_url = null } = req.body;
    const pool = await getPool();

    await pool.query('CALL sp_add_book(?, ?, ?, ?, ?, @book_id)', [
      title,
      genre,
      publisher,
      Number(copies || 0),
      image_url,
    ]);
    const [out] = await pool.query('SELECT @book_id AS book_id;');
    res.json({ ok: true, book_id: out?.[0]?.book_id ?? null });
  } catch (err) {
    next(err);
  }
});

/** Adjust inventory (admin/staff) – calls sp_update_inventory(book_id, delta, reason, staff_id) */
router.patch('/:id/inventory', requireRole('staff', 'admin'), async (req, res, next) => {
  try {
    const bookId = Number(req.params.id);
    const delta = Number(req.body.delta || 0);
    const reason = req.body.reason || null;
    const staffId = req.user?.id ?? null;

    const pool = await getPool();
    await pool.query('CALL sp_update_inventory(?, ?, ?, ?)', [bookId, delta, reason, staffId]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

/** Retire book (admin/staff) – calls sp_retire_book(book_id, reason) */
router.post('/:id/retire', requireRole('staff', 'admin'), async (req, res, next) => {
  try {
    const bookId = Number(req.params.id);
    const reason = req.body.reason || null;

    const pool = await getPool();
    await pool.query('CALL sp_retire_book(?, ?)', [bookId, reason]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
