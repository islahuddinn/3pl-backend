const catchAsync = require("../utils/catchAsync")
const Product = require("../models/Products")
const factory = require("../controllers/handlerFactory")
const AppError = require("../utils/appError")
const paginateArray = require("../utils/paginationHelper")
const User = require("../models/User")

const addProduct = catchAsync(async (req, res, next) => {
  const {
    productName,
    upcCode,
    weight,
    length,
    additionalHeight,
    width,
    quantity,
    skuNumber,
    price,
    variations,
    variationName
  } = req.body

  const userUpcCodes = await Product.distinct("upcCode", { created_by: req.user._id })

  if (!userUpcCodes.includes(upcCode) && userUpcCodes.length >= 10) {
    return res.status(400).json({
      status: "fail",
      message: "Cannot add more than 10 Products"
    })
  }

  const existingProduct = await Product.find({ upcCode })

  if (existingProduct.length >= 3) {
    return res.status(400).json({
      status: "fail",
      message: "Cannot add more than 3 variations under the same Product"
    })
  }

  const variationExists = existingProduct.some(product => product.variations === variations)
  if (variationExists) {
    return res.status(400).json({
      status: "fail",
      message: "Variation already exists for this product"
    })
  }

  const img = req.body?.imageUrl || null
  console.log(img)
  const newProduct = await Product.create({
    productName,
    upcCode,
    weight,
    length,
    additionalHeight,
    width,
    quantity,
    skuNumber,
    variationName,
    price,
    imageUrl: img,
    variations,
    created_by: req.user._id
  })

  res.status(201).json({
    status: "success",
    data: {
      product: newProduct
    }
  })
})

const getAllproducts = catchAsync(async (req, res, next) => {
  let products

  if (req.user.role === "AD" || req.user.role === "WH") {
    if (req.query.companyName) {
      products = await Product.find()
        .populate({
          path: "created_by",
          match: { companyName: req.query.companyName },
          select: "companyName"
        })
        .exec()

      products = products.filter(product => product.created_by)
    } else {
      products = await Product.find().populate({
        path: "created_by",
        select: "companyName"
      })
    }
  } else {
    products = await Product.find({ created_by: req.user._id }).populate({
      path: "created_by",
      select: "companyName"
    })
  }

  const paginatedData = paginateArray(products, req.query.page, req.query.limit)

  res.status(200).json({
    status: "success",
    result: products.length,
    data: { data: paginatedData }
  })
})

const getProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.id
  const product = await Product.findById(productId)
  if (!product) {
    return next(new AppError("No product found with that ID", 404))
  }

  res.status(200).json({
    status: "success",
    data: {
      product
    }
  })
})

const filterProduct = catchAsync(async (req, res, next) => {
  const { companyName } = req.query

  const products = await Product.find()
    .populate({
      path: "created_by",
      match: { companyName }
    })
    .exec()

  const filteredProducts = products.filter(product => product.created_by)

  if (filteredProducts.length === 0) {
    return next(new AppError("No product found for that company", 404))
  }

  const data = paginateArray(filteredProducts, req.query.page, req.query.limit)
  res.status(200).json({
    status: "success",
    result: filteredProducts.length,
    data: { data }
  })
})

module.exports = {
  addProduct,
  getAllproducts,
  getProduct,
  deleteProduct: factory.deleteOne(Product)
}
