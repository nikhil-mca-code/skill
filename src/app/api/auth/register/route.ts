import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validations/auth.schema';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.parse(body);

    const normalizedEmail = parsed.email.toLowerCase().trim();
    const existing = await prisma.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
      select: { id: true, passwordHash: true },
    });

    const passwordHash = await bcrypt.hash(parsed.password, 12);

    if (existing) {
      if (existing.passwordHash) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
      }

      await prisma.user.update({
        where: { id: existing.id },
        data: {
          email: normalizedEmail,
          name: parsed.name,
          role: parsed.role,
          passwordHash,
        },
      });

      return NextResponse.json({ ok: true, updated: true });
    }

    await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: parsed.name,
        role: parsed.role,
        passwordHash,
      },
    });

    return NextResponse.json({ ok: true, created: true }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 422 });
    }

    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
