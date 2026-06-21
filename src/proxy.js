import { NextResponse } from 'next/server';

export function proxy(request) {
  const token = request.cookies.get('ecom_token')?.value;
  const path = request.nextUrl.pathname;

  const isDashboardPath = path.startsWith('/dashboard');
  const isUserPath = path.startsWith('/user');
  const isAuthPath = path === '/login' || path === '/register';

  // 1. Trying to access protected route without token -> Redirect to login
  if ((isDashboardPath || isUserPath) && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', path);
    return NextResponse.redirect(url);
  }

  // 2. Trying to access auth route while logged in -> Redirect to homepage
  if (isAuthPath && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/user/:path*', '/login', '/register'],
};

export default proxy;
