const express = require("express");
const {authAdmin, authUser} = require("./middlewares/auth")
const app = express();

app.use("/" , (err, req ,res, next) => {
   if(err) {
    // log your error 
    res.status(500).send("something went wrong")
  }
})

app.get("/user",  (req,res) => {
  try {

  } catch (err) {
    res.status(500).send("some error occurred please contact support team")
  }
// logic of DB call and get user data 
  throw new error("something went wrong")
  res.send("User logged in successfully")
}) 

app.use("/" , (err, req ,res, next) => {
   if(err) {
    // log your error 
    res.status(500).send("something went wrong")
  }
})

app.listen(3000, () => {
  console.log("Server  is successfully listening on port 3000...");
});

// Note: Order of writing the routes matter a lot
