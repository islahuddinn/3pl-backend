
const express = require("express");

const {
  addContactUsData,
  putContactUsData,
  deleteContactUsData,
  getContactUsData,
  getAllContactUsDatas,
} = require("../controllers/contactusdataController");
const requireAuth = require("../middlewares/requireAuth");
const restrictTo = require("../middlewares/restrictTo");
const { uploadMulter, uploadHandler } = require("../utils/uploadHelper");
const ReferenceUser = require("../utils/ReferenceUser");

const router = express.Router();
router.route("/")
    .post(requireAuth, addContactUsData)
    .get(requireAuth,getAllContactUsDatas);

router.route("/:id")
    .get(requireAuth,getContactUsData)
    .put(requireAuth, putContactUsData)
    .delete(requireAuth, deleteContactUsData);

module.exports = router;
