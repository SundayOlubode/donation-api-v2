const mongoose = require('mongoose')
const { Schema } = mongoose

// DISBURSEMENT HISTORY
const disbursementSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    default: 0
  }
})

/**
 * DISBURSEMENT HISTORY
 */
const disburseModel = mongoose.model('disbursement', disbursementSchema)
module.exports = disburseModel;