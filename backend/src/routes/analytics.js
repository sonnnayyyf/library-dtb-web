// backend/src/routes/analytics.js
import express from 'express';
import { readingSessions } from '../db/mongo.js';
import { getPool } from '../db/mysql.js';
import { requireAuth } from '../middleware/auth.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

function dateMatch(from, to) {
  const m = {};
  if (from) m.$gte = new Date(from);
  if (to) m.$lte = new Date(to);
  return Object.keys(m).length ? { start_time: m } : {};
}

/* ------------------------ Sessions (reader) ------------------------ */

// Start a reading session
router.post('/sessions/start', requireAuth(), async (req, res) => {
  try {
    const { book_id, device = 'web' } = req.body || {};
    if (book_id == null) return res.status(400).json({ error: 'book_id is required' });

    const doc = {
      user_id: Number(req.user.id),
      book_id: Number(book_id),
      device,
      start_time: new Date(),
      end_time: null,
      pages_read: null,
      highlights: [],
    };

    const result = await readingSessions().insertOne(doc);
    return res.json({ ok: true, session_id: result.insertedId });
  } catch (e) {
    console.error('[sessions/start]', e);
    return res.status(500).json({ error: 'Failed to start session' });
  }
});

// Finish a reading session
router.post('/sessions/:id/finish', requireAuth(), async (req, res) => {
  try {
    const { id } = req.params;
    const { pages_read = null, highlights = [] } = req.body || {};

    const result = await readingSessions().updateOne(
      {
        _id: new ObjectId(id),
        // tolerate old docs where user_id might be string
        user_id: { $in: [Number(req.user.id), String(req.user.id)] },
        end_time: null,
      },
      {
        $set: {
          end_time: new Date(),
          pages_read: pages_read != null ? Number(pages_read) : null,
          highlights: Array.isArray(highlights) ? highlights : [],
        },
      }
    );

    if (!result.matchedCount) return res.status(404).json({ error: 'Session not found' });
    return res.json({ ok: true });
  } catch (e) {
    console.error('[sessions/finish]', e);
    return res.status(500).json({ error: 'Failed to finish session' });
  }
});

/* ------------------------ Staff/Admin reports ------------------------ */

// A) Average session time per user
router.get('/reports/avg-session-time', requireAuth(['staff', 'admin']), async (req, res) => {
  try {
    const { from, to } = req.query;
    const match = dateMatch(from, to);

    const pipeline = [
      Object.keys(match).length ? { $match: match } : null,
      // ignore sessions without end_time
      { $match: { end_time: { $ne: null } } },
      { $set: { user_id: { $toInt: "$user_id" } } },
      { $match: { user_id: { $type: 'int' } } },
      {
        $project: {
          user_id: 1,
          dur_min: { $divide: [{ $subtract: ["$end_time", "$start_time"] }, 1000 * 60] },
        },
      },
      { $match: { dur_min: { $gt: 0 } } },
      {
        $group: {
          _id: "$user_id",
          sessions: { $sum: 1 },
          avg_minutes: { $avg: "$dur_min" },
        },
      },
      {
        $project: {
          _id: 0,
          user_id: "$_id",
          sessions: 1,
          avg_minutes: { $round: ["$avg_minutes", 1] },
        },
      },
      { $sort: { avg_minutes: -1 } },
      { $limit: 100 },
    ].filter(Boolean);

    const rows = await readingSessions().aggregate(pipeline).toArray();

    // Join users from MySQL
    const userIds = [...new Set(rows.map(r => Number(r.user_id)).filter(Number.isFinite))];
    if (userIds.length) {
      const pool = await getPool();
      const [users] = await pool.query(
        'SELECT id, name, email FROM users WHERE id IN (?)',
        [userIds]
      );
      const uMap = new Map(users.map(u => [Number(u.id), u]));
      rows.forEach(r => {
        const u = uMap.get(Number(r.user_id));
        r.name = u?.name || '-';
        r.email = u?.email || '-';
      });
    }

    return res.json(rows);
  } catch (e) {
    console.error('[reports/avg-session-time]', e);
    return res.status(500).json({ error: 'Failed to generate report' });
  }
});

