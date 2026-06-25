import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { UserRole } from '@prisma/client';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProfessionalOnboardingWizard } from './ProfessionalOnboardingWizard';

export default async function ProfessionalOnboardingPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/sign-in');
  }

  if (session.user.role !== UserRole.PROFESSIONAL && session.user.role !== UserRole.ADMIN) {
    redirect('/dashboard');
  }

  const existingProfile = await prisma.professionalProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (existingProfile) {
    redirect('/dashboard');
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });

  return <ProfessionalOnboardingWizard categories={categories} />;
}
