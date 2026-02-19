import express from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addToWishlistcontroller } from "../controllers/wishlist.controller.js";

const router = express.Router();

console.log("in the wishlist routing")
router.post("/wishlist",authMiddleware, addToWishlistcontroller);   

export default router;



