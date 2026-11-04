'use client';

import { useEffect } from 'react';

/**
 * Reloads the page when the visitor's access runs out, so the lock screen
 * comes back even if the page is left open. Also checks on returning to the
 * tab, since timers don't run while a laptop sleeps.
 */
export function AccessTimer({ expiresAt }: { expiresAt: number }) {
  useEffect(() => {
    const check = () => {
      if (Date.now() >= expiresAt) window.location.reload();
    };
    // setTimeout can't wait longer than about 24.8 days.
    const timer = window.setTimeout(check, Math.min(Math.max(0, expiresAt - Date.now()) + 1000, 2_147_483_647));
    document.addEventListener('visibilitychange', check);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', check);
    };
  }, [expiresAt]);

  return null;
}
