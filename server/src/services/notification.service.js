import Notification from "../models/notification.model.js";

export const createNotification = async (userId, message) => {
  return Notification.create({ user: userId, message });
};

export const getNotificationsForUser = async (userId) => {
  return Notification.find({ user: userId }).sort({ createdAt: -1 });
};

export const markNotificationRead = async (notificationId, userId) => {
  const notif = await Notification.findById(notificationId);
  if (!notif) throw new Error("Notification not found");
  if (String(notif.user) !== String(userId)) throw new Error("Not authorized");
  notif.read = true;
  await notif.save();
  return notif;
};
