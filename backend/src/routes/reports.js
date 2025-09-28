import { Router } from 'express';
import { getPool } from '../db/mysql.js';
import { requireRole } from '../middleware/auth.js';

const router = Router();

// helper to unwrap mysql2 CALL results
function unwrapCallResult(rsets) {
  return Array.isArray(rsets) ? (Array.isArray(rsets[0]) ? rsets[0] : rsets) : rsets;
}

// Most borrowed books
router.get('/most-borrowed', requireRole('staff', 'admin'), async (req, res, next) => {
  try {
    const { from = null, to = null, limit = null } = req.query;
    const pool = await getPool();
    const [rsets] = await pool.query('CALL sp_rpt_most_borrowed_books(?,?,?)', [from || null, to || null, limit ? Number(limit) : null]);
    res.json(unwrapCallResult(rsets));
  } catch (err) { next(err); }
});

// Top active readers
router.get('/top-readers', requireRole('staff', 'admin'), async (req, res, next) => {
  try {
    const { from = null, to = null, limit = null } = req.query;
    const pool = await getPool();
    const [rsets] = await pool.query('CALL sp_rpt_top_readers(?,?,?)', [from || null, to || null, limit ? Number(limit) : null]);
    res.json(unwrapCallResult(rsets));
  } catch (err) { next(err); }
});

// Low availability
router.get('/low-availability', requireRole('staff', 'admin'), async (req, res, next) => {
  try {
    const { threshold = null, limit = null } = req.query;
    const pool = await getPool();
    const [rsets] = await pool.query('CALL sp_rpt_low_availability(?,?)',
      [threshold != null ? Number(threshold) : null, limit ? Number(limit) : null]);
    res.json(unwrapCallResult(rsets));
  } catch (err) { next(err); }
});

export default router;
