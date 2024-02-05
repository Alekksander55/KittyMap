import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDB: ${connect.connection.host}`);
  } catch (error) {
    console.log("Error in connectToDb=> ", error);
    process.exit(1)
  }
};

export default connectToDb;
