import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const createMedicationLogSchema = z.object({
    body: z.object({
        medicineId: objectId,
        reminderId: objectId.optional().nullable(),
        scheduledFor: z.coerce.date(),
        status: z.enum(["taken", "missed", "skipped"]),
    }),
});
