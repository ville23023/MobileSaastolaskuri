const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("DB Connection Error", err.message);
    throw err;
  }
};

module.exports = connectDB;
