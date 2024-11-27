const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware 설정
app.use(cors()); // Cross-Origin Resource Sharing 활성화
app.use(bodyParser.json()); // JSON 형식 데이터 처리

// 데이터 수신 엔드포인트
app.post("/data", (req, res) => {
  const { x, y, timestamp } = req.body;

  // 받은 데이터를 콘솔에 출력
  console.log(`Gaze Data Received: X=${x}, Y=${y}, Timestamp=${timestamp}`);

  // 응답 반환
  res.status(200).json({ message: "Data received successfully" });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
