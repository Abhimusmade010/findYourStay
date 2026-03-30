import express from "express";
import { getAllHotels,searchHotel,getoneHotel,createHotel, updateHotelController,getMyHotels} from "../controllers/hotel.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

import { createhotelSchema } from "../validations/hotel.validations.js";
import { validate } from "../middlewares/validate.middleware.js";
import {upload} from "../utils/multer.js";
const router = express.Router();



router.get("/getHotels",getAllHotels);
router.post('/search',searchHotel);
router.get('/gethotelDetails/:id',getoneHotel);

//admin routes

router.post("/",authMiddleware,requireRole("Admin"),upload.array("images", 5),validate(createhotelSchema),createHotel);

//later update for updating the hotel details and also add the authmiddleware and require role middleware not now
router.put("/:id", authMiddleware, requireRole("Admin"),validate(createhotelSchema), updateHotelController);
router.get("/mine/list", authMiddleware, requireRole("Admin"), getMyHotels);

export default router;




