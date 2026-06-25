import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { UserRole } from '@prisma/client';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { professionalOnboardingSchema } from '@/lib/validations/onboarding.schema';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== UserRole.PROFESSIONAL && session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = professionalOnboardingSchema.parse(body);

    const result = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          image: parsed.profileImage ?? undefined,
        },
      });

      const profile = await tx.professionalProfile.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          headline: parsed.headline,
          description: parsed.description,
          city: parsed.city,
          state: parsed.state,
          country: 'India',
          yearsExperience: parsed.yearsExperience,
          hourlyRate: parsed.hourlyRate,
          isAvailable: parsed.isAvailable,
          isVerified: false,
        },
        update: {
          headline: parsed.headline,
          description: parsed.description,
          city: parsed.city,
          state: parsed.state,
          country: 'India',
          yearsExperience: parsed.yearsExperience,
          hourlyRate: parsed.hourlyRate,
          isAvailable: parsed.isAvailable,
        },
      });

      await tx.service.deleteMany({
        where: { professionalId: profile.id },
      });

      if (parsed.services.length) {
        await tx.service.createMany({
          data: parsed.services.map((service) => ({
            title: service.title,
            description: service.description ?? null,
            price: service.price,
            durationMinutes: service.durationMinutes ?? null,
            categoryId: service.categoryId,
            professionalId: profile.id,
            images: parsed.profileImage ? [parsed.profileImage] : [],
            isActive: service.isActive ?? true,
          })),
        });
      }

      return profile;
    });

    return NextResponse.json({ ok: true, profileId: result.id });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 422 });
    }

    console.error('Professional onboarding error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
