const express = require("express")
const requireAuth = require("../middlewares/requireAuth")
const restrictTo = require("../middlewares/restrictTo")
const {
  createDiscountCode,
  getAllDiscountCodes,
  deleteDiscountCode,
  updateDiscountCode,
  getDiscountCode,
  validateDiscountCode
} = require("../controllers/DiscountCodeController")

const router = express.Router()

router
  .post("/", requireAuth, restrictTo("AD"), createDiscountCode)
  .get("/", requireAuth, restrictTo("AD"), getAllDiscountCodes)
  .get("/:id", requireAuth, restrictTo("AD"), getDiscountCode)
  .delete("/:id", requireAuth, restrictTo("AD"), deleteDiscountCode)
  .patch("/:id", requireAuth, restrictTo("AD"), updateDiscountCode)

router.post("/validate", validateDiscountCode)

module.exports = router
