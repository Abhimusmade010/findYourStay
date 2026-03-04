import { getNotificationsForUser } from "../services/notification.service.js";

import { markNotificationRead } from "../services/notification.service.js";
export const getNotificationsController = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await getNotificationsForUser(userId);
    res.status(200).json({ result: notifications });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const markNotificationReadController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updated = await markNotificationRead(id, userId);
    res.status(200).json({ result: updated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
