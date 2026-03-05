import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addToWishlistcontroller } from "../controllers/wishlist.controller.js";
import { getwishlistcontroller } from "../controllers/wishlist.controller.js";
import { deletewishlistcontroller } from "../controllers/wishlist.controller.js";
const router = express.Router();



//add to wish route for the hotel
router.post("/wishlist",authMiddleware, addToWishlistcontroller); 

//get wiishlist ropute for wishlist UI page
router.get("/wishlist",authMiddleware,getwishlistcontroller);

//delete the wihslist route fro the UI page 
router.delete("/wishlist",authMiddleware,deletewishlistcontroller);

export default router;



