import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addToWishlistcontroller } from "../controllers/wishlist.controller.js";
import { getwishlistcontroller } from "../controllers/wishlist.controller.js";
import { deletewishlistcontroller } from "../controllers/wishlist.controller.js";
import { requireRole } from "../middlewares/role.middleware.js";
const router = express.Router();



//add to wish route for the hotel
router.post("/addtowishlist",authMiddleware,requireRole("Customer") ,addToWishlistcontroller); 

//get wiishlist ropute for wishlist UI page
router.get("/getwishlist",authMiddleware,requireRole("Customer"),getwishlistcontroller);

//delete the wihslist route fro the UI page 
router.delete("/deletewishlist",authMiddleware,requireRole("Customer"),deletewishlistcontroller);


export default router;



