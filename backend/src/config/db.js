const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined");
  }

  const connection = await mongoose.connect(mongoUri, {
    autoIndex: true,
  });

  return connection;
};

module.exports = connectDB;
