const express = require("express");
const {authAdmin, authUser} = require("./middlewares/auth")
const app = express();

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
