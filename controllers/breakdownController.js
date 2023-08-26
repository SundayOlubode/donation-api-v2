const Breakdown = require('../models/breakdownModel')
const appError = require('../utils/appError')
const Disbursement = require('../models/disburseModel')
const Cache = require('../configs/redis')

/** GET BREAKDOWN
 */
exports.getBreakdown = async (req, res, next) => {

    try {
        
        let breakdown;
        breakdown = await Cache.get('breakdown')

        if (breakdown) {
            breakdown = JSON.parse(breakdown)
            return res.status(200).json({
                status: 'success',
                data: {
                    breakdown
                }
            })
        }

        breakdown = await Breakdown.findOne()

        await Cache.set('breakdown', JSON.stringify(breakdown))

        return res.status(200).json({
            status: 'success',
            message: 'Donation Breakdown',
            data: {
                breakdown
            }
        })
    } catch (error) {
        return next(new appError(error.message, error.statusCode))
    }
}


/* POST DISBURSE 
 */
exports.postDisbursed = async (req, res, next) => {
    try {

        let { amount } = req.body
        amount = Number(amount)

        const breakdown = await Breakdown.findOne()

        if (amount > breakdown.balance) {
            throw new appError('Disbursement Greater Than Balance!', 400)
        }

        breakdown.disbursed += amount
        breakdown.balance = breakdown.total - breakdown.disbursed

        await Disbursement.create({ amount, balance: breakdown.balance })
        await breakdown.save()

        await Cache.set('breakdown', JSON.stringify(breakdown))

        return res.status(200).json({
            status: 'success',
            message: 'Disbursed successfully!'
        })

    } catch (error) {
        return next(new appError(error.message, error.statusCode))
    }
}

