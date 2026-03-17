import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getReviewsByHotelController } from "../controllers/review.controller.js";
import { addReviewController } from "../controllers/review.controller.js";
import { reviewSchemaforValidations } from "../validations/review.validations.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.get("/hotel/:hotelId", getReviewsByHotelController);

router.post("/", authMiddleware,validate(reviewSchemaforValidations),addReviewController);

export default router;