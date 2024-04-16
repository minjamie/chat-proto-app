import mongoose, { ConnectOptions } from "mongoose";
import "./env";
import colors, { yellow } from "colors";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI as string,
      {} as ConnectOptions
    );

    console.log(`mongoDB Connected ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) console.log(`Error ${error.message}`);
    process.exit();
  }
};
export default connectDB;
