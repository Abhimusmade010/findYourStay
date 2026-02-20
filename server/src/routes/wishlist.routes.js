import express from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addToWishlistcontroller } from "../controllers/wishlist.controller.js";
import { getwishlistcontroller } from "../controllers/wishlist.controller.js";
import { deletewishlistcontroller } from "../controllers/wishlist.controller.js";
const router = express.Router();

console.log("in the wishlist routing")
router.post("/wishlist",authMiddleware, addToWishlistcontroller);   
router.get("/wishlist",authMiddleware,getwishlistcontroller);
router.delete("/wishlist",authMiddleware,deletewishlistcontroller);

export default router;



