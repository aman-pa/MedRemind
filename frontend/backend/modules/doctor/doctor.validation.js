import { z } from "zod";

const addressSchema = z.object({
    street: z
        .string()
        .trim()
        .optional()
        .nullable(),

    city: z
        .string()
        .trim()
        .optional()
        .nullable(),

    state: z
        .string()
        .trim()
        .optional()
        .nullable(),

    country: z
        .string()
        .trim()
        .optional()
        .nullable(),

    pincode: z
        .string()
        .trim()
        .optional()
        .nullable(),
});

export const doctorProfileSchema = z.object({
    body: z.object({
        specialization: z
            .string()
            .trim()
            .min(2, "Specialization must be at least 2 characters.")
            .optional()
            .nullable(),

        qualification: z
            .string()
            .trim()
            .min(2, "Qualification must be at least 2 characters.")
            .optional()
            .nullable(),

        experience: z
            .number()
            .min(0, "Experience cannot be negative.")
            .max(70, "Experience seems invalid.")
            .optional()
            .nullable(),

        hospital: z
            .string()
            .trim()
            .min(2, "Hospital name must be at least 2 characters.")
            .optional()
            .nullable(),

        department: z
            .string()
            .trim()
            .min(2, "Department must be at least 2 characters.")
            .optional()
            .nullable(),

        licenseNumber: z
            .string()
            .trim()
            .min(5, "License number is too short.")
            .optional()
            .nullable(),

        consultationFee: z
            .number()
            .min(0, "Consultation fee cannot be negative.")
            .optional()
            .nullable(),

        address: addressSchema.optional().nullable(),
    }),
});