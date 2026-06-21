'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { BookingStatus, UserRole } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/utils/authorization';
import { bookingCreateSchema, bookingStatusSchema } from '@/lib/validations/booking.schema';
import { optionalFormValue } from '@/lib/phase2/utils';

async function requireBookedUser() {
  const { response, session } = await requireAuth([UserRole.CUSTOMER, UserRole.PROFESSIONAL, UserRole.ADMIN]);
  if (response || !session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function createBookingAction(formData: FormData) {
  const session = await requireBookedUser();
  const parsed = bookingCreateSchema.parse({
    serviceId: optionalFormValue(formData.get('serviceId')),
    scheduledDate: optionalFormValue(formData.get('scheduledDate')),
    address: optionalFormValue(formData.get('address')) ?? null,
    notes: optionalFormValue(formData.get('notes')) ?? null,
    returnTo: optionalFormValue(formData.get('returnTo')),
  });

  const service = await prisma.service.findUnique({
    where: { id: parsed.serviceId },
    include: {
      professional: {
        select: { userId: true },
      },
    },
  });

  if (!service) {
    throw new Error('Service not found');
  }

  const scheduledEndDate = service.durationMinutes
    ? new Date(parsed.scheduledDate.getTime() + service.durationMinutes * 60_000)
    : null;

  await prisma.booking.create({
    data: {
      customerId: session.user.id,
      professionalId: service.professional.userId,
      serviceId: service.id,
      scheduledDate: parsed.scheduledDate,
      scheduledEndDate,
      status: BookingStatus.PENDING,
      totalPrice: service.price,
      address: parsed.address,
      notes: parsed.notes,
    },
  });

  revalidatePath('/customer/bookings');
  revalidatePath('/professional/bookings');
  redirect(parsed.returnTo || '/customer/bookings');
}

export async function updateBookingStatusAction(bookingId: string, formData: FormData) {
  const session = await requireBookedUser();
  const parsed = bookingStatusSchema.parse({
    status: optionalFormValue(formData.get('status')),
    returnTo: optionalFormValue(formData.get('returnTo')),
  });

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { id: true, customerId: true, professionalId: true, status: true },
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  const isAdmin = session.user.role === UserRole.ADMIN;
  const isProfessionalOwner = session.user.role === UserRole.PROFESSIONAL && booking.professionalId === session.user.id;
  const isCustomerOwner = session.user.role === UserRole.CUSTOMER && booking.customerId === session.user.id;

  if (!isAdmin && !isProfessionalOwner && !isCustomerOwner) {
    throw new Error('Forbidden');
  }

  if (isCustomerOwner && parsed.status !== BookingStatus.CANCELLED_BY_CUSTOMER) {
    throw new Error('Customers can only cancel their own bookings');
  }

  const professionalAllowedStatuses: BookingStatus[] = [
    BookingStatus.ACCEPTED,
    BookingStatus.IN_PROGRESS,
    BookingStatus.COMPLETED,
    BookingStatus.REJECTED,
    BookingStatus.CANCELLED_BY_PROFESSIONAL,
  ];

  if (isProfessionalOwner && !professionalAllowedStatuses.includes(parsed.status)) {
    throw new Error('Invalid status transition');
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: parsed.status },
  });

  revalidatePath('/customer/bookings');
  revalidatePath('/professional/bookings');
  redirect(parsed.returnTo || '/customer/bookings');
}
