const express = require("express")

const {
  updateUser,
  getUser,
  getAllDashboardUsers,
  getAllSubscribedUsers
} = require("../controllers/userController")
const requireAuth = require("../middlewares/requireAuth")
const restrictTo = require("../middlewares/restrictTo")
const { uploadMulter, uploadHandler } = require("../utils/uploadHelper")
const ReferenceUser = require("../utils/ReferenceUser")
const { getAsBool } = require("../utils/helpers")
const { userRepayment } = require("../controllers/authController")
const { createVerificationCheck } = require("../controllers/VerificationController")

const router = express.Router()
router.get("/user-info", requireAuth, getUser)
router.route("/dashboard-users").get(requireAuth, getAllDashboardUsers)
router.route("/subscribed-users").get(requireAuth, getAllSubscribedUsers)
router.patch(
  "/:id",
  requireAuth,
  restrictTo("AD"),
  uploadMulter.single("profileImage"),
  uploadHandler,
  updateUser
)
router.post("/repayment", requireAuth, userRepayment)

router.post(
  "/verification",
  requireAuth,
  uploadMulter.single("imageUrl"),
  uploadHandler,
  createVerificationCheck
)

module.exports = router
