const { getAllproducts } = require("../controllers/productController")
const {
  authRoute,
  productsRoute,
  productsendformRoutes,
  contactRoute,
  homedataRoutes,
  pricingdataRoutes,
  contactusdataRoutes,
  inventorydataRoutes,
  productdataRoutes,
  orderRoute,
  userRoutes,
  fulfillmentRoutes,
  contentManagementRoutes,
  discountCodeRoutes
} = require("../routes")
const otherRoutes = require("./otherRoutes")
module.exports = function (app) {
  app.use("/api/auth", authRoute)
  app.use("/api/products", productsRoute)
  app.use("/api/send-product", productsendformRoutes)
  app.use("/api/contact-us", contactRoute)
  app.use("/api/home", homedataRoutes)
  app.use("/api/price", pricingdataRoutes)
  app.use("/api/order", orderRoute)
  app.use("/api/user", userRoutes)
  app.use("/api/fulfillment", fulfillmentRoutes)
  app.use("/api/discounts", discountCodeRoutes)
  app.use("/api/contact-us", contactusdataRoutes)
  app.use("/api/inventory", inventorydataRoutes)
  app.use("/api/product", productdataRoutes)
  app.use("/api/content", contentManagementRoutes)

  otherRoutes(app)
}
