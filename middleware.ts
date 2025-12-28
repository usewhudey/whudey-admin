import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Dashboard paths (protected)
  const isDashboardPath = path.startsWith('/dashboard');

  // Get token from cookies
  const token = request.cookies.get('accessToken')?.value || '';

  // Redirect to login if accessing protected route without token
  if (isDashboardPath && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect to dashboard if accessing auth pages with token
  if (path === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
