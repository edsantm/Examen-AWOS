import { z } from "zod";

/**
 * Validación de query params para reportes
 */
export const paginationSchema = z.object({
    search: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(20).default(5),
});

export const overdueSchema = z.object({
    min_days: z.coerce.number().int().min(1).default(1),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(20).default(5),
});

