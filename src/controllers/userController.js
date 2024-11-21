const User = require("../models/User")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const paginateArray = require("../utils/paginationHelper")

const getUser = catchAsync(async (req, res, next) => {
  const { _id } = req.user

  const response = await User.findById(_id)
  res.status(200).send(response)
})

const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const user = await User.findById(id)
  if (!user) {
    return next(new AppError("No user found with that ID", 404))
  }

  if (req.body.email && req.body.email !== user.email) {
    const checkEmail = await User.findOne({ email: req.body.email })
    if (checkEmail) {
      return next(new AppError("Email already exists", 400))
    }
  }
  user.companyName = req.body.companyName || user.companyName
  user.address = req.body.address || user.address
  user.city = req.body.city || user.city
  user.state = req.body.state || user.state
  user.zipCode = req.body.zipCode || user.zipCode
  user.userName = req.body.userName || user.userName
  user.position = req.body.position || user.position
  user.phoneNumber = req.body.phoneNumber || user.phoneNumber
  user.email = req.body.email || user.email
  user.country = req.body.country || user.country
  user.personName = req.body.personName || user.personName
  user.profileImage = req.body?.profileImage || user.profileImage
  user.role = req.body.role || user.role
  user.fullfillmentDiscount = req.body.fullfillmentDiscount || user.fullfillmentDiscount || 0

  await user.save()
  res.status(200).json({
    status: "success",
    data: user
  })
})

const getAllDashboardUsers = catchAsync(async (req, res) => {
  const dashboardUsers = await User.find({ role: { $ne: "AD" } })

  const data = paginateArray(dashboardUsers, req.query.page, req.query.limit)
  res.status(200).json({
    status: "success",
    result: dashboardUsers.length,
    data: { data }
  })
})
const getAllSubscribedUsers = catchAsync(async (req, res) => {
  const subscribedUsers = await User.find({ paymentStatus: "true" })
  const data = paginateArray(subscribedUsers, req.query.page, req.query.limit)
  res.status(200).json({
    status: "success",
    result: subscribedUsers.length,
    data: { data }
  })
})

module.exports = {
  updateUser,
  getUser,
  getAllDashboardUsers,
  getAllSubscribedUsers
}
