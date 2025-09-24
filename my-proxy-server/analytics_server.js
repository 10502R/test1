const express = require('express');
const app = express();
const PORT = 3002;

// 데이터를 저장할 배열
const analyticsData = [];

app.use(express.json());

// CSP 정책 완화(개발용)
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "connect-src 'self' https://proxy-server-g0u8.onrender.com/;");
  next();
});

// 기본 라우트, 404 방지용
app.get('/', (req, res) => {
  res.send('Analytics Server is running!');
});

// 1. 데이터 수집 엔드포인트 (POST)
app.post('/track', (req, res) => {
  const eventData = req.body;
  console.log('분석 서버로 데이터가 수신되었습니다:', eventData);

  // 수신된 데이터를 배열에 저장
  analyticsData.push(eventData);

  res.status(200).send({ message: '이벤트 수신 성공' });
});

// 2. 대시보드가 데이터를 요청할 엔드포인트 (GET)
app.get('/api/analytics', (req, res) => {
  // 저장된 모든 데이터를 JSON 형태로 응답
  res.status(200).json(analyticsData);
});

app.listen(PORT, () => {
  console.log(`분석 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});