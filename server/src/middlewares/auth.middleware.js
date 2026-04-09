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
    
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = header.replace("Bearer ", "").trim();

   
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    const cacheKey = `user:${payload.userId}`;
    const cachedUser = await redisClient.get(cacheKey);

    if (cachedUser) {
      console.log("Cache hit for user:", payload.userId);
      //CACHE HIT — no MongoDB query needed
      req.user = JSON.parse(cachedUser);
      return next();
    }

    //Cache MISS — query MongoDB
    console.log("Cache miss for user:", payload.userId);
    const user = await User.findById(payload.userId).select("-passwordHash");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }


    await redisClient.set(cacheKey, JSON.stringify(user.toJSON()), {
      EX: USER_CACHE_TTL,
    });

    req.user = user;
    next();

  } catch (err) {
    // JWT expired, invalid signature, or Redis error
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please login again." });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ message: "Authentication failed" });
  }
};

//  Call this whenever user data changes (profile update, role change, etc.)
//  so the next request fetches fresh data from MongoDB.
//  Us/age: await invalidateUserCache(userId)

export const invalidateUserCache = async (userId) => {
  await redisClient.del(`user:${userId}`);
};
