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
    // ─── Step 1: Extract and validate the JWT token ───
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = header.replace("Bearer ", "").trim();

    // ─── Step 2: Verify JWT (fast, in-memory, no DB hit) ───
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload = { userId: "abc123", role: "Customer", iat: ..., exp: ... }

    // ─── Step 3: Check Redis cache for user data ───
    const cacheKey = `user:${payload.userId}`;
    const cachedUser = await redisClient.get(cacheKey);

    if (cachedUser) {
      // ✅ CACHE HIT — no MongoDB query needed
      req.user = JSON.parse(cachedUser);
      return next();
    }

    // ─── Step 4: Cache MISS — query MongoDB ───
    const user = await User.findById(payload.userId).select("-passwordHash");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // ─── Step 5: Store in Redis for next time (TTL = 5 minutes) ───
    // We store a plain object, not the Mongoose document, to keep it lightweight
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

/**
 * Helper: Invalidate cached user data
 *
 * Call this whenever user data changes (profile update, role change, etc.)
 * so the next request fetches fresh data from MongoDB.
 *
 * Usage: await invalidateUserCache(userId)
 */
export const invalidateUserCache = async (userId) => {
  await redisClient.del(`user:${userId}`);
};
