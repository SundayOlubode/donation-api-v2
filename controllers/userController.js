const Donations = require('../models/donationModel')
const appError = require('../utils/appError')

/**
 * NOTIFY ADMIN
 */
exports.notifyAdmin = async (req, res, next) => {

    const donor_id = req.user

    const { amount, date } = req.body

    try {

        await Donations.create({
            amount, date, donor_id
        })

        return res.status(200).json({
            status: 'success',
            message: 'You will receive a response soon'
        })

    } catch (error) {
        return next(new appError(error.message, error.statusCode))
    }
}