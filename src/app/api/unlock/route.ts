import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { getSettings } from '@/lib/data';
import { ACCESS_COOKIE, ACCESS_MAX_AGE, accessToken } from '@/lib/privacy';

/** Checks the visitor password and, if it matches, hands out the access cookie. */
export async function POST(request: Request) {
  const { privateMode, passwordHash } = getSettings();
  if (!privateMode || !passwordHash) return NextResponse.json({ ok: true });

  let password = '';
  try {
    password = String((await request.json()).password ?? '');
  } catch {
    // fall through with an empty password
  }

  if (!password || !(await compare(password, passwordHash))) {
    // A short pause makes guessing slower.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const proto = request.headers.get('x-forwarded-proto') ?? new URL(request.url).protocol.replace(':', '');
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ACCESS_COOKIE, accessToken(passwordHash), {
    httpOnly: true,
    sameSite: 'lax',
    secure: proto === 'https',
    path: '/',
    maxAge: ACCESS_MAX_AGE,
  });
  return response;
}
