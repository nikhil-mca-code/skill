import { z } from 'zod';

export const categoryUpsertSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(120).optional(),
  description: z.string().max(500).optional().nullable(),
  icon: z.string().max(100).optional().nullable(),
  parentId: z.string().cuid().optional().nullable(),
});

export type CategoryUpsertInput = z.infer<typeof categoryUpsertSchema>;
