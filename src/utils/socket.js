// SocketManager.js
const { Server } = require("socket.io")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const User = mongoose.model("User")
const { promisify } = require("util")
const { convertToIdString } = require("./modelHelpers")
class ActiveUserManager {
  constructor() {
    this.activeUsers = new Map()
  }
  addUser(userId, socketId) {
    if (!this.activeUsers.has(userId)) {
      this.activeUsers.set(userId, [socketId])
    } else {
      const userSockets = this.activeUsers.get(userId)
      userSockets.push(socketId)
      this.activeUsers.set(userId, userSockets)
    }
    return Array.from(this.activeUsers.keys())
  }
  removeUser(socketId) {
    for (const [userId, userSockets] of this.activeUsers.entries()) {
      const updatedSockets = userSockets.filter(userSocketId => userSocketId !== socketId)
      if (updatedSockets.length > 0) {
        this.activeUsers.set(userId, updatedSockets)
      } else {
        this.activeUsers.delete(userId)
      }
    }
    return Array.from(this.activeUsers.keys())
  }
  getActiveUsers() {
    return Array.from(this.activeUsers.keys())
  }
  getUserSockets(userId) {
    return this.activeUsers.get(userId)
  }
}
class SocketManager {
  constructor(httpServer) {
    this.io = new Server(httpServer, { cors: { origin: "*" } })
    this.io.use(authMiddleWareSocket)
    this.activeUserManager = new ActiveUserManager()
    this.initializeSocketEvents()
  }
  initializeSocketEvents() {
    this.io.on("connection", socket => {
      const activeUsers = this.activeUserManager.addUser(socket.user.id.toString(), socket.id)
      this.io.on("connect", socket => {
        this.io.emit("get-users", activeUsers)
      })
      socket.on("disconnect", () => {
        const activeUsers = this.activeUserManager.removeUser(socket.id)
        this.io.emit("get-users", activeUsers)
      })
      // send message to a specific user
      socket.on("new-chat", data => {
        const { receiverId } = data
        const userSockets = this.activeUserManager.getUserSockets(receiverId)
        if (userSockets) {
          userSockets.forEach(userSocketId => {
            this.io.to(userSocketId).emit("new-chat", data)
          })
        }
      })
      socket.on("send-message", data => {
        const { receiverId } = data
        const userSockets = this.activeUserManager.getUserSockets(receiverId)
        if (userSockets) {
          console.log("send", userSockets, data)
          userSockets.forEach(userSocketId => {
            this.io.to(userSocketId).emit("receive-message", data)
          })
        }
      })
      socket.on("get-users", data => {
        this.io.emit("get-users", activeUsers)
      })
    })
  }
  fireEvent(event, id, data) {
    const userSockets = this.activeUserManager.getUserSockets(convertToIdString(id))
    console.log("emit", userSockets)
    if (userSockets) {
      userSockets.forEach(userSocketId => {
        this.io.to(userSocketId).emit(event, data)
      })
    }
  }
}
const authMiddleWareSocket = async (socket, next) => {
  try {
    const authorization = socket.handshake.auth.token
    if (!authorization) {
      return next(new Error("You must be logged in"))
    }
    const token = authorization.split(" ")[1]
    if (!token) {
      return next(new Error("You must be logged in"))
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    // If decoding is successful, continue with user validation
    const currentUser = await User.findById(decoded.id)
    if (!currentUser) {
      return next(new Error("The user belonging to this token does no longer exist."))
    }
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(new Error("User recently changed password! Please log in again."))
    }
    // Attach the user object to the socket for later use
    socket.user = currentUser
    next()
  } catch (error) {
    console.error("Error during JWT decoding:", error.message)
    return next(new Error(error.message || "Authentication error"))
  }
}
module.exports = SocketManager
