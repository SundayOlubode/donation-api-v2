const express = require('express')
const router = express.Router()

const authorize = require('./../middlewares/authorize')
const donationRouter = require('./donationRouter')

const {
    notifyAdmin,
} = require('./../controllers/userController')

const { getMyDonations } = require('./../controllers/donationController')

router.post('/notify', authorize, notifyAdmin)

router.use('/donations', donationRouter)

router.get('/me/donations', authorize, getMyDonations)

module.exports = router

