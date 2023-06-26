const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3004;
const dotenv = require("dotenv");

dotenv.config();

const indexRouter = require("./routes");

app.use(express.json());
app.use(cookieParser());

app.use("/api", indexRouter);

app.listen(port, () => {
  console.log(port, "번 포트로 서버 실행 완료");
});
