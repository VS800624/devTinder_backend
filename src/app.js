const express = require("express");
const { authAdmin, authUser } = require("./middlewares/auth");
const app = express();
const User = require("./models/user");
const validator = require("validator");
const bcrypt = require("bcrypt");
const connectDB = require("./config/database");
const { validateSignUpData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  // console.log(req.body)

  try {
    // Validation of data
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    // Creating the new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User added successfully!");
  } catch (err) {
    res.status(400).send("Error adding the user:" + err.message);
  }
});

app.post("login", async (req, res) => {
  try {
    const { emailId, password } = res.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Email is not valid");
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // Create a JWT Token

      const token = await jwt.sign({ _id: user._id }, "DEV@TINDER$619");
      console.log(token);

      // Add the token to cookie and send the response back to the user
      res.cookie("token", token);
      res.send("Logged in successfully");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;

    const { token } = cookies;
    // console.log(cookies)
    // console.log(token)
    if (!token) {
      throw new Error("Invalid Token");
    }

    // validate the token
    const decodedMessage = await jwt.verify(token, "DEV@TINDER$619");
    const { _id } = decodedMessage;
    console.log("Logged in uer is:" + _id);

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User did not exit");
    }
    console.log(user);
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.findOne({ emailId: userEmail });
    // const user = await User.findById({_id: userId})
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }

    // const users = await User.find({ emailId: userEmail })
    // if(!users){
    //   res.send(400).send("User not found")
    // }else {
    //   res.send(users)
    // }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Feed API - Get/feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// delete a user form the database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    // const user = await User.findByIdAndDelete({_id: userId})
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Update data for the user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const allowed_update = ["skills", "age", "gender", "photoUrl", "about"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      allowed_update.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update is not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    // const user = await User.findByIdAndUpdate({_id:userId}, data)
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(3000, () => {
      console.log("Server  is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });

// Note: Order of writing the routes matter a lot
