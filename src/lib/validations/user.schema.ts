import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().min(1).max(30).optional(),
  image: z.string().url().optional().or(z.literal('')).transform((value) => value || undefined),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
