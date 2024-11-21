const express = require("express")
const {
  addProduct,
  getAllproducts,
  getProduct,
  deleteProduct,
  filterProduct
} = require("../controllers/productController")
const requireAuth = require("../middlewares/requireAuth")
const { upload } = require("../middlewares/uploadMiddleware")
const { uploadMulter, uploadHandler } = require("../utils/uploadHelper")
const { deleteOne } = require("../models/order")

const router = express.Router()

router
  .route("/")
  .post(requireAuth, uploadMulter.single("imageUrl"), uploadHandler, addProduct)
  .get(requireAuth, getAllproducts)
// .get(requireAuth ,getAllproducts);

router.route("/:id").get(requireAuth, getProduct).delete(requireAuth, deleteProduct)

module.exports = router
