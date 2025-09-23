// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;


// CORS: 트래커를 외부 도메인에서 불러가므로 모두 허용 (졸업 프로젝트용)
app.use(cors(
    {origin: "https://lseungju.tistory.com", // 접근 권한을 부여하는 도메인 
    origin: "https://security-record.tistory.com",
     credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
    }));
app.use(express.json());


// 간단한 in-memory 저장 (프로토타입용)
const events = [];


// static 파일 제공 (tracker.js)
app.use(express.static(path.join(__dirname, 'public')));


// 필수 CORS 프리플라이트 처리
app.options('/collect', (req, res) => {
  const origin = req.get('origin');
  if (ALLOWED.has(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Vary', 'Origin');
  }
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res.sendStatus(204);
});

app.post('/collect', (req, res) => {
  const origin = req.get('origin');
  if (ALLOWED.has(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Vary', 'Origin');
  }
  return res.status(200).json({ ok: true });
});


// 대시보드 / 확인용 API
app.get('/events', (req, res) => {
res.json(events);
});


// 간단 상태 확인
app.get('/', (req, res) => {
res.send('Analytics backend is running');
});


app.listen(PORT, () => {
console.log(`Server listening on port ${PORT}`);
});