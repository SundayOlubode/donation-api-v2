const mongoose = require("mongoose")
const { Schema } = mongoose
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const validator = require("validator")
const appError = require("../utils/appError")

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: [true, "Email already exist!"],
    validate: (value) => {
      if (!validator.isEmail(value))
        throw new appError(`Invalid Email address`, 400)
    },
  },
  password: {
    type: String,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    validator: (value) => {
      if (!validator.isMobilePhone(value))
        throw new appError(`Invalid Phone number`, 400)
    },
  },
  role: {
    type: String,
    default: "donor",
    enum: ["donor", "admin"],
  },
  googleId: {
    type: String,
  },
  passwordToken: String,
  passwordResetExpiry: Date,
})

userSchema.pre("save", async function (next) {
  if (this.password) this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.createJWT = async function () {
  return await jwt.sign({ user_id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  })
}

const userModel = mongoose.model("user", userSchema)
module.exports = userModel
