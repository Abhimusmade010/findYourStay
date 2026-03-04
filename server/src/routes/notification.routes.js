
import express from "express";
import {authMiddleware} from "../middlewares/auth.middleware.js";
import { getNotificationsController } from "../controllers/notification.controller.js";
import { markNotificationReadController } from "../controllers/notification.controller.js";

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: User notifications about booking status
 */

const router = express.Router();

// all routes require authentication
/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications for current user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *       400:
 *         description: Bad request
 */
router.get("/", authMiddleware, getNotificationsController);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Notification updated
 *       400:
 *         description: Bad request
 */
router.patch("/:id/read", authMiddleware, markNotificationReadController);

export default router;
