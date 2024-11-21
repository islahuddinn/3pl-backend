const mongoose = require("mongoose")
const Schema = mongoose.Schema

const InventoryDataSchema = new Schema(
  {
    bannerTitle: {
      type: String,
      required: true
    },
    bannerDescription: {
      type: String,
      required: true
    },
    bannerImage: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
)

const InventoryData = mongoose.model("inventoryData", InventoryDataSchema)
module.exports = InventoryData
