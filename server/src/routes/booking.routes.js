import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createBookingcontroller } from "../controllers/booking.controller.js";
import { requireRole } from "../middlewares/role.middleware.js";
// import { approveBookingController } from "../controllers/booking.controller.js";
import { getmyHotelsPendingBookingController } from "../controllers/booking.controller.js";
const router=express.Router();

router.post("/",authMiddleware,createBookingcontroller);

console.log("in the bookinf routebefore getmyHotelsPendingBookingController")
router.get('/pending',authMiddleware,requireRole("Admin"),getmyHotelsPendingBookingController);
// router.post("/",authMiddleware,requireRole('admin'),approveBookingController);
export default router
