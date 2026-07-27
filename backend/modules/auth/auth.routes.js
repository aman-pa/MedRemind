import { Router } from "express";
import validate from "../../middlewares/validate.middleware.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { loginSchema, registerSchema, verifyEmailSchema, forgetPasswordSchema, resetPasswordSchema, googleLoginSchema } from "./auth.validation.js";
import { login, register, getCurrentUser, verifyEmail,forgotPassword, resetPassword, logout, googleLogin } from "./auth.controller.js";
import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 request per 15 minutes
    message: { success: false, message: "Too many attempts from this IP, please try again after 15 minutes" },
    standardHeaders: true, 
    legacyHeaders: false,
});

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/google', authLimiter, validate(googleLoginSchema), googleLogin);
router.get('/me', authenticate, getCurrentUser);
router.post('/verify-email', validate(verifyEmailSchema), verifyEmail);
router.post('/forgot-password', authLimiter, validate(forgetPasswordSchema),forgotPassword );
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.post('/logout', logout);
export default router;