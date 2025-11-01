const express = require("express");
const {authAdmin, authUser} = require("./middlewares/auth")
const app = express();
const User = require("./models/user")

const connectDB = require("./config/database")

app.use(express.json())

app.post("/signup", async(req,res) => {
  console.log(req.body)

  // Creating the new instance of the User model
  const user = new User(req.body)

  try{
    await user.save()
    res.send("User added successfully!")
  } catch (err) {
    res.status(400).send("Error adding the user:" + err.message)
  }
})

app.get("/user", async (req,res) => {
  
  const userEmail = req.body.emailId

  try {
    const user = await User.findOne({emailId: userEmail})
     // const user = await User.findById({_id: userId})
    if(!user) {
      res.status(404).send("User not found")
    } else {
      res.send(user)
    }

    // const users = await User.find({ emailId: userEmail })
    // if(!users){
    //   res.send(400).send("User not found")
    // }else {
    //   res.send(users)
    // }
  } catch(err) {
    res.status(400).send("Something went wrong")
  }
})

// Feed API - Get/feed - get all the users from the database
app.get("/feed", async (req,res) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch (err) {
    res.status(400).send("Something went wrong")
  }
})

// delete a user form the database
app.delete("/user", async (req,res) => {
  const userId = req.body.userId
  try {
    // const user = await User.findByIdAndDelete({_id: userId})
    const user = await User.findByIdAndDelete(userId)
    res.send("User deleted successfully")
  } catch (err) {
    res.status(400).send("Something went wrong")
  }
})

// Update data for the user 
app.patch("/user", async (req,res) => {
  const userId = req.body.userId
  const data = req.body
  try {
    // const user = await User.findByIdAndUpdate({_id:userId}, data)
    const user = await User.findByIdAndUpdate(userId, data, {returnDocument: "after", runValidators: true})
    console.log(user)
    res.send("User updated successfully")
  } catch (err) {
    res.status(400).send("Something went wrong")
  }
})

connectDB()
.then(() => {
  console.log("Database connection established")
  app.listen(3000, () => {
  console.log("Server  is successfully listening on port 3000...");
  });
})
.catch((err) => {
  console.error("Database cannot be connected")
})



// Note: Order of writing the routes matter a lot
