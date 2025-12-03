const jwt = require("jsonwebtoken");
const User = require("../models/user");


const userAuth = async(req, res, next) => {
  try {

    //  // Skip authentication for preflight OPTIONS request
    // if (req.method === "OPTIONS") {
    //   return next();
    // }
    
    //   const cookies = req.cookies
    //   const {token} = cookies // or
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login!")
    }
      // validate the token (secret key) and decode and return the payload (the data (_id) you originally stored in the token)
    const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET)
    const {_id} = decodedMessage 

    const user = await User.findById(_id)
    if (!user){
      throw new Error("User not found")
    }
    req.user = user
    next()
    
  } catch (err) {
    res.status(400).send("ERROR:" + err.message)
  }
};

module.exports = {
  userAuth,
};
