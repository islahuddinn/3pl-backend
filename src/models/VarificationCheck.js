const mongoose = require("mongoose")

const VerificationCheckSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"]
    },
    productName: {
      type: String,
      required: [true, "Product name is required"]
    },
    verifiedQuantity: {
      type: Number,
      required: [true, "Verified quantity is required"]
    },
    verifiedCondition: {
      type: String,
      enum: ["New", "Used", "Damaged"],
      required: [true, "Verified condition is required"]
    },
    discrepancies: {
      issueType: {
        type: String,
        enum: ["Quantity Mismatch", "Damaged", "Incorrect Item", "other"],
        required: [true, "Issue type is required"]
      },
      description: {
        type: String,
        required: [true, "Description is required"]
      }
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Verified by is required"]
    },
    verificationDate: {
      type: Date,
      default: Date.now
    },
    imageUrl: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("VerificationCheck", VerificationCheckSchema)
