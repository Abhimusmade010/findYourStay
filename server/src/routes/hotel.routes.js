import express from "express";
import { getAllHotels,searchHotel,getoneHotel,createHotel, updateHotelController,getMyHotels} from "../controllers/hotel.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

import { createhotelSchema } from "../validations/hotel.validations.js";
import { validate } from "../middlewares/validate.middleware.js";
import {upload} from "../utils/multer.js";
const router = express.Router();


//customer routes

// route for getting all the hotels for the home page and also for the search result page
router.get("/gethotels",getAllHotels);

// route for searching the hotels based on the criteria provided by the user
router.get('/search',searchHotel);


// route for getting the details of the hotel when the user clicks on the hotel from the search result or from the home page
router.get('/gethotelDetails/:id',getoneHotel);

//admin routes

// route for creating the hotel by the admin with the authmiddleware and require role middleware and also the multer middleware for uploading the images of the hotel and also the validation middleware for validating the request body
router.post("/create",authMiddleware,requireRole("Admin"),upload.array("images", 5),validate(createhotelSchema),createHotel);


//later update for updating the hotel details and also add the authmiddleware and require role middleware not now
router.put("/update/:id", authMiddleware, requireRole("Admin"),validate(createhotelSchema), updateHotelController);


// route for getting the hotels of the admin who is logged in
router.get("/mine/list", authMiddleware, requireRole("Admin"), getMyHotels);


export default router;




