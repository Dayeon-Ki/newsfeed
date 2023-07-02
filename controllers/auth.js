const bcrypt = require('bcrypt');
const passport = require('passport');
const { User } = require('../models');


exports.join = async (req, res, next) => {
  const { userId, password, confirmPassword, nickname, email, introduction } = req.body;
  const encrypted = await bcrypt.hash(password, 10)
  try {
    const exUser = await User.findOne({
      where: {
        [Op.or]: [{ userId: userId }, { nickname: nickname }, { email: email }],
        [Op.or]: [{ userId: userId }, { nickname: nickname }, { email: email }],
      },
    });
    if (exUser) {
      if (userId === exUser.userId) return res.status(400).json({ message: "이미 존재하는 아이디입니다." })
      if (nickname === exUser.nickname) return res.status(400).json({ message: "이미 존재하는 닉네임입니다." });
      if (email === exUser.email) return res.status(400).json({ message: "이미 존재하는 이메일입니다." });
    } else {
      if (password !== confirmPassword) {
        return res.status(400).json({ message: '비밀번호를 확인하여 주십시오.' });
      }
    }
    // 랜덤한 6자리 숫자 생성
    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    // 인증메일 발송
    const transporter = nodemailer.createTransport({
      service: 'gmail', // 이메일
      auth: {
        user: 'jgim51148@gmail.com', // 발송자 이메일
        pass: 'awwfahzbrhrpqxww', // 발송자 비밀번호
      },
    });

    async function main() {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: "'Welcome' <jgim51148@gmail.com>", // sender address
        to: email, // list of receivers
        subject: '회원가입 인증 메일', // Subject line
        text: `인증 번호: ${randomNumber}`, // plain text body
        html: `<b>인증 번호: ${randomNumber}</b>`, // html body
      });
    }

    main().catch(console.error);

    const result = await User.create({
      userId,
      nickname,
      email,
      password: encrypted,
      introduction,
      randomNumber: randomNumber.toString(),
      img: null
    });
    res.status(201).json({
      message: '회원 가입에 성공하였습니다. 이메일 인증을 진행해주세요.',
    });



  } catch (err) {
    console.error(err);
    return next(err);
  }
}

exports.login = (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    console.log('???')
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      console.log('존재하지 않는 사용자입니다.')
      return res.json({ message: "존재하지 않는 사용자입니다." });
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      console.log('로그인 되었습니다.')
      res.json({ message: "로그인 되었습니다." })
      // return res.redirect('/myInfo.html')
    })
  })(req, res, next);
}

exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect('/');
  })
}