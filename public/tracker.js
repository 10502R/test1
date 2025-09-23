// public/tracker.js
// 사용자는 자기 사이트에 아래 줄만 삽입하면 됩니다:
// <script src="https://sitetest-cxaw.onrender.com/tracker.js" async></script>


(function() {
// 배포 후에는 이 URL을 배포된 도메인으로 바꿔주세요.
const TRACKING_URL = 'https://sitetest-cxaw.onrender.com/collect'
    //(function() {
    // 자동으로 현재 스크립트가 로드된 호스트의 /collect로 전송하도록 기본 설정
    //try {
    //const scripts = document.getElementsByTagName('script');
    //const thisScript = scripts[scripts.length - 1];
    //const scriptSrc = thisScript && thisScript.src;
    //if (scriptSrc) {
    //const url = new URL(scriptSrc);
    //return url.origin + '/collect';
    //}
    //} catch(e) {}
    // fallback (로컬 테스트용)
    //return 'http://localhost:3000/collect';
    //})();


function buildPayload() {
return {
event: 'pageview',
url: window.location.href,
referrer: document.referrer,
userAgent: navigator.userAgent,
language: navigator.language,
title: document.title,
ts: Date.now()
};
}


function send(payload) {
// navigator.sendBeacon을 우선 사용 (비동기, 페이지 언로드 시에도 보냄)
try {
const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
if (navigator.sendBeacon) {
navigator.sendBeacon(TRACKING_URL, blob);
return;
}
} catch (e) {}


// fallback: fetch
fetch(TRACKING_URL, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload),
keepalive: true
}).catch(() => {});
}


// 페이지 로드 시 전송
window.addEventListener('load', function() {
const p = buildPayload();
send(p);
});
})();