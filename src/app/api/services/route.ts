import { NextRequest, NextResponse } from 'next/server';
import { Prisma, UserRole } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { serviceUpsertSchema } from '@/lib/validations/service.schema';

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get('search') ?? '';
  const categoryId = request.nextUrl.searchParams.get('categoryId') ?? '';
  const professionalId = request.nextUrl.searchParams.get('professionalId') ?? '';
  const city = request.nextUrl.searchParams.get('city') ?? '';
  const minPrice = request.nextUrl.searchParams.get('minPrice');
  const maxPrice = request.nextUrl.searchParams.get('maxPrice');
  const isActive = request.nextUrl.searchParams.get('isActive');

  const and: Prisma.ServiceWhereInput[] = [];

  if (search) {
    and.push({
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { name: { contains: search, mode: 'insensitive' } } },
        { professional: { user: { name: { contains: search, mode: 'insensitive' } } } },
      ],
    });
  }

  if (categoryId) {
    and.push({ categoryId });
  }

  if (professionalId) {
    and.push({ professionalId });
  }

  if (city) {
    and.push({ professional: { city: { contains: city, mode: 'insensitive' } } });
  }

  if (minPrice || maxPrice) {
    and.push({
      price: {
        gte: minPrice ? Number(minPrice) : undefined,
        lte: maxPrice ? Number(maxPrice) : undefined,
      },
    });
  }

  if (isActive === 'true') {
    and.push({ isActive: true });
  }

  if (isActive === 'false') {
    and.push({ isActive: false });
  }

  const services = await prisma.service.findMany({
    where: and.length ? { AND: and } : {},
    orderBy: { createdAt: 'desc' },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      professional: {
        select: {
          id: true,
          headline: true,
          city: true,
          state: true,
          hourlyRate: true,
          isAvailable: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              role: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json({
    data: services,
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== UserRole.PROFESSIONAL && session.user.role !== UserRole.ADMIN)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = serviceUpsertSchema.parse(body);

  const professional = parsed.professionalId
    ? parsed.professionalId
    : (await prisma.professionalProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      }))?.id;

  if (!professional) {
    return NextResponse.json({ error: 'Professional profile not found' }, { status: 404 });
  }

  const service = await prisma.service.create({
    data: {
      title: parsed.title,
      description: parsed.description,
      price: parsed.price,
      durationMinutes: parsed.durationMinutes ?? null,
      categoryId: parsed.categoryId,
      professionalId: professional,
      images: parsed.images,
      isActive: parsed.isActive ?? true,
    },
  });

  return NextResponse.json(service, { status: 201 });
}
