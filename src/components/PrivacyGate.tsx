import React from 'react';
import { getProfile } from '@/lib/data';
import { isLocked } from '@/lib/privacy';
import { LockScreen } from '@/components/LockScreen';

/*
 * Wraps a public page: while privacy mode keeps this visitor out it renders
 * the "kepo yaaa" lock screen instead, so none of the page's content is sent.
 * Checked while rendering (not in a proxy) so it works on any host.
 */
export async function PrivacyGate({ children }: { children: React.ReactNode }) {
  if (await isLocked()) {
    const profile = getProfile();
    return <LockScreen avatar={profile.avatar || '/images/profile.png'} email={profile.email} />;
  }
  return <>{children}</>;
}
