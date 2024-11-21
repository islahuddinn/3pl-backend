const Location = require("../models/Location")
const factory = require("./handlerFactory")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

const getLocationUser = catchAsync(async (req, res, next) => {
  // const page = parseInt(req.query.page, 10) || 1;
  // const limit = parseInt(req.query.limit, 10) || 10;
  // const skip = (page - 1) * limit;
  // const location= await Location.find(req.user.role!=="AD"?{_id:{$in:req.user.location}}:{})
  const locations = await Location.find()
  // .skip(skip).limit(limit);

  const count = await Location.countDocuments({})
  res.status(200).json({
    count,
    locations
    // page,
    // totalPages: Math.ceil(count / limit),
  })
  // next(new AppError("server error", 500))
})

module.exports = {
  getLocationUser
  // getFeedbacksByLocation
  // putLocation: factory.updateOne(Location),
  // deleteLocation: factory.deleteOne(Location),
  // getLocation: factory.getOne(Location),
  // getAllLocations: factory.getAll(Location),
}
