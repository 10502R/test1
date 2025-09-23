const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

// CORS 정책 허용 (클라이언트의 요청을 받기 위함)
app.use(cors());
app.use(express.json());

// CSP 헤더 설정 (개발용)
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "connect-src 'self' http://localhost:3002;");
  next();
});

// 기본 라우트, 404 방지용
app.get('/', (req, res) => {
  res.send('Analytics Server is running!');
});

// 1. 클라이언트로부터 이벤트 데이터를 받는 POST 엔드포인트
app.post('/api/analytics', async (req, res) => {
  const analyticsServerUrl = 'http://localhost:3002/track';
  const data = req.body; // 클라이언트가 보낸 데이터

  console.log('프록시 서버로 요청이 도착했습니다:', data);

  try {
    // 프록시 서버가 실제 분석 서버에 요청을 보냄 (CORS 문제 없음)
    const response = await axios.post(analyticsServerUrl, data);
    console.log('분석 서버 응답:', response.data);

    // 분석 서버의 응답을 클라이언트에 전달
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('분석 서버 요청 실패:', error.message);
    res.status(500).send({ message: '내부 서버 오류' });
  }
});

// 2. 대시보드가 데이터를 요청하는 GET 엔드포인트 (새로 추가)
app.get('/api/analytics', async (req, res) => {
  try {
    const analyticsServerUrl = 'http://localhost:3002/api/analytics';
    // 프록시 서버가 분석 서버에 GET 요청을 보내 데이터를 받아옵니다.
    const response = await axios.get(analyticsServerUrl);
    // 분석 서버의 응답을 대시보드에 전달합니다.
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('분석 서버 데이터 요청 실패:', error.message);
    res.status(500).send({ message: '데이터를 가져오는 데 실패했습니다.' });
  }
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});