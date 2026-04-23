const express = require('express');
const cors = require('cors');
require('dotenv').config();

const reviewRoutes = require('./routers/reviewRoutes');

const app = express();
const PORT = Number(process.env.PORT || 5000);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
	res.json({ ok: true, service: 'backend', time: new Date().toISOString() });
});

app.use('/api/reviews', reviewRoutes);

app.use((err, _req, res, _next) => {
	console.error('Unhandled server error:', err);
	res.status(500).json({ message: 'Internal server error.' });
});

app.listen(PORT, () => {
	console.log(`Backend running on http://localhost:${PORT}`);
});
