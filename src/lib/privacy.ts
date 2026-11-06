import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { AUTH_SECRET } from '@/lib/auth';
import { getSettings } from '@/lib/data';

/*
 * Privacy mode: while it's on, public pages ask for a visitor password.
 * Entering it sets a cookie "<issued-at>.<signature>". The signature covers
 * the current password hash and the time it was issued, so access runs out
 * after the configured minutes, and changing the password signs everyone out.
 */

export const ACCESS_COOKIE = 'reza_access';

/** Durations the admin can pick, in minutes. */
export const ACCESS_CHOICES = [30, 60];

export const lockedMetadata: Metadata = {
  title: 'Privat — Reza',
  robots: { index: false, follow: false },
};

function sign(passwordHash: string, issuedAt: number): string {
  return createHmac('sha256', AUTH_SECRET).update(`${passwordHash}.${issuedAt}`).digest('hex');
}

export function issueAccessToken(passwordHash: string, issuedAt = Date.now()): string {
  return `${issuedAt}.${sign(passwordHash, issuedAt)}`;
}

/** When this cookie's access runs out (ms since epoch), or null if it isn't valid now. */
export function accessExpiry(cookieValue: string | undefined, passwordHash: string, minutes: number): number | null {
  if (!cookieValue || !passwordHash) return null;
  const [issued, signature = ''] = cookieValue.split('.');
  const issuedAt = Number(issued);
  if (!Number.isFinite(issuedAt)) return null;

  const expected = Buffer.from(sign(passwordHash, issuedAt));
  const given = Buffer.from(signature);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;

  const expiresAt = issuedAt + minutes * 60_000;
  return Date.now() < expiresAt ? expiresAt : null;
}

/**
 * Whether this visitor is kept out right now, and if they're in under
 * privacy mode, when their access ends.
 */
export async function getAccess(): Promise<{ locked: boolean; expiresAt?: number }> {
  const { privateMode, passwordHash, accessMinutes } = getSettings();
  if (!privateMode || !passwordHash) return { locked: false };
  const expiresAt = accessExpiry((await cookies()).get(ACCESS_COOKIE)?.value, passwordHash, accessMinutes);
  return expiresAt ? { locked: false, expiresAt } : { locked: true };
}

export async function isLocked(): Promise<boolean> {
  return (await getAccess()).locked;
}
