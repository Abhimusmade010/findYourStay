import express from "express";
import authRoutes from './auth.routes.js'
// import bookingRoutes from './booking.routes.js'
// import hotelRoutes from './hotel.routes.js'
// import reviewRoutes from './review.routes.js'
// import wishlistRoutes from './wishlist.routes'

const router=express.Router();

console.log("inside the index,js for routes!");

router.use("/auth", authRoutes);
// app.use("/api/hotels", hotelRoutes);
// app.use("/api/bookings", bookingRoutes);
// app.use("/api/reviews", reviewRoutes);
// app.use("/api", wishlistRoutes);

export default router
