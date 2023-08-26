const express = require('express')
const router = express.Router()

const authorize = require('./../middlewares/authorize')
const restrictTo = require('./../middlewares/restrictTo')
const breakdownRouter = require('./breakdownRouter')

const {
    getAllDonations,
} = require('./../controllers/donationController')

router.use('/breakdown', breakdownRouter)

router.use([authorize, restrictTo('admin')])

router.get('/', getAllDonations)

module.exports = router

