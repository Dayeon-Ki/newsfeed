const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3004;
const dotenv = require("dotenv");
const passport = require('passport')
const session = require('express-session')

dotenv.config();

const passportConfig = require('./passport');
passportConfig();

const indexRouter = require("./routes");
const authRouter = require('./routes/auth');

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: false }))

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
   session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET,
      cookie: {
         httpOnly: true,
         secure: false,
      },
   }),
);
//! express-session에 의존하므로 뒤에 위치해야 함
app.use(passport.initialize()); // 요청 객체에 passport 설정을 심음
app.use(passport.session()); // req.session 객체에 passport정보를 추가 저장
// passport.session()이 실행되면, 세션쿠키 정보를 바탕으로 해서 passport/index.js의 deserializeUser()가 실행하게 한다.

//* 라우터
app.use('/auth', authRouter); // 카카오로그인
app.use("/api", indexRouter);

app.listen(port, () => {
   console.log(port, "번 포트로 서버 실행 완료");
});
