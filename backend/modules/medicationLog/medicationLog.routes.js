import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createMedicationLogSchema } from "./medicationLog.validation.js";
import { createMedicationLog, getMedicationLogs } from "./medicationLog.controller.js";

const router = Router();

router.use(authenticate);

router.post("/", validate(createMedicationLogSchema), createMedicationLog);
router.get("/", getMedicationLogs);

export default router;
