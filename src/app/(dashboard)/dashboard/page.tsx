import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getDashboardPath } from '@/lib/navigation';

export default async function DashboardLandingPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/sign-in');
  }

  redirect(getDashboardPath(session.user.role));
}
