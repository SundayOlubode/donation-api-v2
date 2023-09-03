const passport = require("passport")
require("dotenv").config()
const appError = require("../utils/appError")
const Users = require("../models/userModel")

//STRATEGIES
const googleStrategy = require("passport-google-oauth2")

const HOSTNAME =
  process.env.NODE_ENV === "production"
    ? `https://${process.env.PROD_DOMAIN}`
    : `http://localhost:${process.env.PORT}`

const GoogleStrategy = googleStrategy.Strategy

// GOOGLE STARTEGY
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${HOSTNAME}/api/v2/auth/google/callback`,
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      const googleDetails = {
        lastname: profile.family_name,
        firstname: profile.given_name,
        googleId: profile.id,
        email: profile.email,
      }

      if (!googleDetails) {
        const error = new appError("User credentials are required!", 401)
        done(error)
      }

      // CHECK IF USER EXISTS OR CREATE USER
      try {
        const oldUser = await Users.findOne({
          googleId: googleDetails.googleId,
        })

        // IF USER EXISTS SEND USER WITH TOKEN
        if (oldUser) {
          const token = await oldUser.createJWT()
          return done(null, { oldUser, token })
        }

        // CREATE USER IF NEW
        const user = await Users.create({ ...googleDetails })
        const token = await user.createJWT()

        done(null, { user, token })
      } catch (error) {
        done(error)
      }
    },
  ),
)

passport.serializeUser((user, done) => {
  done(null, user)
})
