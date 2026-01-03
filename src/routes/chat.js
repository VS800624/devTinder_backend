const express = require("express")
const { userAuth } = require("../middlewares/auth")
const Chat = require("../models/chat")
const chatRouter = express.Router()

chatRouter.get("/chat/:targetUserId", userAuth,  async(req,res) => {
  const { targetUserId} = req.params
  const userId = req.user._id

  try {
    let chat = await Chat.findOne({
      participants: {$all: [userId, targetUserId]}
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName"
    })
// populate("messages.senderId") replaces the senderId ObjectId in each message with actual user details from the User collection.

    if(!chat){
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: []
      })
      await chat.save()
    }
    res.json({message: "Fetched chat successfully", chat})
    
  } catch(err){
    req.statusCode(500).json({message: err.message})
  }
})


module.exports = chatRouter