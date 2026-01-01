const socket = require("socket.io")

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: [
      "http://localhost:5173",
      "https://devtinder619.netlify.app"
    ], 
    }
  })

  io.on("connection", (socket) => {
    // Handle events
    socket.on("joinChat", ({firstName, userId, targetUserId}) => {
      const roomId = [userId, targetUserId].sort().join("-")
      console.log(firstName + " joined room : " + roomId)
      socket.join(roomId)
    })
 
    socket.on("sendMessage", ({firstName, userId, targetUserId, text}) => {
      const roomId = [userId, targetUserId].sort().join("-") 
      console.log(firstName+ " " + text)
      io.to(roomId).emit("messageReceived",{firstName, text})
    })

    socket.on("disconnect", () => {
      
    })
  })
  
}

module.exports = initializeSocket