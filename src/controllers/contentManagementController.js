const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const HomeData = require("../models/ContentManagement/HomeData")
const Pricing = require("../models/ContentManagement/PricingData")
const ProductData = require("../models/ContentManagement/ProductData")
const InventoryData = require("../models/ContentManagement/InventoryData")
const ContactData = require("../models/ContentManagement/ContactUsData")

const addHomeContent = catchAsync(async (req, res, next) => {
  const { bannerTitle, bannerDescription, consumerTitle, consumerDescription, faqTitle, faqs } =
    req.body

  try {
    const homeContent = await HomeData.create({
      bannerTitle,
      bannerDescription,
      consumerTitle,
      consumerDescription,
      faqTitle,
      faqs,
      bannerImage: req.body?.bannerImage || null,
      bannerVideo: req.body?.bannerVideo || null
    })

    res.status(201).json({
      status: "success",
      data: {
        homeContent
      }
    })
  } catch (error) {
    next(error)
  }
})

const getHomeContent = catchAsync(async (req, res, next) => {
  const homeContent = await HomeData.findOne()
  if (!homeContent) {
    return next(new AppError("No Home Content found", 404))
  }
  res.status(200).json({
    status: "success",
    data: {
      homeContent
    }
  })
})

const updateHomeContent = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const { bannerTitle, bannerDescription, consumerTitle, consumerDescription, faqTitle } = req.body

  let faqs
  try {
    faqs = req.body.faqs ? JSON.parse(req.body.faqs) : undefined
  } catch (error) {
    return next(new AppError("Invalid JSON format for FAQs", 400))
  }
  const checkHomeContent = await HomeData.findById(id)
  if (!checkHomeContent) {
    return next(new AppError("No Home Content found with that ID", 404))
  }
  checkHomeContent.bannerTitle = bannerTitle || checkHomeContent.bannerTitle
  checkHomeContent.bannerDescription = bannerDescription || checkHomeContent.bannerDescription
  checkHomeContent.consumerTitle = consumerTitle || checkHomeContent.consumerTitle
  checkHomeContent.consumerDescription = consumerDescription || checkHomeContent.consumerDescription
  checkHomeContent.faqTitle = faqTitle || checkHomeContent.faqTitle
  checkHomeContent.faqs = faqs || checkHomeContent.faqs
  checkHomeContent.bannerImage = req.body?.bannerImage || checkHomeContent.bannerImage
  checkHomeContent.bannerVideo = req.body?.bannerVideo || checkHomeContent.bannerVideo
  await checkHomeContent.save()

  res.status(200).json({
    status: "success",
    data: {
      checkHomeContent
    }
  })
})

const addPricingContent = catchAsync(async (req, res, next) => {
  const { bannerTitle, bannerTitle2, bannerDescription, shippingCost } = req.body
  const pricingContent = await Pricing.create({
    bannerTitle,
    bannerDescription,
    shippingCost,
    bannerImage: req.body?.bannerImage || null
  })
  res.status(201).json({
    status: "success",
    data: {
      pricingContent
    }
  })
})

const getPricingContent = catchAsync(async (req, res, next) => {
  const pricingContent = await Pricing.findOne()
  if (!pricingContent) {
    return next(new AppError("No Pricing Content found", 404))
  }
  res.status(200).json({
    status: "success",
    data: {
      pricingContent
    }
  })
})

const updatePricngContent = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const { bannerTitle, bannerTitle2, bannerDescription } = req.body

  let shippingCost
  try {
    shippingCost = req.body.shippingCost ? JSON.parse(req.body.shippingCost) : undefined
  } catch (error) {
    return next(new AppError("Invalid JSON format for shippingCost", 400))
  }

  const checkPricingContent = await Pricing.findById(id)
  if (!checkPricingContent) {
    return next(new AppError("No Pricing Content found with that ID", 404))
  }
  checkPricingContent.bannerTitle = bannerTitle || checkPricingContent.bannerTitle
  checkPricingContent.bannerTitle2 = bannerTitle2 || checkPricingContent.bannerTitle2
  checkPricingContent.bannerDescription = bannerDescription || checkPricingContent.bannerDescription
  checkPricingContent.shippingCost = shippingCost || checkPricingContent.shippingCost
  checkPricingContent.bannerImage = req.body?.bannerImage || checkPricingContent.bannerImage
  await checkPricingContent.save()

  res.status(200).json({
    status: "success",
    data: {
      checkPricingContent
    }
  })
})

