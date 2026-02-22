import express from "express";
import authRoutes from './auth.routes.js'
import bookingRoutes from './booking.routes.js'
import hotelRoutes from './hotel.routes.js'
// import reviewRoutes from './review.routes.js'
import wishlistRoutes from './wishlist.routes.js'

const router=express.Router();

console.log("inside the index,js for routes!");


router.use("/auth", authRoutes);
router.use("/hotels", hotelRoutes);

router.use("/bookings",bookingRoutes);



router.use("/",wishlistRoutes);

// app.use("/api/reviews",reviewRoutes);

export default router
