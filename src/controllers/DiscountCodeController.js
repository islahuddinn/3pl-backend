const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const DiscountCode = require("../models/DiscountCode")

const createDiscountCode = catchAsync(async (req, res, next) => {
  const { code, expiry, isActive, subscriptionDiscount, fullfillmentDiscount } = req.body

  const checkCode = await DiscountCode.findOne({ code })
  if (checkCode) {
    return next(new AppError("Code already exists", 400))
  }

  const discountCode = await DiscountCode.create({
    code,
    expiry: new Date(expiry),
    isActive,
    subscriptionDiscount,
    fullfillmentDiscount
  })

  res.status(201).json({
    status: "success",
    data: {
      discountCode
    }
  })
})

const getAllDiscountCodes = catchAsync(async (req, res, next) => {
  const discountCodes = await DiscountCode.find()

  res.status(200).json({
    status: "success",
    data: {
      discountCodes
    }
  })
})

const getDiscountCode = catchAsync(async (req, res, next) => {
  const { id } = req.params

  const discountCode = await DiscountCode.findById(id)

  if (!discountCode) {
    return next(new AppError("Discount code not found", 404))
  }

  res.status(200).json({
    status: "success",
    data: {
      discountCode
    }
  })
})

const deleteDiscountCode = catchAsync(async (req, res, next) => {
  const { id } = req.params

  const discountCode = await DiscountCode.findByIdAndDelete(id)

  if (!discountCode) {
    return next(new AppError("Discount code not found", 404))
  }

  res.status(204).json({
    status: "success",
    data: null
  })
})

const updateDiscountCode = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const { code, expiry, isActive, subscriptionDiscount, fullfillmentDiscount } = req.body

  const discountCode = await DiscountCode.findById(id)
  if (!discountCode) {
    return next(new AppError("Discount code not found", 404))
  }

  discountCode.code = code || discountCode.code
  discountCode.expiry = expiry || discountCode.expiry
  discountCode.isActive = isActive || discountCode.isActive
  discountCode.subscriptionDiscount = subscriptionDiscount || discountCode.subscriptionDiscount
  discountCode.fullfillmentDiscount = fullfillmentDiscount || discountCode.fullfillmentDiscount

  await discountCode.save()

  res.status(200).json({
    status: "success",
    data: {
      discountCode
    }
  })
})

const validateDiscountCode = catchAsync(async (req, res, next) => {
  const { code } = req.body

  const discountCode = await DiscountCode.findOne({ code })
  if (!discountCode) {
    return next(new AppError("Invalid discount code", 400))
  }
  if (discountCode.expiry < new Date()) {
    return next(new AppError("Discount code has expired", 400))
  }
  if (!discountCode.isActive) {
    return next(new AppError("Discount code is not active", 400))
  }

  res.status(200).json({
    status: "success",
    data: {
      subscriptionDiscount: discountCode.subscriptionDiscount,
      fullfillmentDiscount: discountCode.fullfillmentDiscount
    }
  })
})

module.exports = {
  createDiscountCode,
  getAllDiscountCodes,
  deleteDiscountCode,
  updateDiscountCode,
  getDiscountCode,
  validateDiscountCode
}
