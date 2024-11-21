const ProductSendForm = require("../models/ProductSendForm")
const factory = require("./handlerFactory")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const paginateArray = require("../utils/paginationHelper")

const addFormEntry = catchAsync(async (req, res, next) => {
  const newFormEntry = await ProductSendForm.create({ ...req.body, createdBy: req.user._id })

  res.status(201).json({
    status: "success",
    data: {
      formEntry: newFormEntry
    }
  })
})

const updateFormEntry = catchAsync(async (req, res, next) => {
  const { id } = req.params

  const updateEntry = await ProductSendForm.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  })
  if (!updateEntry) {
    return next(new AppError("No data found", 404))
  }

  res.status(200).json({
    status: "success",
    data: {
      formEntry: updateEntry
    }
  })
})

const getAllProductSendForm = catchAsync(async (req, res, next) => {
  let products
  if (req.user.role === "AD" || req.user.role === "WH") {
    products = await ProductSendForm.find()
  } else {
    products = await ProductSendForm.find({ createdBy: req.user._id })
  }
  const data = paginateArray(products, req.query.page, req.query.limit)
  res.status(200).json({
    status: "success",
    result: products.length,
    data: { data }
  })
})

module.exports = {
  addProductSendForm: addFormEntry,
  putProductSendForm: updateFormEntry,
  deleteProductSendForm: factory.deleteOne(ProductSendForm),
  getProductSendForm: factory.getOne(ProductSendForm),
  // getAllProductSendForms: factory.getAll(ProductSendForm)
  getAllProductSendForms: getAllProductSendForm
}
