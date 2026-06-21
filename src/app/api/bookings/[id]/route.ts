import { NextRequest, NextResponse } from 'next/server';
import { BookingStatus, UserRole } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { bookingStatusSchema } from '@/lib/validations/booking.schema';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      customer: { select: { id: true, name: true, image: true } },
      professional: { select: { id: true, name: true, image: true } },
      service: {
        select: {
          id: true,
          title: true,
          price: true,
          category: { select: { id: true, name: true, slug: true } },
        },
      },
    },
  });

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  return NextResponse.json(booking);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = bookingStatusSchema.parse(body);

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    select: { id: true, customerId: true, professionalId: true, status: true },
  });

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  const isAdmin = session.user.role === UserRole.ADMIN;
  const isProfessionalOwner = session.user.role === UserRole.PROFESSIONAL && booking.professionalId === session.user.id;
  const isCustomerOwner = session.user.role === UserRole.CUSTOMER && booking.customerId === session.user.id;

  if (!isAdmin && !isProfessionalOwner && !isCustomerOwner) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (isCustomerOwner && parsed.status !== BookingStatus.CANCELLED_BY_CUSTOMER) {
    return NextResponse.json({ error: 'Customers can only cancel their bookings' }, { status: 403 });
  }

  const professionalAllowedStatuses: BookingStatus[] = [
    BookingStatus.ACCEPTED,
    BookingStatus.IN_PROGRESS,
    BookingStatus.COMPLETED,
    BookingStatus.REJECTED,
    BookingStatus.CANCELLED_BY_PROFESSIONAL,
  ];

  if (isProfessionalOwner && !professionalAllowedStatuses.includes(parsed.status)) {
    return NextResponse.json({ error: 'Invalid status transition' }, { status: 400 });
  }

  const updated = await prisma.booking.update({
    where: { id: params.id },
    data: { status: parsed.status },
  });

  return NextResponse.json(updated);
}
