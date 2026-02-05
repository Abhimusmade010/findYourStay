import express from "express";
import dotenv from "dotenv";
dotenv.config();

// import connectDB from "./config/db.js";
// connectDB();

const app = express();

// Middlewares

// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true
// }));

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

export default app;
