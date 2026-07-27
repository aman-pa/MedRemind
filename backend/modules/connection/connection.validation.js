import { z } from "zod";

export const sendRequestSchema = z.object({
    body: z.object({
        email: z
            .string()
            .trim()
            .toLowerCase()
            .email("Invalid email address"),
    }),
});

const connectionIdSchema = z.object({
    params: z.object({
        id: z
            .string()
            .trim()
            .min(1, "Connection id is required"),
    }),
});

export const acceptRequestSchema = connectionIdSchema;

export const rejectRequestSchema = connectionIdSchema;

export const disconnectSchema = connectionIdSchema;