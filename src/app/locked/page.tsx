import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getProfile, getSettings } from '@/lib/data';
import { LockScreen } from '@/components/LockScreen';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sabar yaa… — Reza',
  robots: { index: false, follow: false },
};

/*
 * Shown in place of any public page while privacy mode is on (the proxy
 * rewrites to it). Opened directly it only shows while the site is locked,
 * or with ?preview so the admin can look at it.
 */
export default async function LockedPage({ searchParams }: { searchParams: Promise<{ preview?: string }> }) {
  const { preview } = await searchParams;
  if (!getSettings().privateMode && preview === undefined) redirect('/');

  const profile = getProfile();
  return <LockScreen avatar={profile.avatar || '/images/profile.png'} email={profile.email} />;
}
