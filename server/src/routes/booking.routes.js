import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createBookingcontroller } from "../controllers/booking.controller.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { approveBookingController } from "../controllers/booking.controller.js";
import { getmyHotelsPendingBookingController } from "../controllers/booking.controller.js";
import { getMyConfirmedBookingsController } from "../controllers/booking.controller.js";
import {denyBookingController,getActiveBookingsForCustomerController,getBookingHistoryForCustomerController,} from "../controllers/booking.controller.js";

import { cancelBookingController } from "../controllers/booking.controller.js";

const router=express.Router();

router.post("/:id/cancel", authMiddleware,requireRole("Customer"), cancelBookingController);

router.post("/",authMiddleware,requireRole("Customer"),createBookingcontroller);

router.get("/history", authMiddleware, getBookingHistoryForCustomerController);

router.get("/active", authMiddleware, getActiveBookingsForCustomerController);

router.get('/pending',authMiddleware,requireRole("Admin"),getmyHotelsPendingBookingController);

router.post('/approve',authMiddleware,requireRole('Admin'),approveBookingController);

router.get('/owned/confirmed',authMiddleware,requireRole('Admin'),getMyConfirmedBookingsController);

router.post("/:id/deny", authMiddleware, requireRole("Admin"), denyBookingController);

export default router



