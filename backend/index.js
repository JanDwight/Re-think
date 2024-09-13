import express from "express";
import dotenv, { config } from "dotenv";

//local imports
import { connectDB } from "./db/connectDB.js"
import authRoute from "./routes/auth.route.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000

app.use(express.json());

app.use("/api/auth", authRoute);

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port: ", PORT);
});
