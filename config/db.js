const mongoose = require("mongoose");


//connect with database
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/food-delivery";

  await mongoose.connect(uri);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
};

module.exports = connectDB;
