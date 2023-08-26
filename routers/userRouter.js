const express = require('express')
const router = express.Router()

const authorize = require('./../middlewares/authorize')
const donationRouter = require('./donationRouter')

const { getMyDonations } = require('./../controllers/donationController')

router.use('/donations', donationRouter)

router.get('/me/donations', authorize, getMyDonations)

module.exports = router
