const jwt = require("jsonwebtoken");
const User = require("../models/user");


const userAuth = async(req, res, next) => {
  try {

    //  // Skip authentication for preflight OPTIONS request
    // if (req.method === "OPTIONS") {
    //   return next();
    // }
    // console.log("STEP 1: Cookies OK");
    
    //   const cookies = req.cookies
    //   const {token} = cookies // or
    const { token } = req.cookies;
      //  console.log("STEP 2: Token =", token);
    if (!token) {
      return res.status(401).send("Please Login!")
    }
      // validate the token (secret key) and decode and return the payload (the data (_id) you originally stored in the token)
    const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET)
    //  console.log("STEP 3: Decoded =", decodedMessage);
    const {_id} = decodedMessage 

    const user = await User.findById(_id)
    // console.log("STEP 4: User =", user);
    if (!user){
      throw new Error("User not found")
    }
    // console.log("COOKIES:", req.cookies);
    req.user = user
    next()
    
  } catch (err) {
    //  console.error("AUTH ERROR:", err.message);
    res.status(400).send("ERROR:" + err.message)
  }
};

module.exports = {
  userAuth,
};
