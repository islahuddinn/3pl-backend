const Order = require("../models/order")
const axios = require("axios")
// const ShippoService = require("../services/ShippoService")

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const ShippoService = require("../services/ShippoService")
const { json } = require("body-parser")
const shippoService = new ShippoService(process.env.SHIPPO_API_KEY)
// const shippoService = new ShippoService()

exports.createOrder = async (req, res) => {
  try {
    const rateId = req.body.rateId || 323

    const shippoService = new ShippoService("shippo_test_213af3509629339ff6d77dbf87dd4c4a42807b16")

    const label = await shippoService.purchaseLabelByRate(rateId)

    res.status(200).json({
      message: "Shipping label purchased successfully",
      label
    })
  } catch (error) {
    console.error("Error purchasing shipping label:", error)
    res.status(500).json({
      error: "Failed to purchase shipping label",
      details: error.message
    })
  }
}

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
    res.status(200).json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    res.status(500).json({ message: "Error fetching orders", error })
  }
}

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }
    res.status(200).json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    res.status(500).json({ message: "Error fetching order", error })
  }
}

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }
    res.status(200).json({ message: "Order updated successfully", order })
  } catch (error) {
    console.error("Error updating order:", error)
    res.status(400).json({ message: "Error updating order", error })
  }
}

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }
    res.status(200).json({ message: "Order deleted successfully" })
  } catch (error) {
    console.error("Error deleting order:", error)
    res.status(500).json({ message: "Error deleting order", error })
  }
}

exports.getShippingRates = async (req, res) => {
  try {
    // const shippoService = new ShippoService("shippo_test_213af3509629339ff6d77dbf87dd4c4a42807b16")
    const data = {
      address_from: req.body.address_from,
      address_to: req.body.address_to,
      parcels: req.body.parcels
    }
    const shipment = await shippoService.createShipment(data)

    res.status(200).json({ rates: shipment.rates })
  } catch (error) {
    console.error("Error creating shipment:", error)
    res.status(500).json({ error: "Failed to create shipment", details: error.message })
  }
}

// exports.purchaseLabel = async (req, res) => {
//   const { shipmentId, paymentMethodId, customerEmail, customerId } = req.body

//   try {
//     console.log("Fetching label rate for shipment:", shipmentId)

//     // Fetch label rate from Shippo
//     const rate = await shippoService.getLabelRate(shipmentId)
//     if (!rate) return res.status(400).json({ error: "No rates found for this shipment." })

//     const labelCost = parseFloat(rate.amount) // Get the cost from rate
//     const adminFee = 3.0 // Admin fee

//     const totalAmount = Math.round((labelCost + adminFee) * 100) // Convert to cents

//     // Create a PaymentIntent with Stripe
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: totalAmount,
//       currency: "usd",
//       payment_method: paymentMethodId,
//       receipt_email: customerEmail,
//       confirm: true,
//       transfer_data: {
//         destination: process.env.ADMIN_ACCOUNT_ID,
//         amount: Math.round(adminFee * 100)
//       },
//       metadata: {
//         shipmentId: shipmentId,
//         customerId: customerId
//       }
//     })

//     if (paymentIntent.status === "succeeded") {
//       console.log("Payment succeeded. Purchasing label...")

//       // Purchase the label from Shippo using the rate ID
//       const transaction = await shippoService.purchaseLabelByRate(rate.object_id)
//       return res.status(200).json({
//         message: "Label purchased successfully",
//         transaction
//       })
//     } else {
//       console.error("Payment failed:", paymentIntent)
//       return res.status(400).json({ error: "Payment failed." })
//     }
//   } catch (error) {
//     console.error("Error during label purchase:", error)
//     res.status(500).json({ error: "Internal Server Error" })
//   }
// }

////---Create-Dummy-Shipment--///

exports.createShipment = async (req, res) => {
  try {
    const shipmentData = {
      address_from: {
        name: "John Doe",
        street1: "215 Clayton St.",
        city: "San Francisco",
        state: "CA",
        zip: "94117",
        country: "US",
        phone: "+1 555 341 9393",
        email: "johndoe@example.com"
      },
      address_to: {
        name: "Jane Smith",
        street1: "Broadway 1",
        city: "New York",
        state: "NY",
        zip: "10007",
        country: "US",
        phone: "+1 555 341 9393",
        email: "janesmith@example.com"
      },
      parcels: [
        {
          length: "5",
          width: "5",
          height: "5",
          distance_unit: "in",
          weight: "2",
          mass_unit: "lb"
        }
      ],
      async: false
    }

    const response = await axios.post("https://api.goshippo.com/shipments", shipmentData, {
      headers: {
        Authorization: `ShippoToken ${process.env.SHIPPO_API_KEY}`
      }
    })

    const shipment = response.data
    console.log("Shipment created successfully:", shipment)

    return res.status(200).json({
      message: "Shipment created successfully",
      shipmentId: shipment.object_id, // Use this ID for further operations
      shipment
    })
  } catch (error) {
    console.error("Error creating shipment:", error.response?.data || error.message)
    res.status(500).json({ error: "Failed to create shipment." })
  }
}

