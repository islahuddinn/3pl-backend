const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ContactDataSchema = new Schema(
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

const ContactData = mongoose.model("contactData", ContactDataSchema)
module.exports = ContactData
