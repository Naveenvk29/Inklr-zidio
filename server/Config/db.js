import mongoose from "mongoose";

const DB_NAME = "Inklr";

const connectDB = async () => {
  try {
    const connectInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      `MongoDB connected: ${connectInstance.connection.host} - ${connectInstance.connection.name}`
    );
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
