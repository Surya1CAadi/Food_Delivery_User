import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Use the PORT Render provides (or fallback to 4000 locally)
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

// API endpoints
app.use('/api/food', foodRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Serve uploaded images (you already had this)
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// Paths to built frontends (relative to backend folder)
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
const adminDist = path.join(__dirname, '..', 'admin', 'dist');

// Serve static assets if the dist folders exist
app.use(express.static(frontendDist));
app.use('/admin', express.static(adminDist));

// SPA fallback for frontend routes (serve index.html for non-API requests)
app.get(['/app*', '/'], (req, res, next) => {
  // If the file exists in frontendDist, serve it; otherwise fallthrough to API or 404
  res.sendFile(path.join(frontendDist, 'index.html'), err => {
    if (err) next();
  });
});

// SPA fallback for admin routes
app.get('/admin/*', (req, res, next) => {
  res.sendFile(path.join(adminDist, 'index.html'), err => {
    if (err) next();
  });
});

// Simple health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Your other error handlers / middlewares here...

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
