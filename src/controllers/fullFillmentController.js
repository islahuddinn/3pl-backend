const Fulfillment = require("../models/fullfilmentModel")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const paginateArray = require("../utils/paginationHelper")
const ExtraDeliveryData = require("../models/ExtraDeliveryData")

exports.getAllFulfillments = catchAsync(async (req, res, next) => {
  const fulfillments = await Fulfillment.find().populate("customerDataId")

  const data = paginateArray(fulfillments, req.query.page, req.query.limit)

  res.status(200).json({
    status: "success",
    result: data.length,
    data: { data }
  })
})

exports.deleteFulfillment = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const deletedFulfillment = await Fulfillment.findByIdAndDelete(id)
  res.status(204).json({
    status: "success",
    data: deletedFulfillment
  })
})

exports.createExtraDeliveryData = catchAsync(async (req, res, next) => {
  const extraDeliveryData = await ExtraDeliveryData.create(req.body)
  res.status(201).json({
    status: "success",
    data: extraDeliveryData._id
  })
})

exports.editExtraDeliveryData = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const extraDeliveryData = await Fulfillment.findByIdAndUpdate(id, req.body)
  if (!extraDeliveryData) {
    return next(new AppError("No document found with that ID", 404))
  }
  res.status(200).json({
    status: "success",
    data: extraDeliveryData
  })
})
