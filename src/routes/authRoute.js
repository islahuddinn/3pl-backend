const express = require("express")
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updatePassword,
  resetPasswordFormSubmit,
  resetPasswordBackend
} = require("../controllers/authController")
const requireAuth = require("../middlewares/requireAuth")
const restrictTo = require("../middlewares/restrictTo")
const { uploadMulter, uploadHandler } = require("../utils/uploadHelper")
const ReferenceUser = require("../utils/ReferenceUser")
const { getAsBool } = require("../utils/helpers")

const router = express.Router()
router.post("/register", uploadMulter.single("profileImage"), uploadHandler, registerUser)
router.post("/login", loginUser)
router.post("/forgotPassword", forgotPassword)
router.patch("/updateMyPassword", requireAuth, updatePassword)
if (getAsBool(process.env.RP_SERVER)) {
  router.get("/resetPassword/:token", resetPasswordBackend)
  router.post("/resetPassword/", resetPasswordFormSubmit)
} else {
  router.patch("/resetPassword/:token", resetPassword)
}

module.exports = router
