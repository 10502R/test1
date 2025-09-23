// 이 함수는 분석 서버로부터 데이터를 가져와 UI를 업데이트합니다.
async function fetchAnalyticsData() {
  try {
    // 분석 서버의 GET 엔드포인트로 요청을 보냅니다.
    const response = await fetch('http://localhost:3001/api/analytics');
    
    // 응답이 성공적이지 않으면 오류를 던집니다.
    if (!response.ok) {
      throw new Error('데이터를 가져오는 데 실패했습니다.');
    }
    
    // JSON 형태로 응답을 받습니다.
    const data = await response.json(); 
    
    console.log('대시보드로 수신된 데이터:', data);

    // 수신된 데이터로 UI를 업데이트하는 함수를 호출합니다.
    updateDashboardUI(data);
    
  } catch (error) {
    console.error('분석 데이터를 가져오는 중 오류 발생:', error);
  }
}

// HTML 요소를 업데이트하는 함수
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