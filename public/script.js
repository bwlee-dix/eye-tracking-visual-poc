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

// Start 버튼 이벤트 (기존에 있던 부분)
document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("status").textContent = "카메라 활성화 중...";

  // WebGazer 초기화
  webgazer
    .setGazeListener((data, timestamp) => {
      if (data) {
        // 데이터 출력
        console.log(`X: ${data.x}, Y: ${data.y}`);
        // 데이터를 서버로 전송
        sendDataToServer({ x: data.x, y: data.y, timestamp });
        drawCircle(data.x, data.y); // 캔버스에 표시
        drawPath(data.x, data.y); // 경로를 그리기
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

// 캔버스 초기화 (기존 부분 유지)
const canvas = document.getElementById("overlay");
const ctx = canvas.getContext("2d");

let lastX, lastY;

// 눈 위치 표시
function drawCircle(x, y) {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 이전 표시 제거
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
