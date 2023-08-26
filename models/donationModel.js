const mongoose = require('mongoose')
const { Schema } = mongoose

const donationSchema = new Schema({
    amount: Number,
    date: {
        type: Date,
        default: Date.now
    },
    donor_id: { type: mongoose.Types.ObjectId, ref: 'user' },
})

const donationModel = mongoose.model('donation', donationSchema)
module.exports = donationModel;