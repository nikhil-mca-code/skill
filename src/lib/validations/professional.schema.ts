import { z } from 'zod';

export const updateProfessionalSchema = z.object({
  headline: z.string().max(100, 'Headline too long').optional(),
  description: z.string().max(2000, 'Description too long').optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  yearsExperience: z.number().int().min(0).optional(),
  hourlyRate: z.number().positive('Hourly rate must be positive').optional(),
  isAvailable: z.boolean().optional(),
});

export type UpdateProfessionalInput = z.infer<typeof updateProfessionalSchema>;