exports.purchaseLabel = async (req, res) => {
  console.log("end point hitted")
  const { rateObjectId, customerEmail } = req.body
  const YOUR_DOMAIN = `https://3pl-fe.netlify.app`

  try {
    const connectedAccountId = process.env.ADMIN_ACCOUNT_ID
    // Step 1: Create the shipment with Shippo
    // const shipment = await shippoService.createShipment(shipmentData)

    // Step 2: Get the label rate
    const rate = await shippoService.getLabelRate(rateObjectId)
    const labelCost = parseFloat(rate.amount)
    const adminFee = 3.0
    const totalAmount = Math.round((labelCost + adminFee) * 100) // Convert to cents

    // Step 3: Create a PaymentIntent with Application Fee
    const paymentIntentData = {
      amount: totalAmount,
      currency: "usd",
      // payment_method: "card",
      automatic_payment_methods: {
        enabled: true
      },
      receipt_email: customerEmail,
      confirm: true,
      application_fee_amount: Math.round(adminFee * 100),
      metadata: {
        shipmentId: shipmentId
      },

      // return_url: "https://www.barakatax.com/"
      return_url: `${YOUR_DOMAIN}/payment-cancel`
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData, {
      stripeAccount: connectedAccountId
    })
    console.log(paymentIntent, "Here is the payment intent")
    // Step 4: Purchase the label from Shippo if payment succeeds
    if (paymentIntent.status === "succeeded") {
      const transaction = await shippoService.purchaseLabel(rateObjectId)
      return res.status(200).json({
        message: "Label purchased successfully",
        transaction,
        paymentIntentId: paymentIntent.id
      })
    } else {
      return res.status(400).json({ error: "Payment failed." })
    }
  } catch (error) {
    console.error("Error during label purchase:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

//////5th----Approach////

// exports.createPaymentIntent = async (req, res) => {
//   const { paymentMethodId, objectId, customerEmail } = req.body
//   // console.log(amount, "here is the label id.......")
//   try {
//     // Step 1: Get the label rate from GoShippo
//     const rate = await shippoService.getLabel(objectId)
//     console.log(rate, "Here are the label rate................")
//     const labelCost = parseFloat(rate.amount)

//     // Step 2: Charge the admin fee via Stripe
//     const adminFee = 3.0 // Admin fee
//     const totalAdminFee = Math.round(adminFee * 100) // Convert to cents
//     //  const paymentMethodIds = await stripe.createPaymentMethod(cardDetails);
//     // Step 3: Create a PaymentIntent for the admin fee
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: totalAdminFee,
//       currency: "usd",
//       // customer: "rendom",
//       metadata: {
//         labelAmount: String(rate.amount),
//         rateId: String(objectId)
//       },
//       automatic_payment_methods: {
//         enabled: true
//       }
//     })
//     console.log(paymentIntent, "here is the payment intent")
//     res.status(200).json({ success: true, paymentIntentId: paymentIntent.id })
//   } catch (error) {
//     console.error("Error during label purchase and fee processing:", error)
//     res.status(500).json({ error: "Internal Server Error" })
//   }
// }

////---Purchase label with shipo--///
exports.purchaseLabel2 = async (req, res) => {
  if (paymentIntent.status === "succeeded") {
    // Purchase the label from GoShippo
    const transaction = await shippoService.purchaseLabel(objectId)
    console.log(transaction, "Here is the transactions......")
    // Return success response to client
    return res.status(200).json({
      message: "Label purchased successfully with admin fee charged",
      transaction
    })
  } else {
    return res.status(400).json({ error: "Payment for admin fee failed." })
  }
  //   } catch (error) {
  //     console.error("Error during label purchase and fee processing:", error)
  //     res.status(500).json({ error: "Internal Server Error" })
  //   }
  // }
}

/////

const YOUR_DOMAIN = `https://3pl-fe.netlify.app`

exports.checkoutSessionLabelPurchase = async (req, res) => {
  const { objectId, customerDataId, customerEmail, fullfillmentDiscount } = req.body

  try {
    // Step 1: Get the label rate from GoShippo
    // const rate = await shippo.transaction.retrieve(objectId);
    const rate = await shippoService.getLabel(objectId)
    const labelCost = parseFloat(rate.amount)
    const adminFee = 3.0 - Number(fullfillmentDiscount)
    const total = Math.round(adminFee * 100 + labelCost * 100)

    // Step 2: Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Shipping Label Purchase",
              description: `Fulfillment Fee: $${adminFee}, Shipping Fee: $${rate.amount}`,
              metadata: {
                admin_charges: adminFee,
                label_fee: rate.amount,
                total_amount: total / 100
              }
            },
            unit_amount: total
          },
          quantity: 1
        }
      ],
      mode: "payment",
      metadata: {
        labelAmount: String(rate.amount),
        rateId: String(objectId),
        customerDataId: String(customerDataId),
        AdminFee: String(adminFee)

        // LabelObject: JSON.stringify(rate),
      },
      success_url: `${YOUR_DOMAIN}/payment-success`,
      cancel_url: `${YOUR_DOMAIN}/payment-cancel`
    })

    console.log(session, "Here is the Checkout session")

    // Step 3: Return the session ID to the client
    return res.status(200).json({ success: true, sessionUrl: session.url })
  } catch (error) {
    console.error("Error during label purchase and fee processing:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
}
