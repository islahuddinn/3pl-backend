
const express = require("express");

const {
  addPricingData,
  putPricingData,
  deletePricingData,
  getPricingData,
  getAllPricingDatas,
} = require("../controllers/pricingdataController");
const requireAuth = require("../middlewares/requireAuth");
const restrictTo = require("../middlewares/restrictTo");
const { uploadMulter, uploadHandler } = require("../utils/uploadHelper");
const ReferenceUser = require("../utils/ReferenceUser");

const router = express.Router();
router.route("/")
    .post(requireAuth, addPricingData)
    .get(requireAuth,getAllPricingDatas);

router.route("/:id")
    .get(requireAuth,getPricingData)
    .put(requireAuth, putPricingData)
    .delete(requireAuth, deletePricingData);

module.exports = router;
