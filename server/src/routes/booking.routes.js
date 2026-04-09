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

// routes for the booking of the hotels by the customers and also the approval and denial of the booking by the admin for the customers

// route for the customer to cancel the booking
router.post("/:id/cancel", authMiddleware,requireRole("Customer"), cancelBookingController);



// route for the customer to create a booking for the hotel
router.post("/create-booking",authMiddleware,requireRole("Customer"),createBookingcontroller);


// route for the customer to get the confirmed bookings by the admin for the hotels they have booked
router.get("/gethistoryforCustomer", authMiddleware, getBookingHistoryForCustomerController);


// route for the admin to approve the booking of the customer for the hotel
router.get("/getactiveforCustomer", authMiddleware, getActiveBookingsForCustomerController);



// route for the admin to get the pending bookings of the hotels they own
router.get('/getpendingforAdmin',authMiddleware,requireRole("Admin"),getmyHotelsPendingBookingController);

//approve booking by admin
router.post('/approve',authMiddleware,requireRole('Admin'),approveBookingController);


// route for the admin to get the confirmed bookings of the hotels they own
router.get('/owned/confirmed',authMiddleware,requireRole('Admin'),getMyConfirmedBookingsController);


// route for the admin to deny the booking of the customer for the hotel
router.post("/:id/deny", authMiddleware, requireRole("Admin"), denyBookingController);

export default router



