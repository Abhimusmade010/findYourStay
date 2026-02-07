
// routes/hotel.routes.js
import express from "express";

import { getAllHotels,searchHotel ,getoneHotel} from "../controllers/hotel.controller.js";
const router = express.Router();


// check whether user ig logged in or not 
router.get("/",getAllHotels);
router.post('/search',searchHotel);
router.get('/:id',getoneHotel);

// Admin endpoints


export default router;

