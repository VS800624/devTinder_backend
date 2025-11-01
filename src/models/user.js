const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  firstName : {
    type: String,
    required: true,
    maxLength: 50,
    minLength: 4,
  },
  lastName: {
    type: String,
     maxLength: 50,
     minLength: 4,
  },
  emailId: {
    type: String,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  age: {
    type: Number,
    max: 100,
    min: 18,
  }, 
  gender: {
    type: String,
    validate(value) {
      if(!["male", "female", "others"].includes(value)){
        throw new Error("Gender data is not valid")
      }
    }
  },
   photoUrl : {
    type: String,
    default: "https://weimaracademy.org/wp-content/uploads/2021/08/dummy-user.png"
  },
  about: {
    type: String,
    default: "This is a default about of the user!",
     minLength: 10,
     maxLength: 100,
  },
  skills: {
    type: [String]
  },
}, {
  timestamps: true
})

const User = mongoose.model("User",userSchema)

module.exports = User

