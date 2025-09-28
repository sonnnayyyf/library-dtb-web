import 'dotenv/config';
import loansRouter from './routes/loans.js';
import reviewsRouter from './routes/reviews.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import express from 'express';
import cors from 'cors';
import { authOptional } from './middleware/auth.js';
import analyticsRouter from "./routes/analytics.js";
import { initMongo } from "./db/mongo.js";

const app=express();
app.use(cors());
app.use(express.json());
app.use(authOptional);
app.use('/auth',(await import('./routes/auth.js')).default);
app.use('/books',(await import('./routes/books.js')).default);
app.use('/loans',(await import('./routes/loans.js')).default);
app.use('/reviews',(await import('./routes/reviews.js')).default);
app.use('/reports',(await import('./routes/reports.js')).default);
app.get('/',(req,res)=>res.json({ok:true}));

// init Mongo once at startup
await initMongo();
app.use("/api/analytics", analyticsRouter);


const port=process.env.PORT||3000;
app.listen(port,()=>console.log(`API listening on ${port}`));

