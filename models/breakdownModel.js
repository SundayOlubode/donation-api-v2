const mongoose = require("mongoose")
const { Schema } = mongoose

const breakdownSchema = new Schema({
  total: {
    type: Number,
    default: 0,
  },
  disbursed: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    default: 0,
  },
})

const breakdownModel = mongoose.model("breakdown", breakdownSchema)
module.exports = breakdownModel
