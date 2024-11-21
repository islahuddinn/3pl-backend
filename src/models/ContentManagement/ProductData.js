const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ProductDataSchema = new Schema(
  {
    bannerTitle: {
      type: String,
      required: [true, "Banner Title is required"]
    },
    bannerDescription: {
      type: String,
      required: [true, "Banner Description is required"]
    },
    bannerImage: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
)

const ProductData = mongoose.model("productData", ProductDataSchema)
module.exports = ProductData
