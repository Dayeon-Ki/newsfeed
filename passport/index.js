const passport = require('passport');
const kakao = require('./kakaoStrategy'); // 카카오서버로 로그인할때

const { User } = require('../models');

module.exports = () => {

   passport.serializeUser((user, done) => {
      done(null, user.userId);
   });

   passport.deserializeUser((id, done) => {
      //? 두번 inner 조인해서 나를 팔로우하는 followerid와 내가 팔로우 하는 followingid를 가져와 테이블을 붙인다
      User.findOne({ where: { userId: id } })
         .then(user => done(null, user))
         .catch(err => done(err));
   }); 

   kakao(); // 카카오 전략 등록
};