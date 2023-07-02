const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models')

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: false,
  }, async (username, password, done) => {
    try {
      console.log('LocalStrategy works? ', username, password)
      const exUser = await User.findOne({ where: { userId: username } });
      if (exUser) {
        const pwConfirm = await bcrypt.compare(password, exUser.password);
        if (pwConfirm) {
          done(null, exUser)
        } else {
          done(null, false, { message: "비밀번호가 다릅니다" });
        }
      } else {
        done(null, false, { message: "존재하지 않는 회원입니다." });
      }
    } catch (err) {
      console.error(err);
      done(error);
    }
  }))
}