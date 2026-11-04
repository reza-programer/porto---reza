import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { AUTH_SECRET } from '@/lib/auth';
import { getSettings } from '@/lib/data';

/*
 * Privacy mode: while it's on, public pages ask for a visitor password.
 * Entering it sets a cookie holding a signature of the current password
 * hash, so changing the password (or the secret) signs everyone out.
 */

export const ACCESS_COOKIE = 'reza_access';
export const ACCESS_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const lockedMetadata: Metadata = {
  title: 'Sabar yaa… — Reza',
  robots: { index: false, follow: false },
};

export function accessToken(passwordHash: string): string {
  return createHmac('sha256', AUTH_SECRET).update(passwordHash).digest('hex');
}

export function hasAccess(cookieValue: string | undefined, passwordHash: string): boolean {
  if (!cookieValue || !passwordHash) return false;
  const expected = Buffer.from(accessToken(passwordHash));
  const given = Buffer.from(cookieValue);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** True while privacy mode is on and this visitor hasn't entered the password yet. */
export async function isLocked(): Promise<boolean> {
  const { privateMode, passwordHash } = getSettings();
  if (!privateMode || !passwordHash) return false;
  return !hasAccess((await cookies()).get(ACCESS_COOKIE)?.value, passwordHash);
}
