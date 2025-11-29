const mongoose = require("mongoose")

const connectDB = async () => {
  await mongoose.connect("mongodb+srv://Vishal:CGj9ZaQFZgBuAt7e@namastenode.ag4ygsz.mongodb.net/devTinder")
}

module.exports = connectDB