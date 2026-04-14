import express from "express";
import dotenv from "dotenv";
import cors from "cors"
dotenv.config();
import { swaggerSpec } from "./src/config/swagger.js";
import swaggerUi from "swagger-ui-express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
// Security middlewares
import routes from './src/routes/index.js'


const app = express();
app.use(express.json());
app.use(helmet());


app.use(cors({
  origin: [
    "http://localhost:5173",
    /^http:\/\/localhost:\d+$/   
  ],
  credentials: true
}));

// order of cors helmet and rate limit is as:
// 1. CORS to handle cross-origin requests and preflight checks
// 2. Helmet to set secure HTTP headers
// 3. Rate limiting to prevent abuse after security checks are in place


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
app.use(globalLimiter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(express.urlencoded({extended:true}));

app.use("/api", routes);


app.get("/", (req, res) => {
  res.send("Server is running...");
});

export default app;

