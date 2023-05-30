const Donations = require('../models/donationModel')
const Users = require('../models/userModel')
const appError = require('../utils/appError')
const { EmailToAdmin } = require('../utils/emails')


exports.getUserDonations = async (req, res, next) => {

    const userId = req.user
    const user = await Donations.findById(userId).populate('donation')

    console.log('User: ', user);
}

exports.getProfile = async (req, res, next) => {

    const userId = req.user
    const user = await Donations.findById(userId).populate('donation')

    console.log('User: ', user);
}

exports.notifyAdmin = async (req, res, next) => {

    const donor_id = req.user
    const { amount, date } = req.body

    try {

        await Donations.create({
            amount, date, donor_id
        })

        res.status(200).json({
            status: 'success',
            message: 'Admin will be notified, and you will receive a response soon'
        })

    } catch (error) {
        return next(new appError(error.message, error.statusCode))
    }
}