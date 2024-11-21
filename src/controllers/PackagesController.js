// const PackageModel = require("../models/Packages")
// const Client = require("../models/Client")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
// const StripeIdModel = require("../models/StripeId")



const YOUR_DOMAIN = "https://presseo-backend.vercel.app"


// const YOUR_DOMAIN = "http://localhost:2000"
const createPackage = catchAsync(async (req, res, next) => {
  const newPackage = await PackageModel.create(req.body)
  res.status(201).json({
    status: "success",
    data: {
      package: newPackage
    },
    message: "Package added successfully"
  })
})

const getPackages = catchAsync(async (req, res, next) => {
  const { page, limit = 10 } = req.query
  let packages
  const pageValue = parseInt(page)
  const limitValue = parseInt(limit)
  const skip = (pageValue - 1) * limitValue
  if (page) {
    packages = await PackageModel.find().sort({ _id: -1 }).skip(skip).limit(limitValue)
  } else {
    packages = await PackageModel.find().sort({ _id: -1 })
  }
  const counts = await PackageModel.countDocuments()

  res.status(200).send({
    status: "success",
    counts,
    results: packages,
    message: "Packages fetched"
  })
})

const getSinglePackage = catchAsync(async (req, res, next) => {
  const package = await PackageModel.findById(req.params.id)
  if (!package) {
    return next(new AppError("No package found with that ID", 404))
  }
  res.status(200).json({
    status: "success",
    data: {
      package
    },
    message: "Package fetched"
  })
})

const purchasePackage = catchAsync(async (req, res, next) => {
  const package = await PackageModel.findById(req.params.packageId)
  if (!package) {
    return next(new AppError("No package found with that ID", 404))
  }
  //   const stripeId = await StripeIdModel.findOne({ current: true }) 
  // if (!stripeId || !stripeId.current) {
  //   return next(new AppError("There is no active Stripe connected account", 404))

  // }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: package.description
          },
          unit_amount: package.price * 100 // 20 USD
        },
        quantity: 1
      }
    ],
    mode: "payment",
    // payment_intent_data: {
    //   // application_fee_amount: 100, // Optional: Platform's fee in cents
    //   transfer_data: {
    //     destination: "acct_1Q0dnjGhDELNu1Kk" // ID of the connected account
    //   },
    // },
    // success_url: `com.fabtechsol2.presseo://payment-success`,
    // cancel_url: `com.fabtechsol2.presseo://payment-success`,
    success_url: `${YOUR_DOMAIN}/payment-success`,
    cancel_url: `${YOUR_DOMAIN}/payment-cancee`,
   
    metadata: {
      clientId: req.user._id.toString(),
      packageId: req.params.packageId
    }
  })

  res.status(200).json({ url: session.url })
})

// const purchasePackage = catchAsync(async (req, res, next) => {
//   const package = await PackageModel.findById(req.params.packageId)
//   if (!package) {
//     return next(new AppError("No package found with that ID", 404))
//   }

//   const stripeId = await StripeIdModel.findOne({ current: true }) // Find one active stripeId
//   if (!stripeId || !stripeId.current) {
//     return res.status(400).json({
//       status: "error",
//       message: "There is no active Stripe connected account"
//     })
//   }

//   try {
//     // Ensure you're charging through a connected account
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: package.price * 100, // in cents
//       currency: "usd",
//       payment_method_types: ["card"],
//       application_fee_amount: 100, // Fee only applies for connected accounts
      // transfer_data: {
      //   destination: stripeId.stripeId
      // },
//       metadata: {
//         clientId: req.user._id.toString(),
//         packageId: req.params.packageId
//       }
//     })

//     res.status(200).json({ clientSecret: paymentIntent.client_secret })
//   } catch (error) {
//     return next(new AppError(error.message, error.statusCode || 500))
//   }
// })

const updatePackage = catchAsync(async (req, res, next) => {
  const package = await PackageModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
  if (!package) {
    return next(new AppError("No package found with that ID", 404))
  }
  res.status(200).json({
    status: "success",
    data: {
      package
    },
    message: "Packages updated"
  })
})

const deletePackage = catchAsync(async (req, res, next) => {
  const package = await PackageModel.findByIdAndDelete(req.params.id)
  if (!package) {
    return next(new AppError("No package found with that ID", 404))
  }
  res.status(200).json({
    status: "success",
    data: null,
    message: "Package deleted successfully"
  })
})

module.exports = {
  createPackage,
  getPackages,
  getSinglePackage,
  updatePackage,
  deletePackage,
  purchasePackage
}
