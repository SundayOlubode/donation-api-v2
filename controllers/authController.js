const appError = require("../utils/appError")
const Users = require("../models/userModel")
const { createSendToken } = require("../utils/createSendToken")
const { createPasswdResetToken } = require("../utils/tokens")
const { EmailToUsers } = require("../utils/emails")
require("dotenv").config()
const crypto = require("crypto")

/**
 * SIGNUP
 */
exports.signup = async (req, res, next) => {
  const { email, password, confirmPassword, firstname, lastname, role } =
    req.body

  try {
    if (!(password === confirmPassword)) {
      throw new appError("Password and Confirm Password must be same", 400)
    }

    if (!(email && password && firstname && lastname)) {
      throw new appError("Please provide full sign up details", 400)
    }

    const oldUser = await Users.findOne({ email })
    if (oldUser) throw new appError("User already exists. Please login", 409)

    const user = await Users.create({
      email,
      password,
      firstname,
      lastname,
      role,
    })

    // SEND WELCOME MAIL
    let url = process.env.WELCOMEURL
    await new EmailToUsers(user, url).sendWelcome()

    return createSendToken(user, 201, res)
  } catch (error) {
    return next(error)
  }
}

/**
 * LOGIN
 */
exports.login = async (req, res, next) => {
  const { email, password } = req.body

  try {
    if (!(email || password)) {
      throw new appError("Please provide login details", 400)
    }

    const user = await Users.findOne({ email })
    // CHECK IF USER EXISTS WITHOUT LEAKING EXTRA INFOS
    if (!user || !(await user.isValidPassword(password))) {
      throw new appError("Email or Password incorrect", 401)
    }

    return createSendToken(user, 201, res)
  } catch (error) {
    return next(error)
  }
}

/**
 * FORGOT PASSWORD
 */
exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body

  try {
    const user = await Users.findOne({ email })
    if (!user) throw new appError("User not found!", 401)

    // IF USER IS OAUTH USER
    if (!user.password) throw new appError("Kindly sign in with Google!", 401)

    const { resetToken, passwordToken, passwordResetExpiry } =
      createPasswdResetToken()

    user.passwordToken = passwordToken
    user.passwordResetExpiry = passwordResetExpiry

    await user.save()

    //SEND MAIL TO USER TO RESET PASSWORD
    const resetUrl = `${req.protocol}://${req.get(
      "host",
    )}/api/v2/auth/resetpassword/${resetToken}`

    // SEND EMAIL TO CLIENT
    await new EmailToUsers(user, resetUrl).sendPasswordReset()

    return res.status(200).json({
      status: "success",
      message: `Token sent to mail ${resetUrl}`,
    })
  } catch (error) {
    return next(error)
  }
}

/**
 * RESET PASSWORD
 */
exports.resetPassword = async (req, res, next) => {
  // CREATE A HASHED TOKEN FROM THE REQ PARAMS
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex")

  try {
    const user = await Users.findOne({
      passwordToken: hashedToken,
      passwordResetExpiry: { $gte: Date.now() },
    })

    if (!user)
      throw new appError("Expired or Invalid Token! Please try again", 403)

    const password = req.body.password
    const confirmPassword = req.body.confirmPassword

    if (!(password === confirmPassword)) {
      throw new appError("Password and ConfirmPassword must be same", 403)
    }

    user.password = password
    user.passwordToken = null
    user.passwordResetExpiry = null

    await user.save()

    const url = `${req.protocol}://${req.get("host")}/api/v2/auth/login`
    // SEND SUCCESS MAIL TO CLIENT
    await new EmailToUsers(user, url).sendVerifiedPSWD()

    // LOG IN USER AND SEND JWT
    return createSendToken(user, 200, res)
  } catch (error) {
    return next(error)
  }
}

exports.socialAuth = async (req, res, next) => {
  try {
    // OBTAIN USER DETAILS FROM SESSION
    const {
      user: { user, token, oldUser },
    } = req.session.passport

    const cookieOptions = {
      expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
      httpOnly: true,
    }
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true

    // Send token to client
    await res.cookie("jwt", token, cookieOptions)

    // SEND WELCOME MAIL
    if (user) {
      //IF NEW USER
      let url = process.env.WELCOMEURL
      await new EmailToUsers(user, url).sendWelcome()
    }

    const data = {
      user,
      oldUser,
      token,
    }

    return res.status(200).json({
      status: "success",
      data,
    })
  } catch (error) {
    return next(error)
  }
}
