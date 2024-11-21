const InventoryData = require("../models/ContentManagement/InventoryData")
const factory = require("./handlerFactory")
const catchAsync = require("../utils/catchAsync")

module.exports = {
  addInventoryData: factory.createOne(InventoryData),
  updateInventoryData: factory.updateOne(InventoryData),
  deleteInventoryData: factory.deleteOne(InventoryData),
  getInventoryData: factory.getOne(InventoryData),
  getAllInventoryDatas: factory.getAll(InventoryData)
}
