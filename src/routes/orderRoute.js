// routes/orderRoutes.js
const express = require("express")
const router = express.Router()
const orderController = require("../controllers/orderController")
const trackingController = require("../controllers/trackingController")

router.post("/", orderController.createOrder)

router.post("/rates", orderController.getShippingRates)

router.get("/get-tracking", trackingController.getTrackingStatus)

router.get("/", orderController.getAllOrders)

router.get("/:id", orderController.getOrderById)

router.put("/:id", orderController.updateOrderStatus)

router.delete("/:id", orderController.deleteOrder)

// router.post("/create-dummy-shipment", orderController.createShipment)
// router.post("/purchase-label", orderController.purchaseLabel)
// router.post("/purchaseLabel", orderController.purchaseLabelAndAdminFee)  //checkoutSessionLabelPurchase
// router.post("/create-payment-intent", orderController.createPaymentIntent)
router.post("/create-payment-intent", orderController.checkoutSessionLabelPurchase)

module.exports = router
