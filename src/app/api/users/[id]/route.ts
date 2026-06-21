import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      image: true,
      role: true,
      createdAt: true,
      // Exclude email, phone, etc. for privacy
      profile: {
        select: {
          headline: true,
          description: true,
          city: true,
          state: true,
          country: true,
          yearsExperience: true,
          hourlyRate: true,
          isVerified: true,
          isAvailable: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}