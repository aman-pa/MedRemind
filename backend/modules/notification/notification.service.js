import Notification from "./notification.model.js";
import ApiError from "../../shared/utils/ApiError.js";

// Internal - called from other modules (e.g. MedicationLog on a missed dose).
// Not exposed as a route; there is no "create notification" API for clients.
export const createNotificationService = async ({ userId, type, title, message, relatedMedicineId = null }) => {
    return Notification.create({ userId, type, title, message, relatedMedicineId });
};

export const getMyNotificationsService = async (userId, { unreadOnly } = {}) => {
    const filter = { userId };
    if (unreadOnly) filter.isRead = false;
    return Notification.find(filter).sort({ createdAt: -1 }).limit(50);
};

export const markNotificationReadService = async (userId, notificationId) => {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
        throw new ApiError(404, "Notification not found.");
    }
    if (notification.userId.toString() !== userId) {
        throw new ApiError(403, "You do not have access to this notification.");
    }
    notification.isRead = true;
    await notification.save();
    return notification;
};

export const markAllNotificationsReadService = async (userId) => {
    await Notification.updateMany({ userId, isRead: false }, { $set: { isRead: true } });
};

export const deleteNotificationService = async (userId, notificationId) => {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
        throw new ApiError(404, "Notification not found.");
    }
    if (notification.userId.toString() !== userId) {
        throw new ApiError(403, "You do not have access to this notification.");
    }
    await Notification.deleteOne({ _id: notificationId });
};
