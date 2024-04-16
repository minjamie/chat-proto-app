import colors from "colors";
import mongoose, { ConnectOptions } from "mongoose";
import "./env";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI as string,
      {} as ConnectOptions
    );
  
    console.log(colors.cyan.underline(`mongoDB Connected ${conn.connection.host}`));
  } catch (error) {
    if (error instanceof Error) console.log(colors.red(`Error ${error.message}`));
    process.exit();
  }
};
export default connectDB;
