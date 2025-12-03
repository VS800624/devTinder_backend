const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();
const {sendEmail} = require("../utils/sendEmail")

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id; // the logged in user sending the connection request
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ message: "User not found" });
      }

      // If there is an existing connection request
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          // The request was sent by the current user → another user Example: A → B
          // {fromUserId: fromUserId, toUserId: toUserId}, //or
          { fromUserId, toUserId },
          // The other user already sent a request to the current user Example: B → A
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({ message: "Connection is already exist" });
      }

      // new instance of ConnectionRequest model
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      // const emailRes = await sendEmail.run("A new friend request from " + req.user.firstName ,`${req.user.firstName} is interested in ${toUser.firstName}`)
      // console.log(emailRes)

     res.json({
        message:
          status === "interested"
            ? `${req.user.firstName} is interested in ${toUser.firstName}`
            : `${req.user.firstName} ignored ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR:" + err.message);
    }
  }
);

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req,res) => {
  try {
    let loggedInUser = req.user
    let {status, requestId} = req.params

    let allowedStatus = ["rejected", "accepted"]
    if(!allowedStatus.includes(status)){
      return res.status(400).json({message: "Status not allowed"})
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId : loggedInUser,
      status: "interested"   
    })
    
    if(!connectionRequest){
      res.status(400).json({message: "Connection request not found"})
    }
    
    connectionRequest.status = status

    const data = await connectionRequest.save()

    res.json({message: "Connection request " + status, data})
    
  } catch(err) {
    res.status(400).send("ERROR:" + err.message)
  }
})

module.exports = requestRouter;
