import {
    getMyNotificationsService,
    markNotificationReadService,
    markAllNotificationsReadService,
    deleteNotificationService,
} from "./notification.service.js";

// GET /api/notifications?unreadOnly=true
export const getMyNotifications = async (req, res, next) => {
    try {
        const notifications = await getMyNotificationsService(req.user.id, {
            unreadOnly: req.query.unreadOnly === "true",
        });
        return res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        next(error);
    }
};

export const markNotificationRead = async (req, res, next) => {
    try {
        const notification = await markNotificationReadService(req.user.id, req.params.id);
        return res.status(200).json({ success: true, data: notification });
    } catch (error) {
        next(error);
    }
};

export const markAllNotificationsRead = async (req, res, next) => {
    try {
        await markAllNotificationsReadService(req.user.id);
        return res.status(200).json({ success: true, data: null });
    } catch (error) {
        next(error);
    }
};

export const deleteNotification = async (req, res, next) => {
    try {
        await deleteNotificationService(req.user.id, req.params.id);
        return res.status(200).json({ success: true, data: null });
    } catch (error) {
        next(error);
    }
};
