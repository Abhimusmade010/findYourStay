import { getNotificationsForUser } from "../services/notification.service.js";

import { markNotificationRead } from "../services/notification.service.js";
export const getNotificationsController = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await getNotificationsForUser(userId);
    res.status(200).json({ 
      status: "success",
      message: "Notifications fetched successfully",
      result: notifications 
    });
  } catch (error) {
    res.status(400).json({ status: "error", message : error.message });
  }
};

export const markNotificationReadController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updated = await markNotificationRead(id, userId);
    res.status(200).json({ status: "success", message: "Notification marked as read", result: updated });
  } catch (error) {
    res.status(400).json({ status: "error", message : error.message });
  }
};
