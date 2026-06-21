'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { UserRole } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/utils/authorization';
import { serviceUpsertSchema } from '@/lib/validations/service.schema';
import { csvToArray, formValue, optionalFormValue } from '@/lib/phase2/utils';

async function requireProfessionalOrAdmin() {
  const { response, session } = await requireAuth([UserRole.PROFESSIONAL, UserRole.ADMIN]);
  if (response || !session) {
    throw new Error('Unauthorized');
  }
  return session;
}

async function resolveProfessionalId(sessionUserId: string, requestedProfessionalId?: string | null) {
  if (requestedProfessionalId) return requestedProfessionalId;

  const profile = await prisma.professionalProfile.findUnique({
    where: { userId: sessionUserId },
    select: { id: true },
  });

  if (!profile) {
    throw new Error('Professional profile not found');
  }

  return profile.id;
}

export async function createServiceAction(formData: FormData) {
  const session = await requireProfessionalOrAdmin();
  const parsed = serviceUpsertSchema.parse({
    title: optionalFormValue(formData.get('title')),
    description: optionalFormValue(formData.get('description')) ?? null,
    price: formValue(formData.get('price')),
    durationMinutes: optionalFormValue(formData.get('durationMinutes')) ?? null,
    categoryId: optionalFormValue(formData.get('categoryId')),
    professionalId: optionalFormValue(formData.get('professionalId')) ?? null,
    images: csvToArray(formData.get('images')),
    isActive: formData.get('isActive') === 'on',
  });

  const professionalId = await resolveProfessionalId(session.user.id, parsed.professionalId);

  await prisma.service.create({
    data: {
      title: parsed.title,
      description: parsed.description,
      price: parsed.price,
      durationMinutes: parsed.durationMinutes ?? null,
      categoryId: parsed.categoryId,
      professionalId,
      images: parsed.images,
      isActive: parsed.isActive ?? true,
    },
  });

  revalidatePath('/services');
  revalidatePath('/professional/services');
  redirect(String(formData.get('returnTo') || '/professional/services'));
}

export async function updateServiceAction(serviceId: string, formData: FormData) {
  await requireProfessionalOrAdmin();
  const parsed = serviceUpsertSchema.parse({
    title: optionalFormValue(formData.get('title')),
    description: optionalFormValue(formData.get('description')) ?? null,
    price: formValue(formData.get('price')),
    durationMinutes: optionalFormValue(formData.get('durationMinutes')) ?? null,
    categoryId: optionalFormValue(formData.get('categoryId')),
    professionalId: optionalFormValue(formData.get('professionalId')) ?? null,
    images: csvToArray(formData.get('images')),
    isActive: formData.get('isActive') === 'on',
  });

  await prisma.service.update({
    where: { id: serviceId },
    data: {
      title: parsed.title,
      description: parsed.description,
      price: parsed.price,
      durationMinutes: parsed.durationMinutes ?? null,
      categoryId: parsed.categoryId,
      images: parsed.images,
      isActive: parsed.isActive ?? true,
    },
  });

  revalidatePath('/services');
  revalidatePath('/professional/services');
  redirect(String(formData.get('returnTo') || '/professional/services'));
}

export async function deleteServiceAction(serviceId: string, returnTo = '/professional/services') {
  await requireProfessionalOrAdmin();

  await prisma.service.delete({ where: { id: serviceId } });
  revalidatePath('/services');
  revalidatePath('/professional/services');
  redirect(returnTo);
}
