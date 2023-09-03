const Donations = require('../models/donationModel')
const appError = require('../utils/appError')
const Cache = require('../configs/redis')
const logger = require('../utils/logger')
const { EmailToUsers } = require('../utils/emails')
const Users = require('../models/userModel')

/** 
 * GET MY DONATIONS
*/
exports.getMyDonations = async (req, res, next) => {
  try {

    let donations;
    const user_id = req.user

    donations = await Cache.get(`${user_id}-donations`)

    if (donations)
      return returnDataInCache(donations, res)

    donations = await Donations.find({
      donor_id: user_id
    })

    const cacheValue = JSON.stringify(donations)
    await Cache.set(`${user_id}-donations`, cacheValue, { EX: 600 })

    return res.status(200).json({
      status: 'success',
      data: {
        donations
      }
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

    let allDonations;
    allDonations = await Cache.get('allDonations')

    if (allDonations)
      return returnDataInCache(allDonations, res)

    allDonations = await Donations.find()

    let cacheValue = JSON.stringify(allDonations)
    await Cache.set('allDonations', cacheValue, { EX: 600 })

    return res.status(200).json({
      status: 'success',
      data: {
        allDonations
      }
    })

  } catch (error) {
    logger.error(error)
    return next(new appError(error.message, error.statusCode))
  }
}

/**
 * NOTIFY ADMIN
 */
exports.addDonation = async (req, res, next) => {

  const { amount, date, userId } = req.body

  try {

    const user = await Users.findById(userId)

    if (!user) {
      throw new appError('User not found!', 500)
    }

    const donation = await Donations.create({
      amount, date, donor_id: userId
    })

    const url = 'frontend url' //TODO: ADD FE USER PROFILE URL
    await new EmailToUsers(user, url, donation).notifyDonor()

    return res.status(200).json({
      status: 'success',
      message: 'You will receive a mail soon'
    })

  } catch (error) {
    return next(new appError(error.message, error.statusCode))
  }
}

/**
 * RETURN DATA IN CACHE
 */
const returnDataInCache = async (donations, res) => {
  try {

    return res.status(200).json({
      status: 'success',
      data: {
        donations: JSON.parse(donations)
      }
    })

  } catch (error) {
    return next(new appError(error.message, error.statusCode))
  }
}