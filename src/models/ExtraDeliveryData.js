const mongoose = require("mongoose")
const ExtraDeliveryDataSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  zip: { type: String, default: "" },
  productDetails: { type: String, default: "" },
  email: { type: String, default: "" },
  company: { type: String, default: "" },
  apt: { type: String, default: "" },
  country: { type: String, default: "" },
  quantity: { type: String, default: "" },

  address_from: {
    name: { type: String, default: "" },
    street1: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zip: { type: String, default: "" },
    country: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" }
  },
  address_to: {
    name: { type: String, default: "" },
    street1: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zip: { type: String, default: "" },
    country: { type: String, default: "" }
  },
  parcels: [
    {
      length: { type: String, default: "" },
      width: { type: String, default: "" },
      height: { type: String, default: "" },
      distanceUnit: { type: String, default: "cm" },
      weight: { type: String, default: "" },
      massUnit: { type: String, default: "kg" }
    }
  ],
  productQuantityArray: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product id is required"]
      },
      productName: {
        type: String,
        default: ""
      },
      quantity: {
        type: Number,
        default: 0
      },
      upcCode: {
        type: String,
        default: ""
      },
      price: {
        type: Number,
        default: 0
      },
      imageUrl: {
        type: String,
        default: ""
      },
      variationName:{
        type:String,
        default:""
      }
    }
  ]
})
const ExtraDeliveryData = mongoose.model("Extradeliverydata", ExtraDeliveryDataSchema)
module.exports = ExtraDeliveryData
