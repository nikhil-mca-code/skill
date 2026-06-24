import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getDashboardPath } from '@/lib/navigation';

// Define protected routes and required roles
const roleBasedRoutes: Record<string, string[]> = {
  '/admin': ['ADMIN'],
  '/professional': ['PROFESSIONAL', 'ADMIN'],
  '/customer': ['CUSTOMER', 'PROFESSIONAL', 'ADMIN'], // customers can see their dashboard
  // Add more as needed
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  // Public routes (no auth required)
  const publicPaths = ['/sign-in', '/sign-up', '/', '/services', '/professionals', '/about', '/contact'];
  const isPublicRoute = publicPaths.some((p) => (p === '/' ? pathname === '/' : pathname === p || pathname.startsWith(`${p}/`)));
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If no token, redirect to sign-in
  if (!token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Check role-based access for dashboard routes
  const userRole = token.role as string;
  for (const [route, allowedRoles] of Object.entries(roleBasedRoutes)) {
    if (pathname.startsWith(route) && !allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL(getDashboardPath(userRole), request.url));
    }
  }

  // API routes protection: optional additional checks
  // For API routes, we rely on the route handlers to check authorization

  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    // Match all routes except static assets, API routes, and auth endpoints
    '/((?!_next/static|_next/image|favicon.ico|api/|auth/).*)',
  ],
};
