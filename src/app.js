require("dotenv").config()
const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const http = require("http")


//  Setup CORS
app.use(
  cors({
     origin: [
      "http://localhost:5173",
      "https://devtinder619.netlify.app"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Razorpay webhook — RAW BODY (must be first)
// app.use(
//   "/payment/webhook",
//   express.raw({ type: "application/json" })
// );

// Handle CORS Preflight requests
app.options("*", cors());

//  Body parsing + cookies
app.use(express.json());
app.use(cookieParser());



const  authRouter = require("./routes/auth")
const  profileRouter = require("./routes/profile")
const  requestRouter = require("./routes/request");
const  userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)
app.use("/", paymentRouter)
app.use("/", chatRouter)

const server = http.createServer(app)
initializeSocket(server)

connectDB()
  .then(() => {
    console.log("Database connection established");
    server.listen(process.env.PORT, () => {
      console.log("Server  is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });

// Note: Order of writing the routes matter a lot
