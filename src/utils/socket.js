const socketIO = require("socket.io")
const crypto = require("crypto")
const { socketAuthMiddleware } = require("../middlewares/socketAuth")

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex")
}

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: [
      "http://localhost:5173",
      "https://devtinder619.netlify.app"
    ], 
    credentials: true,
    }
  })

    //  apply middleware
  // io.use(socketAuthMiddleware)
  
  io.on("connection", (socket) => {
    // Handle events
    socket.on("joinChat", ({firstName, userId,  targetUserId}) => {
      const roomId = getSecretRoomId(userId, targetUserId)
      console.log(firstName + " joined room : " + roomId)
      socket.join(roomId)
    })
 
    socket.on("sendMessage", ({firstName, userId, targetUserId, text}) => {
      const roomId = getSecretRoomId(userId, targetUserId) 
      console.log(firstName+ " " + text)
      io.to(roomId).emit("messageReceived",{firstName, text})
    })

    socket.on("disconnect", () => {
      
    })
  })
  
}

module.exports = initializeSocket