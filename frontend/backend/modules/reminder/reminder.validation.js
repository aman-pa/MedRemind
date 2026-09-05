import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");
const timeString = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be HH:mm");

export const createReminderSchema = z.object({
    body: z.object({
        medicineId: objectId,
        times: z.array(timeString).min(1, "At least one time is required"),
        daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
    }),
});

export const updateReminderSchema = z.object({
    body: z.object({
        times: z.array(timeString).min(1).optional(),
        daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
        isActive: z.boolean().optional(),
    }),
});
