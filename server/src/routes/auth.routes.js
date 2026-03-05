import { signUpUser,loginUser } from "../controllers/auth.controller.js";


import express from "express";
const router = express.Router();



router.post("/register", signUpUser);

router.post("/login", loginUser);

export default router;
