import express from "express";
import { getAllHotels,searchHotel,getoneHotel,createHotel, updateHotelController,getMyHotels} from "../controllers/hotel.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

import { createhotelSchema } from "../validations/hotel.validations.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();



router.get("/",getAllHotels);
router.post('/search',searchHotel);
router.get('/:id',getoneHotel);

//admin routes

router.post("/",authMiddleware,requireRole("Admin"),validate(createhotelSchema),createHotel);
router.put("/:id", authMiddleware, requireRole("Admin"),validate(createhotelSchema), updateHotelController);
router.get("/mine/list", authMiddleware, requireRole("Admin"), getMyHotels);


export default router;

