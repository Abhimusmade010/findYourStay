import express from "express";
import { getAllHotels,searchHotel,getoneHotel,createHotel, updateHotelController,getMyHotels} from "../controllers/hotel.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/",getAllHotels);
router.post('/search',searchHotel);
router.get('/:id',getoneHotel);




router.post("/",authMiddleware,requireRole("Admin"),createHotel);
router.put("/:id", authMiddleware, requireRole("Admin"), updateHotelController);
router.get("/mine/list", authMiddleware, requireRole("Admin"), getMyHotels);



export default router;

