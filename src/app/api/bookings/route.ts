import { NextRequest, NextResponse } from 'next/server';
import { BookingStatus, Prisma, UserRole } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { bookingCreateSchema } from '@/lib/validations/booking.schema';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const status = request.nextUrl.searchParams.get('status') ?? '';
  const where: Prisma.BookingWhereInput = {};

  if (session.user.role === UserRole.CUSTOMER) {
    where.customerId = session.user.id;
  } else if (session.user.role === UserRole.PROFESSIONAL) {
    where.professionalId = session.user.id;
  }

  if (status) {
    where.status = status as BookingStatus;
  }

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { scheduledDate: 'desc' },
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

  return NextResponse.json({ data: bookings });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = bookingCreateSchema.parse(body);

  const service = await prisma.service.findUnique({
    where: { id: parsed.serviceId },
    include: { professional: { select: { userId: true } } },
  });

  if (!service) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  const scheduledEndDate = service.durationMinutes
    ? new Date(parsed.scheduledDate.getTime() + service.durationMinutes * 60_000)
    : null;

  const booking = await prisma.booking.create({
    data: {
      customerId: session.user.id,
      professionalId: service.professional.userId,
      serviceId: service.id,
      scheduledDate: parsed.scheduledDate,
      scheduledEndDate,
      status: BookingStatus.PENDING,
      totalPrice: service.price,
      address: parsed.address ?? null,
      notes: parsed.notes ?? null,
    },
  });

  return NextResponse.json(booking, { status: 201 });
}
