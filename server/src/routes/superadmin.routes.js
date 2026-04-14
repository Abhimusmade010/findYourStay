import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import {createAdminController,getAllAdminsController,deleteAdminController} from "../controllers/auth.controller.js";
import {getAllHotelsForSuperAdmin,deleteHotelController} from "../controllers/hotel.controller.js";
import { createAdminSchema } from "../validations/user.validations.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

// All routes below are protected — SuperAdmin only
router.use(authMiddleware, requireRole("SuperAdmin"));

// ─── Admin management ───
router.post("/admins",  validate(createAdminSchema), createAdminController);    // create admin
router.get("/admins",   getAllAdminsController);                                // list all admins
router.delete("/admins/:id", deleteAdminController);                            // delete an admin

// ─── Hotel management ───
router.get("/hotels",   getAllHotelsForSuperAdmin);                             // list all hotels with creator
router.delete("/hotels/:id", deleteHotelController);                           // delete any hotel

export default router;
