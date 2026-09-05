import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { doctorProfileSchema } from "./doctor.validation.js";
import { getMyProfile, updateProfile } from "./doctor.controller.js";
const router = Router();

router.get('/me',authenticate, getMyProfile);
router.patch('/me',authenticate, validate(doctorProfileSchema), updateProfile);

export default router;
