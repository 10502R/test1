// 프록시 서버의 API 엔드포인트
const proxyServerUrl = 'https://proxy-server-g0u8.onrender.com/api/analytics';

// 데이터 받아와서 페이지뷰 수 표시
async function fetchAnalyticsData() {
  try {
    const response = await fetch(proxyServerUrl);
    if (!response.ok) throw new Error('네트워크 오류');
    const data = await response.json();
    // 페이지뷰 이벤트만 필터링
    const pageviewCount = data.filter(event => event.eventName === 'pageview').length;
    // HTML에 반영
    const countElem = document.getElementById('total-pageviews-count');
    if (countElem) countElem.textContent = pageviewCount;
  } catch (err) {
    console.error('페이지뷰 데이터 가져오기 실패:', err);
  }
}

// 페이지 로드 시 실행
window.addEventListener('DOMContentLoaded', fetchAnalyticsData);

// HTML 요소를 업데이트하는 함수d
function updateDashboardUI(data) {
  // 총 페이지뷰 수를 계산하여 HTML에 표시
  const pageviewCount = data.filter(event => event.eventName === 'pageview').length;
  const totalPageviewsElement = document.getElementById('total-pageviews-count');
  if (totalPageviewsElement) {
    totalPageviewsElement.textContent = pageviewCount;
  }
}

// 페이지가 로드될 때 fetchAnalyticsData 함수를 호출합니다.
window.onload = fetchAnalyticsData;