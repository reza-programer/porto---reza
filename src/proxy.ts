import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { AUTH_SECRET } from '@/lib/auth';
import { getSettings } from '@/lib/data';
import { ACCESS_COOKIE, hasAccess } from '@/lib/privacy';

/*
 * Privacy mode gate. While it's on, any public page shows the "kepo yaaa"
 * lock screen instead (same URL) until the visitor enters the password.
 * A signed-in admin always sees the real site.
 */
export async function proxy(request: NextRequest) {
  const { privateMode, passwordHash } = getSettings();
  if (!privateMode || !passwordHash) return NextResponse.next();
  if (hasAccess(request.cookies.get(ACCESS_COOKIE)?.value, passwordHash)) return NextResponse.next();
  if (await getToken({ req: request, secret: AUTH_SECRET })) return NextResponse.next();

  const response = NextResponse.rewrite(new URL('/locked', request.url));
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('X-Robots-Tag', 'noindex');
  return response;
}

export const config = {
  // Everything except the admin panel, APIs, the lock screen itself and static files.
  matcher: [
    '/((?!api|admin|locked|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpe?g|gif|svg|webp|avif|ico|pdf|txt|xml|woff2?)$).*)',
  ],
};
