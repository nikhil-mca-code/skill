import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get('search') ?? '';
  const categoryId = request.nextUrl.searchParams.get('categoryId') ?? '';
  const city = request.nextUrl.searchParams.get('city') ?? '';
  const isAvailable = request.nextUrl.searchParams.get('isAvailable');
  const minRate = request.nextUrl.searchParams.get('minRate');
  const maxRate = request.nextUrl.searchParams.get('maxRate');

  const and: Prisma.ProfessionalProfileWhereInput[] = [];

  if (search) {
    and.push({
      OR: [
        { headline: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { services: { some: { title: { contains: search, mode: 'insensitive' } } } },
      ],
    });
  }

  if (categoryId) {
    and.push({ services: { some: { categoryId } } });
  }

  if (city) {
    and.push({ city: { contains: city, mode: 'insensitive' } });
  }

  if (isAvailable === 'true') {
    and.push({ isAvailable: true });
  }

  if (isAvailable === 'false') {
    and.push({ isAvailable: false });
  }

  if (minRate || maxRate) {
    and.push({
      hourlyRate: {
        gte: minRate ? Number(minRate) : undefined,
        lte: maxRate ? Number(maxRate) : undefined,
      },
    });
  }

  const professionals = await prisma.professionalProfile.findMany({
    where: and.length ? { AND: and } : {},
    orderBy: [{ isVerified: 'desc' }, { updatedAt: 'desc' }],
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          role: true,
        },
      },
      services: {
        where: { isActive: true },
        select: {
          id: true,
          title: true,
          price: true,
          durationMinutes: true,
          images: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  const data = professionals.map((professional) => {
    const categories = Array.from(
      new Map(
        professional.services.map((service) => [service.category.id, service.category])
      ).values()
    );

    return {
      id: professional.id,
      headline: professional.headline,
      description: professional.description,
      city: professional.city,
      state: professional.state,
      country: professional.country,
      hourlyRate: professional.hourlyRate,
      yearsExperience: professional.yearsExperience,
      isVerified: professional.isVerified,
      isAvailable: professional.isAvailable,
      user: professional.user,
      services: professional.services,
      categories,
      serviceCount: professional.services.length,
    };
  });

  return NextResponse.json({ data });
}
