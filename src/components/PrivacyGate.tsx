import React from 'react';
import { getProfile } from '@/lib/data';
import { getAccess } from '@/lib/privacy';
import { AccessTimer } from '@/components/AccessTimer';
import { LockScreen } from '@/components/LockScreen';

/*
 * Wraps a public page: while privacy mode keeps this visitor out it renders
 * the lock screen instead, so none of the page's content is sent.
 * Once they're in, a timer brings the lock back when their access runs out.
 * Checked while rendering (not in a proxy) so it works on any host.
 */
export async function PrivacyGate({ children }: { children: React.ReactNode }) {
  const { locked, expiresAt } = await getAccess();
  if (locked) {
    const profile = getProfile();
    return <LockScreen name={profile.name} avatar={profile.avatar || '/images/profile.png'} email={profile.email} />;
  }
  return (
    <>
      {children}
      {expiresAt && <AccessTimer expiresAt={expiresAt} />}
    </>
  );
}
