const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;
const dotenv = require('dotenv');

const uploaderRouter = require('./routes/upload');

dotenv.config();

const indexRouter = require('./routes');

app.use(express.json());
app.use(cookieParser());

app.use('/image', uploaderRouter);
app.use('/api', indexRouter);



app.listen(port, () => {
  console.log(port, '번 포트로 서버 실행 완료')
})