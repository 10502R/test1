// server1.js (Render 배포용 / Node 20+ / CommonJS)

const express = require('express');
const cors = require('cors');

const app = express();

// ---- Config ----
const PORT = process.env.PORT || 3001;
const ANALYTICS_ORIGIN = process.env.ANALYTICS_URL || 'http://localhost:3002';

// ---- Middleware ----
app.use(cors());               // 필요 시 origin 화이트리스트로 제한
app.use(express.json());

// CSP (개발용: 프록시 대상만 허용)
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    `connect-src 'self' ${ANALYTICS_ORIGIN};`
  );
  next();
});

// ---- Health ----
app.get('/healthz', (_, res) => res.send('ok'));

// ---- Root ----
app.get('/', (_, res) => {
  res.send('Analytics Proxy Server is running!');
});

// ---- Proxy: client → (this server) → analytics server ----

// 1) 수집 프록시 (POST)
app.post('/api/analytics', async (req, res) => {
  try {
    const r = await fetch(`${ANALYTICS_ORIGIN}/track`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const ct = r.headers.get('content-type') || 'text/plain';
    const body = ct.includes('application/json') ? await r.json() : await r.text();

    res.status(r.status).type(ct).send(body);
  } catch (err) {
    console.error('POST /api/analytics proxy error:', err);
    res.status(500).json({ message: 'Internal proxy error' });
  }
});

// 2) 대시보드 조회 프록시 (GET)
app.get('/api/analytics', async (_, res) => {
  try {
    const r = await fetch(`${ANALYTICS_ORIGIN}/api/analytics`, { method: 'GET' });
    const ct = r.headers.get('content-type') || 'application/json';
    const body = ct.includes('application/json') ? await r.json() : await r.text();

    res.status(r.status).type(ct).send(body);
  } catch (err) {
    console.error('GET /api/analytics proxy error:', err);
    res.status(500).json({ message: 'Failed to fetch analytics data' });
  }
});

// ---- Start ----
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server listening on ${PORT} → target ${ANALYTICS_ORIGIN}`);
});
