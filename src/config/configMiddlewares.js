const cors = require("cors")
const express = require("express")
const path = require("path")
const logger = require("morgan")
const dotenv = require("dotenv").config()
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")
const hpp = require("hpp")
const cookieParser = require("cookie-parser")
const compression = require("compression")
const bodyParser = require("body-parser")
const { webHooksRoutes } = require("../routes")

// require("./cron")
module.exports = function (app) {
  app.use(cors())
  app.options("*", cors())
  app.use(helmet({ contentSecurityPolicy: false }))

  app.use(cookieParser())

  app.use(xss())
  app.use(compression())

  app.use("/api/webHooks", webHooksRoutes)
  // app.use("/uploads", express.static("uploads"))
  app.use("/public", express.static(path.join(__dirname, "../public")))
  app.use(express.json({ limit: "30mb" }))
  app.use(express.urlencoded({ limit: "50mb", extended: true }))
  if (process.env.NODE_ENV === "development") {
    app.use(logger("dev"))
  }

  app.use(mongoSanitize())
  const limiter = rateLimit({
    max: 90000,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: "Too many requests from this IP, please try again in 15 mintues!"
  })
  app.use("/api", limiter)

  app.set("view engine", "ejs")
  app.set("views", path.join(__dirname, "../views"))

  // Prevent parameter pollution
  app.use(
    hpp({
      whitelist: []
    })
  )
  // Test middleware
  app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    // console.log(req.cookies);
    next()
  })

  // Define a route to render the Pug page
  // app.get('/email', (req, res) => {
  //     res.render('ResetPassword',{ token: "dsfds" });
  // })
  app.get("/email", (req, res) => {
    res.render("email/Report", { firstName: "Hello" })
  })

  app.get("/template", (req, res) => {
    res.render("WeeklyPdfReport", { data: { completedFeedbackCount: 200 } })
  })

  // app.get('/email', (req, res) => {
  //     res.render('ResetPassword', {  firstName:"jutt",
  //         url: "fb.com",
  //         subject:"no Subject",
  //       data:{technician:"John2",barcode:"897324328"} });
  //   });
}
