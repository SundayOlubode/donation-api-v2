const express = require("express")
const router = express.Router()

const authorize = require("./../middlewares/authorize")
const restrictTo = require("./../middlewares/restrictTo")
const donationRouter = require("./donationRouter")

const { getAllUsers } = require("./../controllers/userController")
const { getMyDonations } = require("./../controllers/donationController")

router.get("/all", authorize, restrictTo("admin"), getAllUsers)

router.use("/donations", donationRouter)

router.get("/me/donations", authorize, getMyDonations)

module.exports = router
