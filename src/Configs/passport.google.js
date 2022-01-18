const GoogleStrategy = require("passport-google-oauth2").Strategy
const passport = require("passport")
require("dotenv").config()
const { newToken } = require("../Controllers/auth.controller")
// const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../Models/user.model")
const { v4: uuidv4 } = require("uuid")

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "280625541145-vm633gtro3p4ma9vta76je3gnmquk244.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "https://overstock-2.herokuapp.com/auth/google/callback",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      let user = await User.findOne({ email: profile?._json?.email })
      if (!user) {
        user = await User.create({
          name: profile?._json?.name,
          email: profile?._json?.email,
          password: uuidv4(),
          confirmed: true,
          profilePic: profile?._json?.picture,
        })
      }

      const token = newToken(user)

      return done(null, { token, user })
    }
  )
)

// passport.use(new FacebookStrategy({
//   clientID: process.env.FACEBOOK_APP_ID,
//   clientSecret: process.env.FACEBOOK_APP_SECRET,
//   callbackURL: "https://localhost:2001/auth/facebook/callback",
//   profileFields: ['id', 'displayName', 'photos', 'email']
// },
// function(accessToken, refreshToken, profile, cb) {
//     return cb(err, "rahul");
// }
// ));

module.exports = passport