import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { serviceUpsertSchema } from '@/lib/validations/service.schema';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const service = await prisma.service.findUnique({
    where: { id: params.id },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      professional: {
        select: {
          id: true,
          headline: true,
          city: true,
          state: true,
          hourlyRate: true,
          isAvailable: true,
          user: { select: { id: true, name: true, image: true, role: true } },
        },
      },
    },
  });

  if (!service) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  return NextResponse.json(service);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== UserRole.PROFESSIONAL && session.user.role !== UserRole.ADMIN)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = serviceUpsertSchema.parse(body);

  const current = await prisma.service.findUnique({
    where: { id: params.id },
    select: { professional: { select: { userId: true } } },
  });

  if (!current) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  const isOwner = current.professional.userId === session.user.id;
  if (session.user.role !== UserRole.ADMIN && !isOwner) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const service = await prisma.service.update({
    where: { id: params.id },
    data: {
      title: parsed.title,
      description: parsed.description,
      price: parsed.price,
      durationMinutes: parsed.durationMinutes ?? null,
      categoryId: parsed.categoryId,
      images: parsed.images,
      isActive: parsed.isActive ?? true,
    },
  });

  return NextResponse.json(service);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== UserRole.PROFESSIONAL && session.user.role !== UserRole.ADMIN)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const current = await prisma.service.findUnique({
    where: { id: params.id },
    select: { professional: { select: { userId: true } } },
  });

  if (!current) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  const isOwner = current.professional.userId === session.user.id;
  if (session.user.role !== UserRole.ADMIN && !isOwner) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.service.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
