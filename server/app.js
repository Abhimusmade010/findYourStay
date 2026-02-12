import express from "express";
import dotenv from "dotenv";
import cors from "cors"
dotenv.config();

import routes from './src/routes/index.js'
import { connectDB } from "./src/config/db.js";
// import {redisClient} from "./src/config/redis.js"

connectDB();
console.log("MONGO-url",process.env.MONGO_URI)
const app = express();
console.log("abhishek")
app.use(express.json());


// await redisClient.set("name","key");

// await redisClient.set("name","abhishek");
// const value=await redisClient.get("name");
// await redisClient.set("key", "value", {
//   EX: 60   // expire in 60 seconds
// });

// await redisClient.del("key");



app.use(cors({
  origin: [
    "http://localhost:5173/",
    /^http:\/\/localhost:\d+$/   
  ],
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
console.log("inside the app,js")
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

export default app;

