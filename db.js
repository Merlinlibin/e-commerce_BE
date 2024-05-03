const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI).then(() => {
      console.log("connected to DB successfully...");
    });
  } catch (error) {
    console.log("Error is :" + error.message);
  }
};
module.exports = connectDB;
