import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateProfessionalSchema } from '@/lib/validations/professional.schema';
import { ZodError } from 'zod';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await prisma.professionalProfile.findUnique({
    where: { userId: session.user.id },
    include: { user: true },
  });

  if (!profile) {
    return NextResponse.json({ error: 'Professional profile not found' }, { status: 404 });
  }

  return NextResponse.json(profile);
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Ensure user is a professional or admin
  if (session.user.role !== 'PROFESSIONAL' && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validated = updateProfessionalSchema.parse(body);

    // Check if profile exists, else create
    const existing = await prisma.professionalProfile.findUnique({
      where: { userId: session.user.id },
    });

    let profile;
    if (existing) {
      profile = await prisma.professionalProfile.update({
        where: { userId: session.user.id },
        data: validated,
      });
    } else {
      // Create new profile
      profile = await prisma.professionalProfile.create({
        data: {
          userId: session.user.id,
          ...validated,
        },
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 422 });
    }
    console.error('Error updating professional profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
