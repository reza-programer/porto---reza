'use client';

import React, { useEffect, useState } from 'react';
import { Asterisk, Crosshair } from '@/components/ui/Glyphs';

/*
 * Full-screen loader in the site's look: the wordmark bar, a turning lime
 * asterisk, a big percentage and a hairline progress bar. The count is an
 * estimate: it eases toward 96% while waiting, and runs to 100% once
 * `done` is set (used after the password is accepted).
 */
export function LoadingScreen({ done = false }: { done?: boolean }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setN((v) => (done ? Math.min(100, v + 7) : v + Math.max(0.3, (96 - v) * 0.06)));
    }, 40);
    return () => window.clearInterval(timer);
  }, [done]);

  const pct = Math.min(100, Math.floor(n));

  return (
    <div role="status" aria-live="polite" aria-label="Loading" className="site fade-in-late fixed inset-0 z-[80] flex flex-col">
      <header className="border-b border-ink/15">
        <div className="wrap flex h-[72px] items-center justify-between">
          <span className="display wdth-112 text-[1.55rem] leading-none tracking-[-0.04em]">Kezot.</span>
          <span className="text-right text-[0.78rem] font-medium uppercase leading-snug tracking-[0.06em]">
            / {new Date().getFullYear()}
            <br />
            Portfolio
          </span>
        </div>
      </header>

      <div className="wrap relative flex flex-1 flex-col justify-end pb-8 sm:pb-10">
        <span aria-hidden className="absolute inset-y-0 left-[40%] hidden w-px bg-ink/15 lg:block" />

        <div className="relative flex items-center gap-4">
          <Asterisk className="spin-slow h-9 w-9 text-lime [animation-duration:2.4s]" />
          <span className="text-[0.82rem] font-medium uppercase tracking-[0.2em]">{done ? 'Opening' : 'Loading'}</span>
        </div>

        <div className="display wdth-125 relative mt-3 text-[clamp(5.5rem,19vw,19rem)] tabular-nums leading-[0.8]">
          {pct}
          <span className="relative -top-[1.15em] ml-[0.04em] text-[0.32em]">%</span>
        </div>

        <div className="relative mt-8 h-px w-full bg-ink/15">
          <div className="absolute left-0 top-[-1px] h-[3px] bg-ink transition-[width] duration-150" style={{ width: `${pct}%` }} />
        </div>

        <div className="mono relative mt-4 flex items-center justify-between">
          <span className="flex items-center gap-3">
            <Crosshair className="h-4 w-4" /> 6.9757° S, 108.4831° E
          </span>
          <span>Mohamad Reza®</span>
        </div>
      </div>
    </div>
  );
}
