import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export async function middleware(req :NextRequest){
  const token = await getToken({req, 
    secret: process.env.NEXTAUTH_SECRET
  });
  const { pathname } = req.nextUrl;

  if( 
    pathname.startsWith('/Admin') ||
    pathname.startsWith('/Teacher') ||
    pathname.startsWith('/Student') 
  ){
    if(!token){
      return NextResponse.redirect(new URL('/Login', req.url));
    }

    if(pathname === '/Login' && token?.role){
const rolePath = '/'+ capitalize(token.role);
      return NextResponse.redirect(new URL(rolePath, req.url));
  }
  return NextResponse.next();
}
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
};

export const config ={
  matcher: [
    '/Admin/:path*',
    '/Teacher/:path*',
    '/Student/:path*',
  ]
}