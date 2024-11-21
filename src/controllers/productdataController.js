const ProductData = require("../models/ContentManagement/ProductData")
const factory = require("./handlerFactory")
const catchAsync = require("../utils/catchAsync")

module.exports = {
  addProductData: factory.createOne(ProductData),
  updateProductData: factory.updateOne(ProductData),
  deleteProductData: factory.deleteOne(ProductData),
  getProductData: factory.getOne(ProductData),
  getAllProductDatas: factory.getAll(ProductData)
}
