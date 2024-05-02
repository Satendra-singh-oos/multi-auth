import mongoose from "mongoose";

import { DB_NAME } from "../constant";

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    console.log(
      `Db Connect Succesfullt the host of db is ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Unable to connect with db", error);
    process.exit(1);
  }
};

export default connectDb;
