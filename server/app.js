import express from "express";
import dotenv from "dotenv";
import cors from "cors"
dotenv.config();

import routes from './src/routes/index.js'
import { connectDB } from "./src/config/db.js";
connectDB();
console.log("MONGO-url",process.env.MONGO_URI)
const app = express();
console.log("abhishek")
app.use(express.json());


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

