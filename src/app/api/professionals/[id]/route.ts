import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const profile = await prisma.professionalProfile.findUnique({
    where: { userId: id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
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
        },
      },
      reviews: {
        select: {
          rating: true,
          comment: true,
          createdAt: true,
          reviewer: {
            select: { name: true, image: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!profile) {
    return NextResponse.json({ error: 'Professional not found' }, { status: 404 });
  }

  // Compute average rating
  const avgRating = profile.reviews.length > 0
    ? profile.reviews.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0) / profile.reviews.length
    : null;

  return NextResponse.json({
    ...profile,
    averageRating: avgRating,
  });
}
