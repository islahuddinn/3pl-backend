const express = require("express")

const {
  getAllFulfillments,
  deleteFulfillment,
  createExtraDeliveryData,
  editExtraDeliveryData
} = require("../controllers/fullFillmentController")
const requireAuth = require("../middlewares/requireAuth")
const restrictTo = require("../middlewares/restrictTo")
const { uploadMulter, uploadHandler } = require("../utils/uploadHelper")
const ReferenceUser = require("../utils/ReferenceUser")
const router = express.Router()
router.use(requireAuth)

router.route("/").get(getAllFulfillments)

router.route("/:id").delete(deleteFulfillment)

router.route("/extra").post(createExtraDeliveryData)
router.patch("/extra/:id", editExtraDeliveryData)

module.exports = router
