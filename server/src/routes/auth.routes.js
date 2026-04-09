import { signUpUser,loginUser } from "../controllers/auth.controller.js";
import { registerUserSchema } from "../validations/user.validations.js"
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema } from "../validations/user.validations.js";

import express from "express";
const router = express.Router();



router.post("/register",validate(registerUserSchema) ,signUpUser);

router.post("/login", validate(loginSchema),loginUser);


export default router;
