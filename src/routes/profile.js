const express = require("express")
const authRouter = require("./auth")
const { userAuth } = require("../middlewares/auth")
const { validateEditProfileData } = require("../utils/validation")
const profileRouter = express.Router()
const bcrypt = require("bcrypt")

profileRouter.get("/profile/view", userAuth, async (req,res) => {
  try {
      const user = req.user
      res.send(user)
  } catch (err) {
    res.status(400).send("ERROR:" + err.message)
  }
} )

profileRouter.put("/profile/edit", userAuth, async (req,res) => {
  try {
    if(!validateEditProfileData(req)){
      throw new Error("Invalid Edit Request")
    }

    let loggedInUser = req.user
    // console.log(loggedInUser)
    // loggedInUser.firstName = req.body.firstName //or
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key])) 
    // console.log(loggedInUser)
    await loggedInUser.save()
     // res.send(`${loggedInUser.firstName}, your profile is updated successfully`)
    //  best practice
    res.json({
      message: `${loggedInUser.firstName}, your profile is updated`,
      data: loggedInUser
    })
    
  } catch (err) {
    res.status(400).send("ERROR:" + err.message)
  }
})

profileRouter.post("/profile/password", userAuth, async(req,res) => {
  try {
    const user = req.user
    const {oldPassword, newPassword} = req.body
    if (oldPassword === newPassword) {
  return res.status(400).json({ error: "New password cannot be the same as old password" });
}

    // Step:1) Validate the password
    const isPasswordValid = await user.validatePassword(oldPassword)
    if(!isPasswordValid) {
      return res.status(400).json({error:"Old password is incorrect"})
    }

    // Step:2) Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    // Step:3) Save new Password
    user.password = hashedNewPassword
    await user.save()
    res.send("Password changed successfully")
  }catch(err){
    res.status(400).json("ERROR: " + err.message )
  }
})

module.exports = profileRouter