import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getReviewsByHotelController } from "../controllers/review.controller.js";
import { addReviewController } from "../controllers/review.controller.js";
const router = express.Router();


router.get("/hotel/:hotelId", getReviewsByHotelController);


router.post("/", authMiddleware, addReviewController);

export default router;
