import { Router } from "express";
import validate from "../../middlewares/validate.middleware.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { patientProfileSchema } from "./patient.validation.js";
import { getMyProfile, updateProfile } from "./patient.controller.js";

const router = Router();

router.get('/me',authenticate, getMyProfile);
router.patch('/me',authenticate, validate(patientProfileSchema), updateProfile);
export default router;