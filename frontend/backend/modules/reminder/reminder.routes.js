import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createReminderSchema, updateReminderSchema } from "./reminder.validation.js";
import {
    createReminder,
    getRemindersForMedicine,
    updateReminder,
    deleteReminder,
} from "./reminder.controller.js";

const router = Router();

router.use(authenticate);

router.post("/", validate(createReminderSchema), createReminder);
router.get("/medicine/:medicineId", getRemindersForMedicine);
router.patch("/:id", validate(updateReminderSchema), updateReminder);
router.delete("/:id", deleteReminder);

export default router;
