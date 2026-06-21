import { NextRequest, NextResponse } from 'next/server';
import { Category, Prisma, UserRole } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { categoryUpsertSchema } from '@/lib/validations/category.schema';
import { slugify } from '@/lib/phase2/utils';

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get('q') ?? '';
  const where: Prisma.CategoryWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const categories = await prisma.category.findMany({
    where,
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { services: true } },
    },
  });

  return NextResponse.json({
    data: categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      parentId: category.parentId,
      serviceCount: category._count.services,
    })),
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = categoryUpsertSchema.parse(body);

  const category = await prisma.category.create({
    data: {
      ...parsed,
      slug: parsed.slug || slugify(parsed.name),
    },
  });

  return NextResponse.json(category, { status: 201 });
}
