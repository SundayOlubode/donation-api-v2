const jwt = require("jsonwebtoken")
const appError = require("../utils/appError")
const { promisify } = require("util")

const Users = require("../models/userModel")

require("dotenv").config()

const authorize = async (req, res, next) => {
  try {
    let token

    const authHeader = req.headers.authorization
    if (!authHeader)
      throw new appError("You are not logged in, Please Login Again", 403)

    //Save token from authHeader if available
    token = authHeader.split(" ")[1]

    // verify token
    const verifiedToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET,
    )

    //Check if Users exists
    const currentUser = await Users.findById(verifiedToken.user_id)

    if (!currentUser)
      throw new appError("Account Not Found, Please Login again!", 401)

    //Add Users to req object
    req.user = currentUser._id
    next()
  } catch (error) {
    return next(new appError(error.message, error.statusCode))
  }
}

module.exports = authorize
