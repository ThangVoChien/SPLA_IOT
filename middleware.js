import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = 'SPLA_IOT_SUPER_SECRET';
const key = new TextEncoder().encode(secretKey);

export async function middleware(request) {
  const session = request.cookies.get('session')?.value;

  // Protect /dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    try {
      const { payload } = await jwtVerify(session, key, { algorithms: ['HS256'] });

      // Admin-only sub-routes
      const adminOnlyRoutes = ['/dashboard/users', '/dashboard/organizations', '/dashboard/logs', '/dashboard/sensors'];
      const isTryingAdminRoute = adminOnlyRoutes.some(route => request.nextUrl.pathname.startsWith(route));

      if (isTryingAdminRoute && payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (err) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect /api/admin routes with strict RBAC
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    if (!session) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    try {
      const { payload } = await jwtVerify(session, key, { algorithms: ['HS256'] });
      if (payload.role !== 'ADMIN') {
        return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
      }
    } catch (err) {
      return new NextResponse(JSON.stringify({ error: 'Invalid Session' }), { status: 401 });
    }
  }

  // Auto-redirect root
  if (request.nextUrl.pathname === '/') {
    if (session) {
      try {
        await jwtVerify(session, key, { algorithms: ['HS256'] });
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch (err) { }
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Protect /api/devices and /api/users routes (any authenticated user)
  if (request.nextUrl.pathname.startsWith('/api/devices') || request.nextUrl.pathname.startsWith('/api/users')) {
    if (!session) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    try {
      await jwtVerify(session, key, { algorithms: ['HS256'] });
    } catch (err) {
      return new NextResponse(JSON.stringify({ error: 'Invalid Session' }), { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/admin/:path*', '/api/devices/:path*', '/api/users/:path*', '/'],
};
