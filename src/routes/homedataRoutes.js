const express = require("express")

const {
  addHomeData,
  updateHomeData,
  deleteHomeData,
  getHomeData,
  getAllHomeDatas
} = require("../controllers/homedataController")
const requireAuth = require("../middlewares/requireAuth")
const restrictTo = require("../middlewares/restrictTo")
const { uploadMulter, uploadHandler } = require("../utils/uploadHelper")
const ReferenceUser = require("../utils/ReferenceUser")
const router = express.Router()
// router.use(requireAuth)

router.route("/create-home-data").post(addHomeData)
router.route("/").get(getAllHomeDatas)

router.route("/:id").get(getHomeData).patch(updateHomeData).delete(deleteHomeData)

module.exports = router
