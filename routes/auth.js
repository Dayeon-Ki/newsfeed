const express = require('express');
const passport = require('passport');
const router = express.Router();


// // local 로그인
// router.post('/login', isNotLoggedIn, (req, res, next) => {
//    passport.authenticate('local', (authError, user, info) => {
//       if (authError) {
//          console.error(authError);
//          return next(authError);
//       }
//       if (!user) {
//          return res.redirect(`/loginError=${info.message}`);
//       }
//       return req.login(user, (loginError) => {
//          if (loginError) {
//             console.error(loginError);
//             return next(loginError);
//          }
//          return res.redirect('/');
//       });
//    })(req, res, next);
// });

// router.get('/logout', isLoggedIn, (req, res) => {
//    req.logout();
//    req.session.destroy();
//    res.redirect('/');
// });

//* 카카오로 로그인하기 라우터 ***********************
//? /kakao로 요청오면, 카카오 로그인 페이지로 가게 되고, 카카오 서버를 통해 카카오 로그인을 하게 되면, 다음 라우터로 요청한다.
router.get('/kakao', passport.authenticate('kakao'));

//? 위에서 카카오 서버 로그인이 되면, 카카오 redirect url 설정에 따라 이쪽 라우터로 오게 된다.
router.get(
   '/kakao/callback',
   //? 그리고 passport 로그인 전략에 의해 kakaoStrategy로 가서 카카오계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.
   passport.authenticate('kakao', {
      failureRedirect: '/', // kakaoStrategy에서 실패한다면 실행
   }),
   // kakaoStrategy에서 성공한다면 콜백 실행
   (req, res) => {
      res.redirect('/loginMain.html');
   },
);

module.exports = router;