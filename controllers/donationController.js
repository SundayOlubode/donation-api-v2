const Donations = require("../models/donationModel")
const appError = require("../utils/appError")
const Cache = require("../configs/redis")
const logger = require("../utils/logger")
const { EmailToUsers } = require("../utils/emails")
const Users = require("../models/userModel")
const Breakdown = require("../models/breakdownModel")

/**
 * GET MY DONATIONS
 */
exports.getMyDonations = async (req, res, next) => {
  try {
    let donations
    const user_id = req.user

    donations = await Cache.get(`donations?${user_id}`)

    if (donations) return returnDataInCache(donations, res)

    donations = await Donations.find({
      userId: user_id,
    })

    const cacheValue = JSON.stringify(donations)
    await Cache.set(`donations?${user_id}`, cacheValue, { EX: 600 })

    return res.status(200).json({
      status: "success",
      data: {
        donations,
      },
    })
  } catch (error) {
    return next(new appError(error.message, error.statusCode))
  }
}

/**
 * GET ALL DONATIONS
 */
exports.getAllDonations = async (req, res, next) => {
  try {
    let donations
    donations = await Cache.get("allDonations")

    if (donations) return returnDataInCache(donations, res)

    donations = await Donations.find()

    let cacheValue = JSON.stringify(donations)
    await Cache.set("allDonations", cacheValue, { EX: 60 })

    return res.status(200).json({
      status: "success",
      data: {
        donations,
      },
    })
  } catch (error) {
    logger.error(error)
    return next(error)
  }
}

/**
 * NOTIFY ADMIN
 */
exports.addDonation = async (req, res, next) => {
  const { date, userId } = req.body
  const amount = Number(req.body.amount)

  try {
    const user = await Users.findById(userId)

    if (!user) {
      throw new appError("User not found!", 500)
    }

    const donation = await Donations.create({
      amount,
      date,
      userId,
    })

    // INCREMENT BREAKDOWN BALANCE AND TOTAL WITH DONATION AMOUNT
    const breakdown = await Breakdown.findOne()
    breakdown.total += amount
    breakdown.balance += amount
    await breakdown.save()

    // NOTIFY DONOR - THEIR DONATION RECORDED!
    const url = "https://donation-app-frontend.onrender.com/login"
    await new EmailToUsers(user, url, donation).notifyDonor()

    return res.status(200).json({
      status: "success",
      message: "A mail be will sent to the donor soon",
    })
  } catch (error) {
    return next(error)
  }
}

/**
 * RETURN DATA IN CACHE
 */
const returnDataInCache = async (donations, res) => {
  try {
    return res.status(200).json({
      status: "success",
      data: {
        donations: JSON.parse(donations),
      },
    })
  } catch (error) {
    return next(error)
  }
}
