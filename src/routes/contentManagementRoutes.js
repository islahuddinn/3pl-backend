const express = require("express")
const requireAuth = require("../middlewares/requireAuth")
const restrictTo = require("../middlewares/restrictTo")
const { uploadMulter, uploadHandler } = require("../utils/uploadHelper")
const {
  addHomeContent,
  updateHomeContent,
  addPricingContent,
  updatePricngContent,
  addProductContent,
  updateProductContent,
  addContactContent,
  updateContactContent,
  addInventoryContent,
  updateInventoryContent,
  getHomeContent,
  getPricingContent,
  getProductContent,
  getInventoryContent,
  getContactContent
} = require("../controllers/contentManagementController")

const router = express.Router()

// router.use(requireAuth)

router
  .route("/home")
  .post(
    uploadMulter.fields([
      { name: "bannerImage", maxCount: 1 },
      { name: "bannerVideo", maxCount: 1 }
    ]),
    uploadHandler,
    addHomeContent
  )
  .get(getHomeContent)
router.route("/home/:id").patch(
  uploadMulter.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "bannerVideo", maxCount: 1 }
  ]),
  uploadHandler,
  updateHomeContent
)

router
  .route("/pricing")
  .post(uploadMulter.single("bannerImage"), uploadHandler, addPricingContent)
  .get(getPricingContent)
router
  .route("/pricing/:id")
  .patch(uploadMulter.single("bannerImage"), uploadHandler, updatePricngContent)

router
  .route("/product")
  .post(uploadMulter.single("bannerImage"), uploadHandler, addProductContent)
  .get(getProductContent)
router
  .route("/product/:id")
  .patch(uploadMulter.single("bannerImage"), uploadHandler, updateProductContent)

router
  .route("/contact")
  .post(uploadMulter.single("bannerImage"), uploadHandler, addContactContent)
  .get(getContactContent)
router
  .route("/contact/:id")
  .patch(uploadMulter.single("bannerImage"), uploadHandler, updateContactContent)
router
  .route("/inventory")
  .post(uploadMulter.single("bannerImage"), uploadHandler, addInventoryContent)
  .get(getInventoryContent)
router
  .route("/inventory/:id")
  .patch(uploadMulter.single("bannerImage"), uploadHandler, updateInventoryContent)
module.exports = router
