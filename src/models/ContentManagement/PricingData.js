const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Define the schema for Pricing Details (Shipping Cost and Banner Details)
const PricingSchema = new Schema(
  {
    bannerTitle: {
      type: String,
      required: [true, "Banner Title is required"]
    },
    bannerTitle2: {
      type: String,
      required: [true, "Banner Title 2 is required"]
    },
    bannerDescription: {
      type: String,
      required: [true, "Banner Description is required"]
    },
    bannerImage: {
      type: String,
      required: false
    },
    shippingCost: [
      {
        shippingCostTitle: {
          type: String,
          required: false
        },
        shippingCostDescription: {
          type: String,
          required: false
        }
      }
    ]
  },
  { timestamps: true }
)

const Pricing = mongoose.model("pricing", PricingSchema)
module.exports = Pricing
