import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const isPublicPath =
    path === '/' ||
    path === '/login' ||
    path === '/register' ||
    path === '/verify-email' ||
    path.startsWith('/api/');

  // Dashboard paths (protected)
  const isDashboardPath = path.startsWith('/dashboard');

  // Get token from cookies
  const token = request.cookies.get('accessToken')?.value || '';

  // Redirect to login if accessing protected route without token
  if (isDashboardPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if accessing auth pages with token
  if ((path === '/login' || path === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
