import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createBookingcontroller } from "../controllers/booking.controller.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { approveBookingController } from "../controllers/booking.controller.js";
import { getmyHotelsPendingBookingController } from "../controllers/booking.controller.js";
import { getMyConfirmedBookingsController } from "../controllers/booking.controller.js";
// const router=express.Router();

import {
  denyBookingController,
  getActiveBookingsForCustomerController,
  getBookingHistoryForCustomerController,
} from "../controllers/booking.controller.js";
const router=express.Router();

router.post("/",authMiddleware,createBookingcontroller);



router.get("/history", authMiddleware, getBookingHistoryForCustomerController);


router.get("/active", authMiddleware, getActiveBookingsForCustomerController);

// console.log("in the bookinf routebefore getmyHotelsPendingBookingController")
router.get('/pending',authMiddleware,requireRole("Admin"),getmyHotelsPendingBookingController);
router.post('/approve',authMiddleware,requireRole('Admin'),approveBookingController);

router.get('/owned/confirmed',authMiddleware,requireRole('Admin'),getMyConfirmedBookingsController);

export default router

