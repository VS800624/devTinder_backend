const express = require("express")
const userRouter = express.Router()
const {userAuth} = require("../middleware/auth")

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"

// Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async(req,res) => {
  try {
    const loggedInUser = req.user

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interrested"
    }).populate("fromUserId", USER_SAFE_DATA)  //or
    // }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "age", "gender", "skills"]);

    res.json({message: "Data fetched successfully", data: connectionRequest})

  } catch(err){
    res.status(400).send({message: err.message})
  }
})