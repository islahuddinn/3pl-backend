const mongoose = require("mongoose")

// Define the ProductSendForm schema
const productSendFormSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, "Customer Name is required"]
  },
  // contact: {
  //   type: String,
  //   required: [true, "Contact is required"]
  // },
  length: {
    type: Number,
    required: [true, "Length is required"]
  },
  width: {
    type: Number,
    required: [true, "Width is required"]
  },
  height: {
    type: Number,
    required: [true, "Height is required"]
  },
  weight: {
    type: Number,
    required: [true, "Weight is required"]
  },
  courier: {
    type: String,
    required: [true, "Courier is required"]
  },
  shippedDate: {
    type: Date,
    required: [true, "Shipped Date is required"]
  },
  address: {
    type: String,
    required: [true, "Address is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"]
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Created By is required"]
  },
  trackingNumber: {
    type: String,
    required: [true, "Tracking Number is required"]
  }
})

const ProductSendForm = mongoose.model("ProductSendForm", productSendFormSchema)

module.exports = ProductSendForm
