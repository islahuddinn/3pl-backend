const mongoose = require("mongoose")

const discountCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Code is required"],
    unique: [true, "Code must be unique"]
  },
  expiry: { type: Date, required: [true, "Expiry date required"] },
  isActive: { type: Boolean, default: false },
  subscriptionDiscount: {
    type: Number,
    required: [true, "Subscription discount required"]
  },
  fullfillmentDiscount: {
    type: Number,
    required: [true, "Fullfillment discount required"]
  }
})

const DiscountCode = mongoose.model("DiscountCode", discountCodeSchema)

module.exports = DiscountCode
