const VerificationCheck = require("../models/VarificationCheck")
const Product = require("../models/Products")
const catchAsync = require("../utils/catchAsync")
const nodemailer = require("nodemailer")
const AppError = require("../utils/appError")

const createVerificationCheck = catchAsync(async (req, res, next) => {
  let { productId, verifiedQuantity, verifiedCondition, discrepancies } = req.body
  discrepancies = JSON.parse(discrepancies)
  const product = await Product.findById(productId)
  if (!product) {
    return next(new AppError("Product not found", 404))
  }

  const newVerification = await VerificationCheck.create({
    ...req.body,
    verifiedBy: req.user._id,
    imageUrl: req.body.imageUrl || null,
    discrepancies
  })

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_HOST_USER,
      pass: process.env.EMAIL_HOST_PASSWORD
    }
  })

  const mailOptions = {
    from: process.env.EMAIL_HOST_USER,
    to: "usmanzafar783@gmail.com",
    subject: "New Verification Check Submitted",
    text:
      `Verification Check Details:\n\n` +
      `Product Name: ${product.productName}\n` +
      `Product ID: ${productId}\n` +
      `Original Product Data:\n` +
      `SKU Number: ${product.skuNumber}\n` +
      `UPC Code: ${product.upcCode}\n` +
      `Price: ${product.price}\n` +
      `Original Quantity: ${product.quantity}\n` +
      `Expected Condition: New\n` +
      `Image URL: ${product.imageUrl}\n\n\n` +
      `Verified Quantity: ${verifiedQuantity}\n` +
      `Verified Condition: ${verifiedCondition}\n` +
      `Discrepancy:\n` +
      `    - Issue Type: ${discrepancies.issueType}\n` +
      `    - Description: ${discrepancies.description}\n`
  }

  await transporter.sendMail(mailOptions)

  return res.status(201).json({
    message: "Verification check created successfully.",
    verification: {
      productId: newVerification.productId,
      productName: newVerification.productName,
      verifiedQuantity: newVerification.verifiedQuantity,
      verifiedCondition: newVerification.verifiedCondition,
      discrepancies: newVerification.discrepancies
    },
    originalProduct: {
      _id: product._id,
      productName: product.productName,
      price: product.price
    }
  })
})

module.exports = {
  createVerificationCheck
}
