const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const User = require("../models/User")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const Fulfillment = require("../models/fullfilmentModel")
const ShippoService = require("../services/ShippoService")
const ExtraDeliveryData = require("../models/ExtraDeliveryData")
const shippoService = new ShippoService(process.env.SHIPPO_API_KEY)

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
const endpointSecret2 = process.env.STRIPE_SHIPPO_WEBHOOK_SECRET

// exports.handleStripeWebhook = catchAsync(async (req, res, next) => {
//   console.log("Stripe webhook received!")
//   const sig = req.headers["stripe-signature"]
//   let event

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
//   } catch (err) {
//     console.log(`Webhook signature verification failed: ${err.message}`)
//     return res.status(400).send(`Webhook Error: ${err.message}`)
//   }

//   switch (event.type) {
//     case "checkout.session.completed":
//       const session = event.data.object
//       const clientId = session.metadata.clientId

//       const user = await User.findById(clientId)
//       if (!user) {
//         return next(new AppError(`No user found with ID ${clientId}`, 404))
//       }

//       user.paymentStatus = true
//       await user.save()

//       console.log(`Payment successful for user: ${clientId}`)

//       console.log(`Payment Successful for session ID: ${session.id}`)
//       break

//     default:
//       console.log(`Unhandled event type ${event.type}`)
//   }

//   res.status(200).send()
// })

exports.handleStripeWebhook = async (req, res, next) => {
  console.log("Stripe webhook received!")
  const sig = req.headers["stripe-signature"]
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
  } catch (err) {
    console.log(`Webhook signature verification failed: ${err.message}`)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object
      const clientId = session.metadata.clientId

      try {
        const user = await User.findById(clientId)
        if (!user) {
          return next(new AppError(`No user found with ID ${clientId}`, 404))
        }

        user.paymentStatus = true
        user.paymentStatus = true
        user.startDate = new Date()
        user.endDate = new Date(user.startDate.getTime() + 30 * 24 * 60 * 60 * 1000)
        await user.save()

        console.log(`Payment successful for user: ${clientId}`)
        console.log(`Payment Successful for session ID: ${session.id}`)
      } catch (error) {
        console.error("Error processing checkout session:", error)
        return res.status(500).send("Error processing checkout session")
      }
      break
    // case "checkout.session.label_purchase":
    //   const labelSession = event.data.object
    //   const objectId = labelSession.metadata.rateId

    //   try {
    //     const transaction = await shippoService.purchaseLabel(objectId)
    //     console.log("Label purchased successfully:", transaction)

    //     // Optionally, you can store transaction details or perform other actions here.

    //     console.log(`Label purchase successful for session ID: ${labelSession.id}`)
    //   } catch (error) {
    //     console.error("Error purchasing label:", error)
    //     return res.status(500).send("Error processing label purchase")
    //   }
    //   break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.status(200).send()
}

exports.handleShippoStripeWebhook = async (req, res, next) => {
  console.log("Stripe SHIPPOOO-------webhook received!")
  const sig = req.headers["stripe-signature"]
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret2)
  } catch (err) {
    console.log(`Webhook signature verification failed: ${err.message}`)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  switch (event.type) {
    case "checkout.session.completed":
      const labelSession = event.data.object
      const objectId = labelSession.metadata.rateId
      const customerDataId = labelSession.metadata.customerDataId
      // const labelObject = JSON.parse(labelSession.metadata.LabelObject)
      console.log("Hi shippo we are here!")
      console.log(customerDataId, "This is the extra customer data id...")

      try {
        // Purchase the label from GoShippo
        const transaction = await shippoService.purchaseLabel(objectId)
        console.log("Label purchased successfully:", transaction)
        try {
          const fulfillmentData = {
            ...transaction,
            customerDataId
          }
          const newFullfillment = await Fulfillment.create(fulfillmentData)

          console.log("newFullfillment", newFullfillment)
        } catch (error) {
          console.log("Error creating newFullfillment", error)
        }
        console.log(`Label purchase successful for session ID: ${labelSession.id}`)
      } catch (error) {
        console.error("Error purchasing label:", error)
        return res.status(500).send("Error processing label purchase")
      }
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.status(200).send()
}
