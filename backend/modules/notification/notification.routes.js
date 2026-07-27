import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import {
    getMyNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
} from "./notification.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", getMyNotifications);
router.patch("/:id/read", markNotificationRead);
router.patch("/read-all", markAllNotificationsRead);
router.delete("/:id", deleteNotification);

export default router;
