const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { Op } = require('sequelize');
const auth = require('../middlewares/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// 회원가입
router.post('/signup', async (req, res) => {
  try {
    const { userId, nickname, password, email, confirmPassword, introduction } = req.body;
    const encrypted = await bcrypt.hash(password, 10)
    console.log("encrypted: ", encrypted)
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { userId: userId },
          { nickname: nickname },
          { email: email }
        ]
      }
    })
    if (existingUser) {
      if (userId === existingUser.userId) return res.status(400).json({ errMessage: "이미 존재하는 아이디입니다." })
      if (nickname === existingUser.nickname) return res.status(400).json({ errMessage: "이미 존재하는 닉네임입니다." });
      if (email === existingUser.email) return res.status(400).json({ errMessage: "이미 존재하는 이메일입니다." });
    } else {
      if (password !== confirmPassword) {
        return res.status(400).json({ errMessage: "비밀번호를 확인하여 주십시오." })
      }

      const result = await User.create({ userId, nickname, email, password: encrypted, introduction })
      res.status(201).json({
        message: "회원 가입에 성공하였습니다."
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
  const passwordOk = await bcrypt.compare(password, user.password)
  if (!user) {
    return res.status(400).json({ errMessaage: "가입되지 않은 아이디입니다. 아이디를 확인해주세요." });
  } else if (!passwordOk) {
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
    "introduction": user.introduction
  })
})

// 회원정보 수정
router.put('/:userId', auth, async (req, res) => {
  const userId = req.params.userId;
  const { nickname, password, confirmPassword, email, introduction } = req.body;
  const user = await User.findOne({ where: { userId: userId } });
  const existingUser = await User.findOne({
    where:
      { [Op.or]: [{ nickname: nickname }, { email: email }] }
  });
  if (!user) return res.status(400).json({ errMessage: "존재하지 않는 사용자입니다." });
  if (nickname === existingUser.nickname) return res.status(409).json({ errMessage: "이미 존재하는 닉네임입니다." })
  if (email === existingUser.email) return res.status(409).json({ errMessage: "이미 존재하는 이메일입니다." });
  if (password !== confirmPassword) return res.status(400).json({ errMessage: "비밀번호를 확인해 주십시요" });
  if (!email) return res.status(400).json({ errMessage: "이메일을 입력해 주세요" });
  await User.update({ nickname: nickname, password: password, email: email, introduction: introduction }, {
    where: {
      userId: userId
    }
  })
  res.status(201).json({ Message: "회원정보가 수정되었습니다." });
})

//


module.exports = router;