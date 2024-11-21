const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true
    },

    upcCode: {
      type: String,
      required: [true, "UPC code is required"],
      trim: true
    },
    weight: {
      type: String,
      required: [true, "Weight is required"]
    },
    length: {
      type: String,
      required: [true, "Length is required"]
    },
    additionalHeight: {
      type: String,
      required: [true, "Height is required"]
    },
    width: {
      type: String,
      required: [true, "Width is required"]
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"]
    },
    skuNumber: {
      type: String,
      required: [true, "SKU number is required"]
    },
    price: {
      type: Number,
      required: [true, "Price is required"]
    },
    imageUrl: {
      type: String
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user reference is required"]
    },

    variations: {
      type: String,
      required: [true, "Variation name is required"],
      enum: ["Variation1", "Variation2", "Variation3"]
    },
    variationName: {
      type: String,
      required: [true, "Variation name is required"]
    }
  },
  { timestamps: true }
)

productSchema.pre("save", async function (next) {
  const Product = mongoose.model("Product")

  const userUpcCodes = await Product.distinct("upcCode", {
    created_by: this.created_by
  })

  if (!userUpcCodes.includes(this.upcCode) && userUpcCodes.length >= 10) {
    return next(new Error("Each user can only have up to 10 unique UPC codes"))
  }

  next()
})

const Product = mongoose.model("Product", productSchema)
module.exports = Product
