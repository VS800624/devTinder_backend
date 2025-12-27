const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: 50,
      minlength: 3,
    },
    lastName: {
      type: String,
      maxlength: 50,
      minlength: 3,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address:" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Please enter a strong password");
        }
      },
    },
    age: {
      type: Number,
      max: 100,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
    },
    // membershipValidity
    photoUrl: {
      type: String,
      default:
        "https://weimaracademy.org/wp-content/uploads/2021/08/dummy-user.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo Url :" + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about of the user!",
      minlength: 10,
      maxlength: 400,
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length < 1) {
          throw new Error("At least one skill is required");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ firstName: 1, lastName: 1 });
// userSchema.index({gender: 1})

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
