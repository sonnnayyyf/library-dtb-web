import { Router } from 'express';
import { getPool } from '../db/mysql.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
const router=Router();
router.get('/most-borrowed',requireAuth,requireRole('staff','admin'),async(req,res)=>{const{from,to}=req.query;const pool=await getPool();const[rows]=await pool.query(`SELECT b.id,b.title,COUNT(*) AS borrow_count FROM checkouts c JOIN books b ON b.id=c.book_id WHERE c.checkout_date >= ? AND c.checkout_date < ? GROUP BY b.id ORDER BY borrow_count DESC LIMIT 50`,[from,to]);res.json(rows)});
router.get('/top-readers',requireAuth,requireRole('staff','admin'),async(req,res)=>{const{from,to}=req.query;const pool=await getPool();const[rows]=await pool.query(`SELECT u.id,u.name,u.email,COUNT(*) AS total_checkouts FROM checkouts c JOIN users u ON u.id=c.user_id WHERE c.checkout_date >= ? AND c.checkout_date < ? GROUP BY u.id ORDER BY total_checkouts DESC LIMIT 50`,[from,to]);res.json(rows)});
router.get('/low-availability',requireAuth,requireRole('staff','admin'),async(req,res)=>{const threshold=Number(req.query.threshold??1);const pool=await getPool();const[rows]=await pool.query(`SELECT id,title,available_copies,total_copies FROM books WHERE is_retired=0 AND available_copies<=? ORDER BY available_copies ASC,title ASC LIMIT 100`,[threshold]);res.json(rows)});
export default router;
