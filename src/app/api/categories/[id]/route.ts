import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { categoryUpsertSchema } from '@/lib/validations/category.schema';
import { slugify } from '@/lib/phase2/utils';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const category = await prisma.category.findUnique({
    where: { id: params.id },
    include: {
      _count: { select: { services: true } },
    },
  });

  if (!category) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }

  return NextResponse.json({
    ...category,
    serviceCount: category._count.services,
  });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = categoryUpsertSchema.parse(body);

  const category = await prisma.category.update({
    where: { id: params.id },
    data: {
      ...parsed,
      slug: parsed.slug || slugify(parsed.name),
    },
  });

  return NextResponse.json(category);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.category.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
