const express = require("express")

const {
  addProductSendForm,
  putProductSendForm,
  deleteProductSendForm,
  getProductSendForm,
  getAllProductSendForms
} = require("../controllers/productsendformController")
const requireAuth = require("../middlewares/requireAuth")
const restrictTo = require("../middlewares/restrictTo")
const { uploadMulter, uploadHandler } = require("../utils/uploadHelper")
const ReferenceUser = require("../utils/ReferenceUser")

const router = express.Router()
router.route("/").post(requireAuth, addProductSendForm).get(requireAuth, getAllProductSendForms)

router
  .route("/:id")
  .get(requireAuth, getProductSendForm)
  .put(requireAuth, putProductSendForm)
  .delete(requireAuth, deleteProductSendForm)

module.exports = router
