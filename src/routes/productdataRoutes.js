const express = require("express")

const {
  addProductData,
  updateProductData,
  deleteProductData,
  getProductData,
  getAllProductDatas
} = require("../controllers/productdataController")
const requireAuth = require("../middlewares/requireAuth")
const restrictTo = require("../middlewares/restrictTo")
const { uploadMulter, uploadHandler } = require("../utils/uploadHelper")
const ReferenceUser = require("../utils/ReferenceUser")

const router = express.Router()
router.use(requireAuth)
router.route("/add-product-data").post(addProductData)
router.route("/").get(getAllProductDatas)

router.route("/:id").get(getProductData).patch(updateProductData).delete(deleteProductData)

module.exports = router
