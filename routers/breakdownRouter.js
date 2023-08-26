const express = require('express')
const router = express.Router()
const restrictTo = require('./../middlewares/restrictTo')
const authorize = require('./../middlewares/authorize')

const {
    getBreakdown, postDisbursed,
} = require('./../controllers/breakdownController')

router.get('/', authorize, getBreakdown)

router.use([authorize, restrictTo('admin')])

router.patch('/disburse', postDisbursed)

module.exports = router