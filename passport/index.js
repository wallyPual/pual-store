const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const POOL = require('../database');

const { QUERY } = POOL;

module.exports = () => {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      const [user] = await QUERY`SELECT * FROM users WHERE id = ${id}`;
      done(null, user);
    } catch (err) {
      console.log(err);
    }
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async function (email, password, done) {
        try {
          const [
            user,
          ] = await QUERY`SELECT * FROM users WHERE email = ${email} AND password = ${password}`;

          if (user) {
            return done(null, user);
          } else {
            return done(null, false, { message: '아이디 또는 비밀번호가 일치 하지 않습니다.' });
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};