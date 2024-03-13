const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/test");
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(error.message);
  }
}
module.exports = connectDB;
