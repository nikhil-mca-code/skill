import { z } from 'zod';

export const serviceUpsertSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(2000).optional().nullable(),
  price: z.coerce.number().positive(),
  durationMinutes: z.coerce.number().int().positive().optional().nullable(),
  categoryId: z.string().cuid(),
  professionalId: z.string().cuid().optional().nullable(),
  images: z.array(z.string().min(1)).default([]),
  isActive: z.coerce.boolean().optional(),
});

export type ServiceUpsertInput = z.infer<typeof serviceUpsertSchema>;
