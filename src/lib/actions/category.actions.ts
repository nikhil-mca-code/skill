'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { UserRole } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/utils/authorization';
import { categoryUpsertSchema } from '@/lib/validations/category.schema';
import { optionalFormValue, slugify } from '@/lib/phase2/utils';

async function requireAdmin() {
  const { response, session } = await requireAuth([UserRole.ADMIN]);
  if (response || !session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function createCategoryAction(formData: FormData) {
  await requireAdmin();

  const parsed = categoryUpsertSchema.parse({
    name: optionalFormValue(formData.get('name')),
    slug: optionalFormValue(formData.get('slug')),
    description: optionalFormValue(formData.get('description')) ?? null,
    icon: optionalFormValue(formData.get('icon')) ?? null,
    parentId: optionalFormValue(formData.get('parentId')) ?? null,
  });

  await prisma.category.create({
    data: {
      ...parsed,
      slug: parsed.slug || slugify(parsed.name),
    },
  });

  revalidatePath('/admin/categories');
  redirect(String(formData.get('returnTo') || '/admin/categories'));
}

export async function updateCategoryAction(categoryId: string, formData: FormData) {
  await requireAdmin();

  const parsed = categoryUpsertSchema.parse({
    name: optionalFormValue(formData.get('name')),
    slug: optionalFormValue(formData.get('slug')),
    description: optionalFormValue(formData.get('description')) ?? null,
    icon: optionalFormValue(formData.get('icon')) ?? null,
    parentId: optionalFormValue(formData.get('parentId')) ?? null,
  });

  await prisma.category.update({
    where: { id: categoryId },
    data: {
      ...parsed,
      slug: parsed.slug || slugify(parsed.name),
    },
  });

  revalidatePath('/admin/categories');
  redirect(String(formData.get('returnTo') || '/admin/categories'));
}

export async function deleteCategoryAction(categoryId: string, returnTo = '/admin/categories') {
  await requireAdmin();

  await prisma.category.delete({ where: { id: categoryId } });
  revalidatePath('/admin/categories');
  redirect(returnTo);
}
