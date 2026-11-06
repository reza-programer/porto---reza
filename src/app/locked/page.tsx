import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getProfile, getSettings } from '@/lib/data';
import { LockScreen } from '@/components/LockScreen';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Privat — Reza',
  robots: { index: false, follow: false },
};

/*
 * The lock screen on its own URL. Public pages render the same screen via
 * PrivacyGate; this route is for opening it directly: it only shows while
 * the site is locked, or with ?preview so the admin can look at it.
 */
export default async function LockedPage({ searchParams }: { searchParams: Promise<{ preview?: string }> }) {
  const { preview } = await searchParams;
  if (!getSettings().privateMode && preview === undefined) redirect('/');

  const profile = getProfile();
  return <LockScreen name={profile.name} avatar={profile.avatar || '/images/profile.png'} email={profile.email} />;
}
