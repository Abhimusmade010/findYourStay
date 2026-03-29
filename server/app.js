import express from "express";
import dotenv from "dotenv";
import cors from "cors"
dotenv.config();
import { swaggerSpec } from "./src/config/swagger.js";
import swaggerUi from "swagger-ui-express";

import routes from './src/routes/index.js'

const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors({
  origin: [
    "http://localhost:5173/",
    /^http:\/\/localhost:\d+$/   
  ],
  credentials: true
}));


app.use(express.urlencoded({ extended: true }));
console.log("!! Welcome Developer to the APP !!")
 

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

export default app;

