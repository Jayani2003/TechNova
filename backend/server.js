const express = require('express');
const cors = require('cors');
require('dotenv').config();

const galleryRoutes = require('./routes/galleryRoutes');
const locationRoutes = require('./routes/locationRoutes');
const reviewRoutes  = require('./routes/reviewRoutes');
const authRoutes    = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
 


const packageRoutes = require('./routes/packageRoutes');

const app = express();
const PORT = Number(process.env.PORT || 5000);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const ALLOWED_ORIGINS = [
  FRONTEND_ORIGIN,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));

app.get('/', (_req, res) => res.send('TechNova backend is running.'));
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth',     authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/gallery',  galleryRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/reviews',  reviewRoutes);
 
// ── Global error handler ──────────────────────────────────────────────────────


app.use('/api/packages', packageRoutes);

app.use((err, _req, res, _next) => {
  console.error('Unhandled server error:', err);
  if (err.code === 'ER_DUP_ENTRY')
    return res.status(409).json({ message: 'Duplicate entry.' });
  res.status(500).json({ message: 'Internal server error.' });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));