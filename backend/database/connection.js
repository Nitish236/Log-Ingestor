require("dotenv").config();

const mongoose = require("mongoose");

const connectToDatabase = async () => {
  mongoose.set("strictQuery", false);
  return mongoose.connect(process.env.DB_URI);
};

module.exports = connectToDatabase;
