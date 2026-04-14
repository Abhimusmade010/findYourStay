import express from "express";
import authRoutes from './auth.routes.js'
import bookingRoutes from './booking.routes.js'
import hotelRoutes from './hotel.routes.js'
import reviewRoutes from './review.routes.js'
import wishlistRoutes from './wishlist.routes.js'
import notificationRoutes from './notification.routes.js'
import superAdminRoutes from './superadmin.routes.js'


const router=express.Router();

router.use("/auth", authRoutes);
router.use("/hotels", hotelRoutes);
router.use("/bookings",bookingRoutes);
router.use("/wishlists",wishlistRoutes);
router.use("/reviews",reviewRoutes);
router.use("/notifications", notificationRoutes);
router.use("/super-admin", superAdminRoutes);

export default router;


