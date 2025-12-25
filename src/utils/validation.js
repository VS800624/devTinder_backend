const validator = require("validator")

const validateSignUpData = (req) => {
  const {firstName, lastName, emailId, password} = req.body
  if(!firstName || !lastName) {
    throw new Error ("Please enter the name")
  }
  if (!validator.isEmail(emailId)){
    throw new Error("Email is not valid")
  }
  if (!validator.isStrongPassword(password)){
    throw new Error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.")
  }
}

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "photoUrl", "about", "skills", "age", "gender"] 
  const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field))
  return isEditAllowed
}

module.exports = {
  validateSignUpData,
  validateEditProfileData
}