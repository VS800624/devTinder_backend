const socketIO = require("socket.io")
const crypto = require("crypto")
const { socketAuthMiddleware } = require("../middlewares/socketAuth")
const Chat = require("../models/chat")
const { timeStamp } = require("console")
const ConnectionRequest = require("../models/connectionRequest");

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
 
    socket.on("sendMessage", async ({firstName, lastName,  userId, targetUserId, text }) => {
      try{  
        const roomId = getSecretRoomId(userId, targetUserId) 
        console.log(firstName+ " " + text)

        // Check if userId & targetUserId are friends
        const isFriend = await ConnectionRequest.findOne({
          $or: [
            {fromUserId: userId, toUserId: targetUserId, status: "accepted"},
            {fromUserId: targetUserId, toUserId: userId, status: "accepted"}
          ]
        })

        if(!isFriend){
          throw new Error("You are not connected with this user")
        }
        
        // Save messages to the database
        let chat = await Chat.findOne({
          participants: {$all: [userId, targetUserId]}
        })

        if(!chat){
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: []
          })
        }

        chat.messages.push({
          senderId: userId,
          text
        })
        await chat.save()
        
        io.to(roomId).emit("messageReceived",{firstName, lastName,  text})
      }catch(err){
        throw new Error("Error in DB")
      }
    })

    socket.on("disconnect", () => {
      
    })
  })
  
}

module.exports = initializeSocket