// B) Most highlighted books
router.get('/reports/most-highlighted', requireAuth(['staff', 'admin']), async (req, res) => {
  try {
    const { from, to, limit = 20 } = req.query;
    const match = dateMatch(from, to);

    const pipeline = [
      Object.keys(match).length ? { $match: match } : null,
      { $set: { book_id: { $toInt: "$book_id" }, hl: { $ifNull: ["$highlights", []] } } },
      { $match: { book_id: { $type: 'int' } } },
      { $project: { book_id: 1, hlCount: { $size: "$hl" } } },
      { $group: { _id: "$book_id", highlights: { $sum: "$hlCount" } } },
      { $sort: { highlights: -1 } },
      { $limit: Math.max(1, Math.min(100, Number(limit))) },
      { $project: { _id: 0, book_id: "$_id", highlights: 1 } },
    ].filter(Boolean);

    const rows = await readingSessions().aggregate(pipeline).toArray();

    // Join books from MySQL
    const bookIds = [...new Set(rows.map(r => Number(r.book_id)).filter(Number.isFinite))];
    if (bookIds.length) {
      const pool = await getPool();
      const [books] = await pool.query(
        'SELECT id, title, publisher FROM books WHERE id IN (?)',
        [bookIds]
      );
      const bMap = new Map(books.map(b => [Number(b.id), b]));
      rows.forEach(r => {
        const b = bMap.get(Number(r.book_id));
        r.title = b?.title || '-';
        r.publisher = b?.publisher || '-';
      });
    }

    return res.json(rows);
  } catch (e) {
    console.error('[reports/most-highlighted]', e);
    return res.status(500).json({ error: 'Failed to generate report' });
  }
});

// C) Top books by total reading time
router.get('/reports/top-reading-time', requireAuth(['staff', 'admin']), async (req, res) => {
  try {
    const { from, to, limit = 10 } = req.query;
    const match = dateMatch(from, to);

    const pipeline = [
      Object.keys(match).length ? { $match: match } : null,
      { $match: { end_time: { $ne: null } } },
      { $set: { book_id: { $toInt: "$book_id" } } },
      { $match: { book_id: { $type: 'int' } } },
      {
        $project: {
          book_id: 1,
          dur_min: { $divide: [{ $subtract: ["$end_time", "$start_time"] }, 1000 * 60] },
        },
      },
      { $match: { dur_min: { $gt: 0 } } },
      {
        $group: {
          _id: "$book_id",
          sessions: { $sum: 1 },
          total_minutes: { $sum: "$dur_min" },
        },
      },
      {
        $project: {
          _id: 0,
          book_id: "$_id",
          sessions: 1,
          total_minutes: { $round: ["$total_minutes", 0] },
        },
      },
      { $sort: { total_minutes: -1 } },
      { $limit: Math.max(1, Math.min(100, Number(limit))) },
    ].filter(Boolean);

    const rows = await readingSessions().aggregate(pipeline).toArray();

    // Join books from MySQL
    const bookIds = [...new Set(rows.map(r => Number(r.book_id)).filter(Number.isFinite))];
    if (bookIds.length) {
      const pool = await getPool();
      const [books] = await pool.query(
        'SELECT id, title, publisher FROM books WHERE id IN (?)',
        [bookIds]
      );
      const bMap = new Map(books.map(b => [Number(b.id), b]));
      rows.forEach(r => {
        const b = bMap.get(Number(r.book_id));
        r.title = b?.title || '-';
        r.publisher = b?.publisher || '-';
      });
    }

    return res.json(rows);
  } catch (e) {
    console.error('[reports/top-reading-time]', e);
    return res.status(500).json({ error: 'Failed to generate report' });
  }
});

export default router;
