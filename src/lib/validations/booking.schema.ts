import { BookingStatus } from '@prisma/client';
import { z } from 'zod';

export const bookingCreateSchema = z.object({
  serviceId: z.string().cuid(),
  scheduledDate: z.coerce.date(),
  address: z.string().max(200).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  returnTo: z.string().optional(),
});

export const bookingStatusSchema = z.object({
  status: z.nativeEnum(BookingStatus),
  returnTo: z.string().optional(),
});

export type BookingCreateInput = z.infer<typeof bookingCreateSchema>;
export type BookingStatusInput = z.infer<typeof bookingStatusSchema>;
