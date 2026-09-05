import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import patientRoutes from "../modules/patient/patient.routes.js";
import doctorRoutes from "../modules/doctor/doctor.routes.js";
import connectionRoutes from "../modules/connection/connection.routes.js";
import medicineRoutes from "../modules/medicine/medicine.routes.js";
import reminderRoutes from "../modules/reminder/reminder.routes.js";
import medicationLogRoutes from "../modules/medicationLog/medicationLog.routes.js";
import notificationRoutes from "../modules/notification/notification.routes.js";
import analyticsRoutes from "../modules/analytics/analytics.routes.js";
const router = Router();

router.use('/auth', authRoutes);
router.use('/patient', patientRoutes);
router.use('/doctor', doctorRoutes);
router.use('/connections', connectionRoutes);
router.use('/medicines', medicineRoutes);
router.use('/reminders', reminderRoutes);
router.use('/medication-logs', medicationLogRoutes);
router.use('/notifications', notificationRoutes);
router.use('/analytics', analyticsRoutes);

export default router