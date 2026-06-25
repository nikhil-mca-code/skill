import { z } from 'zod';

const serviceDraftSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(2000).optional().nullable(),
  price: z.coerce.number().positive(),
  durationMinutes: z.coerce.number().int().positive().optional().nullable(),
  categoryId: z.string().cuid(),
  isActive: z.boolean().optional(),
});

export const professionalOnboardingSchema = z.object({
  headline: z.string().min(10).max(100),
  description: z.string().min(20).max(2000),
  yearsExperience: z.coerce.number().int().min(0).max(60),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  profileImage: z.string().url(),
  hourlyRate: z.coerce.number().positive(),
  isAvailable: z.boolean(),
  services: z.array(serviceDraftSchema).min(1),
});

export type ProfessionalOnboardingInput = z.infer<typeof professionalOnboardingSchema>;
