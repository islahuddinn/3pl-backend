const express = require("express")
const bodyParser = require("body-parser")
const stripeWebhookController = require("../controllers/stripeWebHookController")

const router = express.Router()

// Stripe Webhook route
router.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookController.handleStripeWebhook
)
router.post(
  "/shippo-webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookController.handleShippoStripeWebhook
)
///handleShippoStripeWebhook

module.exports = router
