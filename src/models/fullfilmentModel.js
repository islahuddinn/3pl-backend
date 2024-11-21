const mongoose = require("mongoose")

const fulfillmentSchema = new mongoose.Schema({
  createdBy: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true }
  },
  labelUrl: { type: String, default: "" },
  messages: [
    {
      source: { type: String, required: true },
      code: { type: String, required: true },
      text: { type: String, required: true }
    }
  ],
  // metadata: { type: String, default: "" },

  objectCreated: { type: Date, required: true },
  objectId: { type: String, required: true, unique: true },
  objectOwner: { type: String, required: true },
  objectState: { type: String, required: true },
  fulfillmentStatus: { type: String, default: "Pending" },
  objectUpdated: { type: Date, required: true },
  parcel: { type: String, required: true },
  rate: { type: String, required: true },
  status: { type: String, required: true },
  test: { type: Boolean, required: true },
  // customerDataId: {
  //   type: String,
  //   required: true,
  //   default: ""
  // },
  customerDataId: { type: mongoose.Schema.Types.ObjectId, ref: "Extradeliverydata" },
  trackingNumber: { type: String, default: "" },
  trackingStatus: { type: String, default: "UNKNOWN" },
  trackingUrlProvider: { type: String, default: "" }
})

const Fulfillment = mongoose.model("Fulfillment", fulfillmentSchema)

module.exports = Fulfillment
