
const HomeData = require("../models/ContentManagement/HomeData");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");



exports.createHomeData = catchAsync(async(req, res)=>{
const {homeData }= req.body;
const newHomeData = await HomeData.create(homeData);
console.log(newHomeData, "Here is the created home data");

})

module.exports = {
  addHomeData: factory.createOne(HomeData),
  updateHomeData: factory.updateOne(HomeData),
  deleteHomeData: factory.deleteOne(HomeData),
  getHomeData: factory.getOne(HomeData),
  getAllHomeDatas: factory.getAll(HomeData),
};
