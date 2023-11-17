const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const db = require("../models");
const User = db.User;


const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = "test2";
jwtOptions.passReqToCallback = true;

const jwtStrategy = new JwtStrategy(jwtOptions, async (req, payload, cb) => {
  try {
    const user = await User.findByPk(payload.id);
    if (!user) {
      return cb(null, false);
    }
    req.user = user.toJSON();
    return cb(null, user);
  } catch (err) {
    console.log(err);
  }
});

console.log(jwtOptions);
passport.use(jwtStrategy);

module.exports = passport;
