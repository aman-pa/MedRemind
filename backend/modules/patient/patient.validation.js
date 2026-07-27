import { z } from "zod";

const emergencyContactSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Name is required"),

    relationship: z
        .string()
        .trim()
        .min(1, "Relationship is required"),

    phone: z
        .string()
        .trim()
        .regex(/^[6-9]\d{9}$/, "Invalid phone number"),
});

const addressSchema = z.object({
    street: z
        .string()
        .trim()
        .optional(),

    city: z
        .string()
        .trim()
        .optional(),

    state: z
        .string()
        .trim()
        .optional(),

    country: z
        .string()
        .trim()
        .optional(),

    pincode: z
        .string()
        .trim()
        .optional(),
});

export const patientProfileSchema = z.object({
    body: z.object({
        dateOfBirth: z
            .coerce.date()
            .optional(),

        gender: z
            .enum(["male", "female"])
            .optional(),

        bloodGroup: z
            .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
            .optional(),

        height: z
            .number()
            .positive()
            .max(300)
            .optional(),

        weight: z
            .number()
            .positive()
            .max(500)
            .optional(),

        allergies: z
            .array(z.string().trim())
            .optional(),

        chronicDiseases: z
            .array(z.string().trim())
            .optional(),

        emergencyContacts: z
            .array(emergencyContactSchema)
            .optional(),

        address: addressSchema.optional(),
    }),
});