const addProductContent = catchAsync(async (req, res, next) => {
  const { bannerTitle, bannerDescription } = req.body
  const productContent = await ProductData.create({
    bannerTitle,
    bannerDescription,

    bannerImage: req.body?.bannerImage || null
  })
  res.status(201).json({
    status: "success",
    data: {
      productContent
    }
  })
})

const getProductContent = catchAsync(async (req, res, next) => {
  const productContent = await ProductData.findOne()
  if (!productContent) {
    return next(new AppError("No Product Content found", 404))
  }
  res.status(200).json({
    status: "success",
    data: {
      productContent
    }
  })
})

const updateProductContent = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const { bannerTitle, bannerDescription } = req.body

  const checkProductContent = await ProductData.findById(id)
  if (!checkProductContent) {
    return next(new AppError("No Product Content found with that ID", 404))
  }
  checkProductContent.bannerTitle = bannerTitle || checkProductContent.bannerTitle
  checkProductContent.bannerDescription = bannerDescription || checkProductContent.bannerDescription
  checkProductContent.bannerImage = req.body?.bannerImage || checkProductContent.bannerImage
  await checkProductContent.save()

  res.status(200).json({
    status: "success",
    data: {
      checkProductContent
    }
  })
})

const addInventoryContent = catchAsync(async (req, res, next) => {
  const { bannerTitle, bannerDescription } = req.body
  const inventoryContent = await InventoryData.create({
    bannerTitle,
    bannerDescription,
    bannerImage: req.body?.bannerImage || null
  })
  res.status(201).json({
    status: "success",
    data: {
      inventoryContent
    }
  })
})

const getInventoryContent = catchAsync(async (req, res, next) => {
  const inventoryContent = await InventoryData.findOne()
  if (!inventoryContent) {
    return next(new AppError("No Inventory Content found", 404))
  }
  res.status(200).json({
    status: "success",
    data: {
      inventoryContent
    }
  })
})

const updateInventoryContent = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const { bannerTitle, bannerDescription } = req.body

  const checkInventoryContent = await InventoryData.findById(id)
  if (!checkInventoryContent) {
    return next(new AppError("No Inventory Content found with that ID", 404))
  }
  checkInventoryContent.bannerTitle = bannerTitle || checkInventoryContent.bannerTitle
  checkInventoryContent.bannerDescription =
    bannerDescription || checkInventoryContent.bannerDescription
  checkInventoryContent.bannerImage = req.body?.bannerImage || checkInventoryContent.bannerImage
  await checkInventoryContent.save()

  res.status(200).json({
    status: "success",
    data: {
      checkInventoryContent
    }
  })
})

const addContactContent = catchAsync(async (req, res, next) => {
  const { bannerTitle, bannerDescription } = req.body
  const contactContent = await ContactData.create({
    bannerTitle,
    bannerDescription,
    bannerImage: req.body?.bannerImage || null
  })
  res.status(201).json({
    status: "success",
    data: {
      contactContent
    }
  })
})
const getContactContent = catchAsync(async (req, res, next) => {
  const contactContent = await ContactData.findOne()
  if (!contactContent) {
    return next(new AppError("No Contact Content found", 404))
  }
  res.status(200).json({
    status: "success",
    data: {
      contactContent
    }
  })
})

const updateContactContent = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const { bannerTitle, bannerDescription } = req.body

  const checkContactContent = await ContactData.findById(id)
  if (!checkContactContent) {
    return next(new AppError("No Contact Content found with that ID", 404))
  }
  checkContactContent.bannerTitle = bannerTitle || checkContactContent.bannerTitle
  checkContactContent.bannerDescription = bannerDescription || checkContactContent.bannerDescription
  checkContactContent.bannerImage = req.body?.bannerImage || checkContactContent.bannerImage
  await checkContactContent.save()

  res.status(200).json({
    status: "success",
    data: {
      checkContactContent
    }
  })
})

module.exports = {
  addHomeContent,
  updateHomeContent,
  addPricingContent,
  updatePricngContent,
  addProductContent,
  updateProductContent,
  addInventoryContent,
  updateInventoryContent,
  updateContactContent,
  addContactContent,
  getHomeContent,
  getPricingContent,
  getProductContent,
  getInventoryContent,
  getContactContent
}
