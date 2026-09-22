import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedRoutes = [
  '/Admin',
  '/Teacher',
  '/Student',
  '/Message',
  '/Inbox',
  '/ViewProfile',
  '/Comming-soon',
  '/settings',
] as const;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/Login', req.url));
  }

  if (pathname === '/Login' && token?.role) {
    const rolePath = '/' + capitalize(token.role as string);
    return NextResponse.redirect(new URL(rolePath, req.url));
  }

  return NextResponse.next();
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const config = {
  matcher: [
    '/Admin/:path*',
    '/Teacher/:path*',
    '/Student/:path*',
    '/Message/:path*',
    '/Inbox/:path*',
    '/ViewProfile/:path*',
    '/Comming-soon/:path*',
    '/settings/:path*',
  ],
};
