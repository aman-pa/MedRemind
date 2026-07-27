import { z } from "zod";

export const registerSchema = z.object({
    body: z.object({
        name: z
            .string()
            .trim()
            .min(2, "Name must contain at least 2 characters")
            .max(100, "Name cannot exceed 100 characters"),

        email: z
            .string()
            .trim()
            .email("Invalid email address")
            .toLowerCase(),

        password: z
            .string()
            .min(8, "Password must contain at least 8 characters")
            .max(100),

        role: z.enum(["doctor", "patient"]),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z
            .string()
            .trim()
            .email("Invalid email address")
            .toLowerCase(),

        password: z
            .string()
            .min(8, "Password must contain at least 8 characters")
            .max(100),
    }),
});

export const verifyEmailSchema = z.object({
    body: z.object({
        token: z
            .string()
            .trim()
            .min(1, "Verification token is required."),
    }),
});

export const forgetPasswordSchema = z.object({
    body: z.object({
        email: z
            .string()
            .trim()
            .email("Invalid email address")
            .toLowerCase(),
    }),
});

export const resetPasswordSchema = z.object({
    body: z.object({
        token: z
            .string()
            .trim()
            .min(1, "Reset token is required."),

        password: z
            .string()
            .min(8, "Password must contain at least 8 characters")
            .max(100),
    }),
});

export const googleLoginSchema = z.object({
    body: z.object({
        token: z.string().trim().min(1, "Google token is required."),
        role: z.enum(["doctor", "patient"]).optional(),
    }),
});