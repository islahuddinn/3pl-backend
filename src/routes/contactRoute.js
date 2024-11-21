const express = require("express");
const { contactus } = require("../controllers/ContactUs");

const router = express.Router();

router.route("/")
.post(contactus)

module.exports= router;