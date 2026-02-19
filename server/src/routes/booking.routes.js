import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createBookingcontroller } from "../controllers/booking.controller.js";

const router=express.Router();

router.post("/",authMiddleware,createBookingcontroller);

export default router