const swaggerUi = require("swagger-ui-express")
const swaggerDocument = require("../utils/swagger-output.json")
const globalErrorHandler = require("../controllers/errorController")
const dotenv = require("dotenv").config()
const colors = require("colors")
const { getAsBool } = require("../utils/helpers")
const AppError = require("../utils/appError")
const http = require("http")
// const SocketManager = require("../utils/socket")
module.exports = function (app) {
  const server = http.createServer(app)

  if (getAsBool(process.env.API_DEBUG)) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  }

  app.use("/", (req, res, next) => {
    if (req.path === "/") {
      res.send("API is Working.............")
    } else {
      next()
    }
  })

  app.all("/*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
  })

  app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    // //console.log(req.cookies);
    next()
  })
  app.use(globalErrorHandler)

  const port = process.env.PORT || 5000
  server.listen(port, function () {
    // const socketManager = new SocketManager(server)
    // app.set("io", socketManager)
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold)
  })
}
