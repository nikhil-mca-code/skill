import { UserRole } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function requireAuth(allowedRoles?: UserRole[]) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), session: null };
  }
  if (allowedRoles && !allowedRoles.includes(session.user.role as UserRole)) {
    return { response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), session: null };
  }
  return { response: null, session };
}