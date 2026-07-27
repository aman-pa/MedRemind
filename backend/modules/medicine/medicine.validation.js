import { z } from "zod";

const objectId = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const createMedicineSchema = z.object({
    body: z.object({
        // Only required when a doctor is creating the medicine for a patient.
        // Ignored (forced to self) when a patient creates their own.
        patientId: objectId.optional(),

        name: z.string().trim().min(1, "Name is required"),

        dosage: z.string().trim().min(1, "Dosage is required"),

        form: z
            .enum(["tablet", "capsule", "syrup", "injection", "drops", "other"])
            .optional(),

        frequencyPerDay: z
            .number()
            .int()
            .positive("Frequency must be at least 1"),

        instructions: z.string().trim().optional(),

        startDate: z.coerce.date().optional(),

        endDate: z.coerce.date().optional().nullable(),
    }),
});

export const updateMedicineSchema = z.object({
    body: z.object({
        name: z.string().trim().min(1).optional(),
        dosage: z.string().trim().min(1).optional(),
        form: z
            .enum(["tablet", "capsule", "syrup", "injection", "drops", "other"])
            .optional(),
        frequencyPerDay: z.number().int().positive().optional(),
        instructions: z.string().trim().optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional().nullable(),
        isActive: z.boolean().optional(),
    }),
});
