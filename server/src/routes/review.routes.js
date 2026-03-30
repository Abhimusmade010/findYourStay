import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getReviewsByHotelController } from "../controllers/review.controller.js";
import { addReviewController } from "../controllers/review.controller.js";
import { reviewSchemaforValidations } from "../validations/review.validations.js";
import { validate } from "../middlewares/validate.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/getreviewsforHotel/:hotelId", getReviewsByHotelController);
console.log("before add review controller")

router.post("/", authMiddleware,requireRole("Customer"),validate(reviewSchemaforValidations),addReviewController);

export default router;