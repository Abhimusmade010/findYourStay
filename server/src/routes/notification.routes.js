
import express from "express";
import {authMiddleware} from "../middlewares/auth.middleware.js";
import { getNotificationsController } from "../controllers/notification.controller.js";
import { markNotificationReadController } from "../controllers/notification.controller.js";


const router = express.Router();

// all routes require authentication


router.get("/", authMiddleware, getNotificationsController);


router.patch("/:id/read", authMiddleware, markNotificationReadController);

export default router;
