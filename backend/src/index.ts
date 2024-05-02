import dotenv from "dotenv";
import connectDb from "./db";
import { app } from "./app";

dotenv.config({
  path: "./env",
});

connectDb()
  .then(() => {
    app.listen(process.env.PORT || 6570, () => {
      console.log(
        `Server is up and Running on the port :${process.env.PORT || 6570}`
      );
    });

    app.on("error", (error) => {
      console.log("Server fails to connect ERROR: ", error);
      throw error;
    });
  })
  .catch((err) => {
    console.log("MongoDb Failed To Connect: ", err);
  });
