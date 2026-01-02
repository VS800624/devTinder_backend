const jwt = require("jsonwebtoken");
const cookie = require("cookie")

const socketAuthMiddleware = (socket, next) => {
  try {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "")

    const token = cookies.token

    if(!token) {
      return next(new Error("Authentication required"))
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    socket.user = decoded
    next()
    
  } catch(err){
   return next(new Error("Invalid or expired token"))
  }
}

module.exports = {socketAuthMiddleware}