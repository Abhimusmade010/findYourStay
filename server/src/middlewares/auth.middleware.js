// middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js"
import { redisClient } from "../config/redis.js";
import dotenv from "dotenv";
dotenv.config();

// Cache TTL in seconds (5 minutes)
const USER_CACHE_TTL = 300;


export const authMiddleware = async (req, res, next) => {
  try {

    // 1. Extract token
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized: No token provided"
      });
    }

    const token = header.replace("Bearer ", "").trim();

    // 2. Verify JWT
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const cacheKey = `user:${payload.userId}`;

    let cachedUser = null;

    // 3. Try Redis
    try {

      cachedUser = await redisClient.get(cacheKey);

    } catch (redisError) {

      console.error(
        "Redis unavailable, falling back to MongoDB:",
        redisError.message
      );

      cachedUser = null;
    }

    // 4. Redis cache hit
    if (cachedUser) {

      req.user = JSON.parse(cachedUser);

      return next();
    }

    // 5. Redis miss OR Redis unavailable
    const user = await User
      .findById(payload.userId)
      .select("-passwordHash");

    if (!user) {

      return res.status(401).json({
        message: "Unauthorized: User not found"
      });

    }

    // 6. Try storing user in Redis
    try {

      await redisClient.set(
        cacheKey,
        JSON.stringify(user.toJSON()),
        {
          EX: USER_CACHE_TTL
        }
      );

    } catch (redisError) {

      console.error(
        "Redis cache write failed:",
        redisError.message
      );

      // Don't fail authentication because cache failed
    }

    // 7. Continue authentication
    req.user = user;

    next();

  } catch (err) {

    if (err.name === "TokenExpiredError") {

      return res.status(401).json({
        message: "Token expired. Please login again."
      });

    }

    if (err.name === "JsonWebTokenError") {

      return res.status(401).json({
        message: "Invalid token"
      });

    }

    console.error(
      "Auth middleware error:",
      err.message
    );

    return res.status(500).json({
      message: "Authentication service error"
    });
  }
};



export const invalidateUserCache = async (userId) => {
  await redisClient.del(`user:${userId}`);
};
