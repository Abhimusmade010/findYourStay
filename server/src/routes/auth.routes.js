// routes/auth.routes.js
import express from "express";

import { signUpUser,loginUser } from "../controllers/auth.controller.js";

const router = express.Router();

console.log("inside auth.routes file")
router.post("/register", signUpUser);

router.post("/login", loginUser);

export default router;
