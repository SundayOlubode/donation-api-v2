const mongoose = require("mongoose")
require("dotenv").config()
const appError = require("../utils/appError")
const logger = require("../utils/logger")

const url =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URL
    : process.env.DEV_MONGO_URL

const connectDB = async () => {
  try {
    await mongoose.connect(url)
    logger.info("DB Connected!")
  } catch (error) {
    return new appError(error.message, 500)
  }
}

const db = {
  init: () => {
    connectDB()
  },
}

module.exports = db
