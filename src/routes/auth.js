const express = require("express")
const { validateSignUpData } = require("../utils/validation")
const authRouter = express.Router()
const bcrypt = require("bcrypt")
const User = require("../models/user")
const validator = require("validator")

authRouter.post("/signup", async(req,res) => {
  // console.log(req.body)
  try {
    // Validate the data
    validateSignUpData(req)

    const {firstName, lastName, emailId, password} = req.body

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10)
    // console.log(password)

    // creating the new instance of the user
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash
    })

    const savedUser = await user.save()
    const  token = await savedUser.getJWT()

    //  res.cookie("token", token, {
    //     expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    //     // httpOnly: true,
    //   });
      res.cookie("token", token, {
      httpOnly: true,
      secure: true,        // ✅ REQUIRED for HTTPS (Render)
      sameSite: "none",    // ✅ REQUIRED for Netlify → Render
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.json({message: "User added successfully" , data: savedUser})
  } catch (err) {
    res.status(400).json({message: err.message})
  }
})

authRouter.post("/login", async (req,res) => {
  try {
    const {emailId, password} = req.body

    if(!validator.isEmail(emailId)) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = await User.findOne({emailId : emailId})
    if(!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await user.validatePassword(password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

      // Create JWT token
      const  token = await user.getJWT()
      // console.log(token)

       // Set cookie
      // Add the token to cookie and send the response back to the user
      // res.cookie("token", token);
    //  res.cookie("token", token, {
    //     expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    //     httpOnly: true,
    //   });
      res.cookie("token", token, {
      httpOnly: true,
      secure: true,        // ✅ REQUIRED for HTTPS (Render)
      sameSite: "none",    // ✅ REQUIRED for Netlify → Render
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

      res.json({message: "Logged in successfully!!!", user});
  } catch(err) {
     res.status(400).json({ message: "ERROR: " + err.message })
  }
})

authRouter.post("/logout", async(req,res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now())
  })
  res.send("Logout successfully")
})

module.exports = authRouter