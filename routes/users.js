const express = require("express");
const router = express.Router();
const { User, Follow } = require("../models");
const { Op } = require("sequelize");
const auth = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');



// 회원가입
router.post("/signup", async (req, res) => {
  try {

    const { userId, nickname, password, email, confirmPassword, introduction } = req.body;
    const encrypted = await bcrypt.hash(password, 10)
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ userId: userId }, { nickname: nickname }, { email: email }],
      },
    });
    if (existingUser) {
      if (userId === existingUser.userId) return res.status(400).json({ message: "이미 존재하는 아이디입니다." })
      if (nickname === existingUser.nickname) return res.status(400).json({ message: "이미 존재하는 닉네임입니다." });
      if (email === existingUser.email) return res.status(400).json({ message: "이미 존재하는 이메일입니다." });
    } else {
      if (password !== confirmPassword) {
        return res
          .status(400)
          .json({ message: "비밀번호를 확인하여 주십시오." });
      }

      // 랜덤한 6자리 숫자 생성
      const randomNumber = Math.floor(100000 + Math.random() * 900000);

      // 인증메일 발송
      const transporter = nodemailer.createTransport({
        service: "gmail", // 이메일
        auth: {
          user: "jgim51148@gmail.com", // 발송자 이메일
          pass: "awwfahzbrhrpqxww", // 발송자 비밀번호
        },
      });

      async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: "'Welcome' <jgim51148@gmail.com>", // sender address
          to: email, // list of receivers
          subject: "회원가입 인증 메일", // Subject line
          text: `인증 번호: ${randomNumber}`, // plain text body
          html: `<b>인증 번호: ${randomNumber}</b>`, // html body
        });

        console.log("Message sent: %s", info.messageId);
      }

      main().catch(console.error);

      const result = await User.create({
        userId,
        nickname,
        email,
        password: encrypted,
        introduction,
        randomNumber: randomNumber.toString(),
      });
      res.status(201).json({
        message: "회원 가입에 성공하였습니다.",
        data: result,
      });
    }
  } catch (err) {
    console.log(err.message);
  }
});

// 이메일 인증
router.post("/mail/:userId", async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.params.userId;
    const user = await User.findOne({
      where: { userId },
    });
    // 코드가 아까 보낸 랜덤 숫자랑 일치하면 인증 상태를 true로 업데이트
    if (code === user.randomNumber) {
      user.emailConfirm = true;
      await user.save();

      return res.json({ message: "메일 인증 완료" });
    } else {
      return res
        .status(400)
        .json({ message: "유효하지 않은 인증 코드입니다." });
    }
  } catch (err) {
    console.log(err.message);
  }
});

// 로그인
router.post("/login", async (req, res) => {
  const { userId, password } = req.body;
  const user = await User.findOne({ where: { userId: userId } })
  const passwordOk = await bcrypt.compare(password, user.password)
  if (!user) {
    return res.status(400).json({ message: "가입되지 않은 아이디입니다. 아이디를 확인해주세요." });
  }
  if (user) {
    const passwordOk = await bcrypt.compare(password, user.password)
    if (!passwordOk) return res.status(400).json({ message: "비밀번호를 확인해 주세요." });
    if (!user.emailConfirm) return res.status(401).json({ message: "이메일 인증이 필요합니다." });
  }

  const token = jwt.sign(
    {
      userId: user.userId,
    },
    "customized-secret-key"
  );
  res.cookie("Authorization", `Bearer ${token}`);
  return res.json({ message: "로그인 완료" });
});

// 로그아웃
router.get('/logout', (req, res) => {
  console.log(res)
  return res.clearCookie('Authorization').json({ message: "로그아웃 되었습니다." })
})


// 쿠키받아와서 미들웨어에 디코딩, user정보 넘겨주기
router.get("/currentUser", auth, async (req, res) => {
  const { userId, nickname, email, introduction, createdAt } = res.locals.user;
  res.json({ userId, nickname, email, introduction, createdAt });
});

// 회원정보 조회
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findOne({
    where: { userId: userId },
    include: [{ model: Follow, as: "followers", attributes: ["followerId"] }],
    attributes: ["userId", "nickname", "introduction"]
  })
  if (!user) return res.status(400).json({ message: "존재하지 않는 사용자입니다." });
  res.status(200).json({ user })
})


// 회원정보 수정
router.put("/:userId", auth, async (req, res) => {
  const userId = req.params.userId;
  const { nickname, password, confirmPassword, email, introduction } = req.body;
  const user = await User.findOne({ where: { userId: userId } }); // 현재 사용자
  const encrypted = await bcrypt.hash(password, 10)
  const existingUser = await User.findOne({ // 변경하려는 닉네임, 이메일에 대한 확인
    where: { [Op.or]: [{ nickname: nickname }, { email: email }] },
  });


  if (!user)
    return res.status(400).json({ message: "존재하지 않는 사용자입니다." });
  if (existingUser) {
    if (nickname === existingUser.nickname)
      return res.status(409).json({ message: "이미 존재하는 닉네임입니다." });
    if (email === existingUser.email)
      return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
  }
  if (password !== confirmPassword)
    return res.status(400).json({ message: "비밀번호를 확인해 주십시요" });
  if (!email)
    return res.status(400).json({ message: "이메일을 입력해 주세요" });
  await User.update(
    {
      nickname: nickname,
      password: encrypted,
      email: email,
      introduction: introduction,
    },
    {
      where: {
        userId: userId
      }
    })
  res.status(201).json({ message: "회원정보가 수정되었습니다." });
}
);

// 회원 삭제
router.delete("/:userId", auth, async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findOne({
    where: { userId },
  });
  if (!user)
    return res
      .status(400)
      .json({ message: "잘못된 접근입니다. 존재하지 않는 회원입니다." });
  if (user) {
    if (userId !== user.userId) {
      return res
        .status(400)
        .json({ message: "본인만이 삭제할 수 있습니다." });
    } else {
      await User.destroy({ where: { userId: userId } });
      res
        .status(201)
        .json({ message: "유저 정보가 정상적으로 삭제되었습니다." });
    }
  }
});

// 유저 팔로우 / 취소
router.get('/:userId/follow', auth, async (req, res) => {
  const followeeId = req.params.userId;
  console.log('followeeId:', followeeId)
  const followerId = res.locals.user.userId;
  console.log('followerId: ', followerId)
  const existingFollower = await Follow.findOne({
    where: { [Op.and]: [{ followeeId }, { followerId }] }
  });
  console.log(existingFollower);
  if (existingFollower) {
    Follow.destroy({ where: { [Op.and]: [{ followeeId }, { followerId }] } });
    res.status(201).json({ message: "팔로우가 취소되었습니다." });
  } else {
    Follow.create({ followeeId, followerId });
    res.status(201).json({ message: "해당 유저를 팔로우하였습니다." });
  }
})



module.exports = router;
