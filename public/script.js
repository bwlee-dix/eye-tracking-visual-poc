// 데이터 저장소
const gazePoints = [];
let heatmapInstance = null;

// 서버로 데이터 전송
function sendDataToServer(data) {
  fetch("http://localhost:3000/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => console.log(result.message))
    .catch((error) => console.error("Error sending data:", error));
}

// 히트맵 초기화
function initHeatmap() {
  const heatmapContainer = document.getElementById("heatmap-container");
  heatmapContainer.style.width = "100vw";
  heatmapContainer.style.height = "80vh";
  heatmapContainer.style.position = "absolute";
  heatmapContainer.style.top = "20%";
  heatmapContainer.style.opacity = "0.5";

  heatmapInstance = h337.create({
    container: heatmapContainer,
    maxOpacity: 0.8,
    radius: 50, // 반경 증가
    blur: 0.85, // 블러 효과 추가
  });
}

document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("status").textContent = "카메라 활성화 중...";
  document.getElementById("start-btn").style.display = "none";
  document.getElementById("stop-btn").style.display = "inline-block";

  // 히트맵 초기화
  initHeatmap();

  // WebGazer 설정
  // webgazer.setConfig("dataCollectionRate", 10); // 데이터 수집 빈도 더 자주
  // webgazer.setConfig("showVideoPreview", true);
  webgazer.params.showGazeDot = true;
  webgazer.params.calibrationDelay = 500;

  // 무제한 데이터 수집을 위한 설정 (가능한 경우)
  if (webgazer.params) {
    webgazer.params.maxPointsPerSample = Infinity;
  }

  // WebGazer 초기화
  webgazer
    .setGazeListener((data, timestamp) => {
      if (data) {
        console.log(`X: ${data.x}, Y: ${data.y}`);

        const point = {
          x: data.x,
          y: data.y,
          value: 3, // 값을 높게 설정하여 히트맵 강도 증가
        };
        gazePoints.push(point);

        // sendDataToServer({ x: data.x, y: data.y, timestamp });

        // 캔버스에 표시
        drawCircle(data.x, data.y);
        drawPath(data.x, data.y);

        // 히트맵 업데이트
        if (heatmapInstance) {
          heatmapInstance.addData(point);
        }
      }
    })
    .begin()
    .then(() => {
      document.getElementById("status").textContent = "아이트래킹 시작!";
    })
    .catch((err) => {
      console.error(err);
      document.getElementById("status").textContent = "카메라 접근 실패!";
    });
});

// Stop Tracking 버튼 이벤트 리스너
document.getElementById("stop-btn").addEventListener("click", () => {
  webgazer.clearGazeListener(); // gaze listener 제거
  webgazer.end(); // WebGazer 종료

  document.getElementById("status").textContent = "아이트래킹 중지됨.";
  document.getElementById("stop-btn").style.display = "none";
  document.getElementById("start-btn").style.display = "inline-block";

  // 히트맵 초기화 (선택사항)
  if (heatmapInstance) {
    heatmapInstance.setData({ max: 0, data: [] });
  }

  // 캔버스 초기화
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  lastX = undefined;
  lastY = undefined;
});

// 캔버스 초기화
const canvas = document.getElementById("overlay");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.8;

let lastX, lastY;

// 눈 위치 표시
function drawCircle(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();
}

// 경로 그리기
function drawPath(x, y) {
  if (lastX !== undefined && lastY !== undefined) {
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  lastX = x;
  lastY = y;
}

// 윈도우 크기 조정 시 캔버스 크기 조정
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.8;
});
