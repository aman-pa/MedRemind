import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { getPatientAnalytics, getDoctorAnalytics, getDashboardOverview } from "./analytics.controller.js";

const router = Router();

router.use(authenticate);

router.get("/patient", getPatientAnalytics);
router.get("/doctor", getDoctorAnalytics);
router.get("/dashboard", getDashboardOverview);

export default router;
