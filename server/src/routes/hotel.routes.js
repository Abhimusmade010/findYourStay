
// routes/hotel.routes.js
import express from "express";

import { getAllHotels,searchHotel,getoneHotel,createHotel, updateHotelController,getMyHotels} from "../controllers/hotel.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
const router = express.Router();


// check whether user ig logged in or not 
router.get("/",getAllHotels);
router.post('/search',searchHotel);
router.get('/:id',getoneHotel);


// Admin endpoints
//create hotel


router.post("/",authMiddleware,requireRole("Admin"),createHotel);

router.put("/:id", authMiddleware, requireRole("Admin"), updateHotelController);

// router.put("/",authMiddleware,requireRole("Admin"));

router.get("/mine/list", authMiddleware, requireRole("Admin"), getMyHotels);



// router.
// router.delete("/:id",authMiddleware,requireRole("admin"),deleteHotel);
//delete hotel
//update hotel



export default router;

