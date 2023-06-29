const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { Op } = require('sequelize');
const auth = require('../middlewares/auth');
const jwt = require('jsonwebtoken');
const upload = require('../middlewares/uploader');

// 회원가입
router.post('/signup', async (req, res) => {
  try {
    const { userId, nickname, password, email, confirmPassword, introduction } = req.body;
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { nickname: nickname },
          { email: email }
        ]
      }
    })
    if (existingUser) {
      if (nickname === existingUser.nickname) {
        res.status(400).json({ errMessage: "이미 존재하는 닉네임입니다." });
        return;
      } else if (email === existingUser.email) {
        res.status(400).json({ errMessage: "이미 존재하는 이메일입니다." });
        return;
      }
    } else {
      if (password !== confirmPassword) {
        return res.status(400).json({ errMessage: "비밀번호를 확인하여 주십시오." })
      }
    const img = "https://300gram-profile.s3.ap-northeast-2.amazonaws.com/image/1688024615626_%C3%AA%C2%B8%C2%B0%C3%AB%C2%B3%C2%B8%C3%AC%C2%9D%C2%B4%C3%AB%C2%AF%C2%B8%C3%AC%C2%A7%C2%80.png"
    const result = await User.create({ userId, nickname, email, password, introduction, img })
      res.status(201).json({
        message: "회원 가입에 성공하였습니다.",
        data: result
      })
    }
  } catch (err) {
    console.log(err.message)
  }
})


// 로그인
router.post('/login', async (req, res) => {
  const { userId, password } = req.body;
  const user = await User.findOne({ where: { userId: userId } })
  if (!user) {
    return res.status(400).json({ errMessaage: "가입되지 않은 아이디입니다. 아이디를 확인해주세요." });
  } else if (password !== user.password) {
    return res.status(400).json({ errMessage: "비밀번호를 확인해 주세요." });
  }

  const token = jwt.sign({
    userId: user.userId
  }, "customized-secret-key");
  res.cookie("Authorization", `Bearer ${token}`);
  return res.json({ message: "로그인 완료" })
})

// 회원정보 조회
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findOne({ where: { userId: userId } })
  if (!user) {
    return req.status(400).json({ errMessage: "존재하지 않는 사용자입니다." });
  }
  res.status(200).json({
    "userId": user.userId,
    "nickname": user.nickname,
    "introduction": user.introduction,
    "img":user.img
  })
})

// 회원정보 수정
router.put('/:userId', auth, async (req, res) => {
  const userId = req.params.userId;
  const { nickname, password, confirmPassword, email, introduction } = req.body;
  const user = await User.findOne({ where: { userId: userId } });
  const existingUser = await User.findOne({
    where:
      { [Op.or]: [{ nickname: nickname }, { email: email } ] }
  });
  if(existingUser) {
    if (nickname === existingUser.nickname) return res.status(409).json({ errMessage: "이미 존재하는 닉네임입니다." })
    if (email === existingUser.email) return res.status(409).json({ errMessage: "이미 존재하는 이메일입니다." });
  }
  if (!user) return res.status(400).json({ errMessage: "존재하지 않는 사용자입니다." });
  if (password !== confirmPassword) return res.status(400).json({ errMessage: "비밀번호를 확인해 주십시요" });
  if (!email) return res.status(400).json({ errMessage: "이메일을 입력해 주세요" });
  
  await User.update({ nickname: nickname, password: password, email: email, introduction: introduction }, {
    where: {
      userId: userId
    }
  })
  res.status(201).json({ Message: "회원정보가 수정되었습니다." });
})

const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
require("dotenv").config();
const path = require('path');


const s3 = new AWS.S3({
  region: process.env.REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// 회원정보 사진 수정
router.post('/:userId', auth, upload.single('image'), async (req, res) =>{
  const userId = req.params.userId;
  const user = await User.findOne({ where: { userId: userId } });
  if (!user) return res.status(400).json({ errMessage: "존재하지 않는 사용자입니다." });
  console.log(user.img)
  const imgUrl = user.img.substring(56,)
  console.log(imgUrl)
  s3.deleteObject({
    Bucket : process.env.BUCKET_NAME,
    Key : imgUrl
  }, (err, data) => {
    if (err) { throw err; }
    console.log('s3 deleteObject ', data)
  })
  const imageUrl = req.file.location;
  console.log(imageUrl)
  await User.update({ img : imageUrl},{
    where: {
      userId: userId
    }
  })
  res.status(201).json({ Message : "사진이 변경되었습니다."});
});


module.exports = router;