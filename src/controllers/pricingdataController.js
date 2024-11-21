
const PricingData = require("../models/ContentManagement/PricingData");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");

module.exports = {
  addPricingData: factory.createOne(PricingData),
  putPricingData: factory.updateOne(PricingData),
  deletePricingData: factory.deleteOne(PricingData),
  getPricingData: factory.getOne(PricingData),
  getAllPricingDatas: factory.getAll(PricingData),
};
