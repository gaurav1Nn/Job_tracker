import { z } from 'zod';

export const applicationStatusEnum = z.enum([
    'WISHLIST',
    'APPLIED',
    'PHONE_SCREEN',
    'INTERVIEW',
    'OFFER',
    'REJECTED',
    'ACCEPTED',
]);

export const createApplicationSchema = z.object({
    company: z.string().min(1, 'Company name is required').max(100),
    role: z.string().min(1, 'Role is required').max(100),
    status: applicationStatusEnum.optional().default('WISHLIST'),
    salary: z.union([z.number(), z.string().transform((v) => v ? parseFloat(v) : undefined)]).optional().nullable(),
    notes: z.string().max(5000).optional().nullable(),
    location: z.string().max(100).optional().nullable(),
    jobUrl: z.string().url('Invalid URL').optional().nullable().or(z.literal('')).transform((v) => v || null),
    appliedAt: z.string().datetime().optional().nullable().or(z.literal('')).transform((v) => v || null),
});

export const updateApplicationSchema = createApplicationSchema.partial();

export const applicationQuerySchema = z.object({
    status: applicationStatusEnum.optional(),
    search: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    page: z.string().transform(Number).optional().default('1'),
    limit: z.string().transform(Number).optional().default('10'),
    sortBy: z.enum(['createdAt', 'appliedAt', 'company', 'status']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type ApplicationStatus = z.infer<typeof applicationStatusEnum>;
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type ApplicationQuery = z.infer<typeof applicationQuerySchema>;
