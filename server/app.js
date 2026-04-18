import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

import { swaggerSpec } from "./src/config/swagger.js";
import swaggerUi from "swagger-ui-express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routes from './src/routes/index.js'
import { errorHandler } from "./src/middlewares/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Security middlewares
app.use(helmet({
  contentSecurityPolicy: false, 
}));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || /^http:\/\/localhost:\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Strict limiter for auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { status: "error", message: "Too many login attempts" }
});

//  General limiter for API
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
});

app.use('/api/auth', authLimiter);
app.use('/api', globalLimiter);

// API Routes
app.use("/api", routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Static Files & API Fallback
const clientBuildPath = path.join(__dirname, "../client/dist");

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get("*", (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientBuildPath, "index.html"));
    }
  });
} else {

  app.get("/", (req, res) => {
    res.json({ status: "success", message: "FindYourStay API is active" });
  });
}

// Global Error Handler
app.use(errorHandler);

export default app;

