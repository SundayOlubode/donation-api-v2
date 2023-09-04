const express = require("express")
const router = express.Router()
const authController = require("./../controllers/authController")
const passport = require("passport")

router.post("/signup", authController.signup)

router.post("/login", authController.login)

router.patch("/forgotPassword", authController.forgotPassword)

router.patch("/resetPassword", authController.resetPassword)

//GOOGLE OAUTH
router.get("/google", passport.authenticate("google"))

//OAUTH CALLBACKS
router.get(
  "/google/callback",
  passport.authenticate("google"),
  authController.socialAuth,
)

module.exports = router
