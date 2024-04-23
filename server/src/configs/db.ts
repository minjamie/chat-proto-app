import colors from "colors";
import mongoose from "mongoose";
import "./env";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);

    console.log(
      colors.cyan.underline(`mongoDB Connected ${conn.connection.host}`)
    );
  } catch (error) {
    if (error instanceof Error)
      console.log(colors.red(`Error ${error.message}`));
    process.exit();
  }
};
export default connectDB;
