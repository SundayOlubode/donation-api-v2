const Donations = require('../models/donationModel')
const Users = require('../models/userModel')

/**
 * HANDLE TOKEN & COOKIE RESPONSE
 * @param {*} user 
 * @param {*} statusCode 
 * @param {*} res 
 */
exports.createSendToken = async (user, statusCode, res) => {
  // CREATE JWT WITH MODEL INSTANCE
  const token = await user.createJWT();
  const cookieOptions = {
    expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "None",
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  // SEND TOKEN TO CLIENT
  res.cookie("jwt", token, cookieOptions);

  user.password = undefined

  const data = {
    user,
    token,
  }

  res.status(statusCode).json({
    status: "success",
    data,
  });
};