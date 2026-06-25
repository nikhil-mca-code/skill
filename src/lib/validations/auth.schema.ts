import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const emailPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const registerSchema = emailPasswordSchema.extend({
  name: z.string().min(2).max(100),
  role: z.enum([UserRole.CUSTOMER, UserRole.PROFESSIONAL]),
});

export type RegisterInput = z.infer<typeof registerSchema>;
