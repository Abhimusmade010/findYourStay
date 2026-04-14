import { signUpUser, loginUser, createAdminController } from "../controllers/auth.controller.js";
import { registerUserSchema, loginSchema, createAdminSchema } from "../validations/user.validations.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

import express from "express";
const router = express.Router();


//Public routes
// Anyone can register (always creates a Customer)
router.post("/register", validate(registerUserSchema), signUpUser);

// Anyone can login
router.post("/login", validate(loginSchema), loginUser);


//Protected routes 

// Only a SuperAdmin can create new Admin accounts
router.post("/create-admin",validate(createAdminSchema),authMiddleware,requireRole("SuperAdmin"),createAdminController);


export default router;

