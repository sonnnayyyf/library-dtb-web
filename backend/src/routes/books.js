import { Router } from 'express';
import { getPool } from '../db/mysql.js';
import { requireRole } from '../middleware/auth.js';

const router = Router();

/** List/search books including authors */
router.get('/', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const pool = await getPool();

    const like = `%${q}%`;
    const params = q ? [like, like, like, like] : [];

    const sql = `
      SELECT
        b.id, b.title, b.genre, b.publisher,
        b.copies, b.available_copies, b.is_retired,
        GROUP_CONCAT(DISTINCT a.name ORDER BY a.name SEPARATOR ', ') AS authors,
        (SELECT ROUND(AVG(r.rating),1) FROM reviews r WHERE r.book_id = b.id) AS avg_rating
      FROM books b
      LEFT JOIN book_authors ba ON ba.book_id = b.id
      LEFT JOIN authors a       ON a.id = ba.author_id
      ${q ? `WHERE (b.title LIKE ? OR b.genre LIKE ? OR b.publisher LIKE ? OR a.name LIKE ?)` : ''}
      GROUP BY b.id
      ORDER BY b.title ASC
      LIMIT 200
    `;
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) { next(err); }
});

/** Add a book (admin/staff) + authors CSV */
router.post('/', requireRole('staff', 'admin'), async (req, res, next) => {
  const pool = await getPool();
  const conn = await pool.getConnection();
  try {
    const {
      title,
      genre = null,
      publisher = null,
      copies = 1,
      authors = ''  // "name1, name2"
    } = req.body;

    await conn.beginTransaction();

    // 1) create book
    await conn.query('CALL sp_add_book(?, ?, ?, ?, @book_id)', [
      title, genre, publisher, Number(copies || 0)
    ]);
    const [out] = await conn.query('SELECT @book_id AS book_id;');
    const bookId = out?.[0]?.book_id;
    if (!bookId) throw new Error('Failed to create book');

    // 2) upsert authors & link
    const names = String(authors || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    for (const name of Array.from(new Set(names))) {
      await conn.query(
        'INSERT INTO authors(name) VALUES (?) ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)',
        [name]
      );
      const [aidRow] = await conn.query('SELECT LAST_INSERT_ID() AS id;');
      const authorId = aidRow?.[0]?.id;
      if (authorId) {
        await conn.query(
          'INSERT IGNORE INTO book_authors (book_id, author_id) VALUES (?,?)',
          [bookId, authorId]
        );
      }
    }

    await conn.commit();
    res.json({ ok: true, book_id: bookId });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
});

/** Adjust inventory */
router.patch('/:id/inventory', requireRole('staff', 'admin'), async (req, res, next) => {
  try {
    const bookId = Number(req.params.id);
    const delta = Number(req.body.delta || 0);
    const reason = req.body.reason || null;
    const staffId = req.user?.id ?? null;

    const pool = await getPool();
    await pool.query('CALL sp_update_inventory(?, ?, ?, ?)', [bookId, delta, reason, staffId]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

/** Retire */
router.post('/:id/retire', requireRole('staff', 'admin'), async (req, res, next) => {
  try {
    const pool = await getPool();
    const bookId = Number(req.params.id);
    const reason = req.body.reason || null;
    const staffId = req.user?.id ?? null;
    await pool.query('CALL sp_retire_book(?, ?, ?)', [bookId, reason, staffId]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;

// Unretire book (admin/staff) – calls sp_unretire_book(book_id, reason, staff_id)
router.post('/:id/unretire', requireRole('staff', 'admin'), async (req, res, next) => {
  try {
    const pool = await getPool();
    const bookId = Number(req.params.id);
    const reason = req.body.reason || null;
    const staffId = req.user?.id ?? null;

    await pool.query('CALL sp_unretire_book(?, ?, ?)', [bookId, reason, staffId]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});
