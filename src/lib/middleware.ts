import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getDashboardPath } from "@/lib/navigation";

// Routes that require specific roles
const roleBasedRoutes: Record<string, string[]> = {
  "/admin": ["ADMIN"],
  "/professional": ["PROFESSIONAL", "ADMIN"],
  "/customer": ["CUSTOMER", "PROFESSIONAL", "ADMIN"],
};

// Public routes
const publicRoutes = [
  "/",
  "/sign-in",
  "/sign-up",
  "/services",
  "/professionals",
  "/about",
  "/contact",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --------------------------------------------------
  // NEVER run authentication on Next.js assets
  // --------------------------------------------------
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.match(/\.(.*)$/) // css, js, png, jpg, svg, ico, map, etc.
  ) {
    return NextResponse.next();
  }

  // --------------------------------------------------
  // Allow public pages
  // --------------------------------------------------
  const isPublicRoute = publicRoutes.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname === route || pathname.startsWith(route + "/");
  });

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // --------------------------------------------------
  // Authentication
  // --------------------------------------------------
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // --------------------------------------------------
  // Role-based authorization
  // --------------------------------------------------
  const userRole = token.role as string;

  for (const [route, allowedRoles] of Object.entries(roleBasedRoutes)) {
    if (pathname.startsWith(route)) {
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(
          new URL(getDashboardPath(userRole), request.url)
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run middleware on everything except:
     * - api routes
     * - _next (all Next.js assets)
     * - favicon
     * - robots
     * - sitemap
     * - any file with an extension
     */
    "/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};