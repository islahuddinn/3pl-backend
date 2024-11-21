const express = require("express")

const {
  addInventoryData,
  updateInventoryData,
  deleteInventoryData,
  getInventoryData,
  getAllInventoryDatas
} = require("../controllers/inventorydataController")
const requireAuth = require("../middlewares/requireAuth")
const restrictTo = require("../middlewares/restrictTo")
const { uploadMulter, uploadHandler } = require("../utils/uploadHelper")
const ReferenceUser = require("../utils/ReferenceUser")

const router = express.Router()
router.use(requireAuth)
router.route("/add-inventory-data").post(addInventoryData)
router.route("/").get(getAllInventoryDatas)

router.route("/:id").get(getInventoryData).patch(updateInventoryData).delete(deleteInventoryData)

module.exports = router
