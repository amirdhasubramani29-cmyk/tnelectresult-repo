import { NextResponse } from 'next/server';

export function middleware(req) {
  const auth = req.headers.get('authorization');

  const USER = "admin";
  const PASS = "Optimus65!";

  if (!auth) {
    return new Response('Auth required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  const base64 = auth.split(' ')[1];
  const [user, pass] = atob(base64).split(':');

  if (user === USER && pass === PASS) {
    return NextResponse.next();
  }

  return new Response('Access denied', { status: 403 });
}

// 🔥 VERY IMPORTANT
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};