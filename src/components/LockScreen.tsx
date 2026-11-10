'use client';

import React, { useRef, useState } from 'react';
import { motion, useAnimate, useReducedMotion } from 'framer-motion';
import { FiEye, FiEyeOff, FiLock, FiUnlock } from 'react-icons/fi';
import { Asterisk, Crosshair, RingText } from '@/components/ui/Glyphs';
import { PortraitCutout } from '@/components/ui/PortraitCutout';
import { LoadingScreen } from '@/components/LoadingScreen';

const ease = [0.16, 1, 0.3, 1] as const;

/*
 * Shown while privacy mode is on: a sign-in page split in two. A black
 * panel with the portrait on the lime panel and a turning "private access"
 * ring; and the password form at full size. A wrong password shakes the
 * field; the right one runs the loader to 100% and opens the portfolio.
 */
export function LockScreen({ name, email }: { name: string; email: string }) {
  const reduce = useReducedMotion();
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'wrong' | 'open'>('idle');
  const [fieldRef, animate] = useAnimate<HTMLDivElement>();
  const inputRef = useRef<HTMLInputElement>(null);
  const year = new Date().getFullYear();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || status === 'checking' || status === 'open') return;
    setStatus('checking');
    const res = await fetch('/api/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    }).catch(() => null);

    if (res?.ok) {
      setStatus('open');
      // The loader runs to 100%, then the same URL loads past the gate (the lock page itself goes home).
      window.setTimeout(() => {
        if (window.location.pathname === '/locked') window.location.replace('/');
        else window.location.reload();
      }, 900);
    } else {
      setStatus('wrong');
      inputRef.current?.select();
      if (!reduce) animate(fieldRef.current, { x: [0, -10, 10, -6, 6, 0] }, { duration: 0.4 });
    }
  };

  const open = status === 'open';
  const wrong = status === 'wrong';

  const up = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease },
  });

  return (
    <main className="site grid min-h-svh grid-cols-1 lg:grid-cols-12">
      {/* Picture panel */}
      <aside className="relative hidden flex-col overflow-hidden bg-ink text-sheet lg:col-span-5 lg:flex">
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-sheet/15 px-[clamp(1.5rem,3vw,3rem)]">
          <span className="display wdth-112 text-[1.55rem] leading-none tracking-[-0.04em]">Kezot.</span>
          <span className="text-[0.78rem] font-medium uppercase tracking-[0.06em] text-sheet/60">/ {year}</span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease }}
          className="relative flex-1"
        >
          <div className="absolute inset-x-[4%] bottom-0 h-[84%]">
            <PortraitCutout alt={name} className="h-full" />
          </div>
        </motion.div>
        <div className="absolute right-[clamp(1.5rem,3vw,3rem)] top-[110px]">
          <RingText text="PRIVATE ACCESS · PRIVATE ACCESS ·" className="h-28 w-28">
            <span className={`grid h-10 w-10 place-items-center rounded-full ${open ? 'bg-lime text-ink' : 'bg-sheet text-ink'}`}>
              {open ? <FiUnlock className="h-4 w-4" /> : <FiLock className="h-4 w-4" />}
            </span>
          </RingText>
        </div>
      </aside>

      {/* Form */}
      <section className="flex min-h-svh flex-col lg:col-span-7">
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-ink/15 px-[clamp(1.25rem,5vw,5rem)]">
          <span className="display wdth-112 text-[1.55rem] leading-none tracking-[-0.04em] lg:invisible">Kezot.</span>
          <span className="flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-[0.06em]">
            <span className={`h-2 w-2 animate-pulse rounded-full ${open ? 'bg-lime ring-1 ring-ink' : 'bg-ink'}`} />
            {open ? 'Unlocked' : 'Private'}
          </span>
        </div>

        <div className="flex flex-1 items-center px-[clamp(1.25rem,5vw,5rem)] py-14">
          <div className="w-full max-w-[600px]">
            <motion.div {...up(0.05)} className="flex items-center gap-4">
              <Asterisk className="h-9 w-9 text-lime" />
              <span className="text-[0.82rem] font-medium uppercase tracking-[0.2em]">Private access</span>
            </motion.div>

            <motion.h1 {...up(0.15)} className="display wdth-125 mt-5 text-[clamp(2.3rem,6vw,6rem)]">
              <span className="block">Enter</span>
              <span className="block">password</span>
            </motion.h1>

            <motion.p {...up(0.25)} className="mt-6 max-w-[26rem] text-[1.05rem] leading-relaxed text-ink/70">
              Portofolio ini masih dikunci. Masukkan password untuk melihat isinya.
            </motion.p>

            <motion.form {...up(0.35)} onSubmit={submit} className="mt-10">
              <label htmlFor="visitor-password" className="label text-ink/60">
                Password
              </label>
              <div
                ref={fieldRef}
                className={`mt-2 flex items-center border-b-2 transition-colors ${
                  wrong ? 'border-red-600' : 'border-ink/25 focus-within:border-ink'
                }`}
              >
                <input
                  ref={inputRef}
                  id="visitor-password"
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  autoFocus
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (wrong) setStatus('idle');
                  }}
                  aria-invalid={wrong}
                  aria-describedby="visitor-password-status"
                  disabled={open}
                  placeholder="••••••••"
                  style={{ outline: 'none' }}
                  className="min-w-0 flex-1 bg-transparent py-4 text-[1.5rem] font-medium tracking-[0.12em] placeholder:text-ink/20"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
                  className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  {show ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>

              <p id="visitor-password-status" aria-live="polite" className="mt-3 min-h-[1.25rem] text-[0.85rem]">
                {wrong && <span className="text-red-600">Password salah. Coba lagi.</span>}
                {open && <span className="bg-lime px-1">Terbuka, memuat…</span>}
              </p>

              <button type="submit" disabled={!password || status === 'checking' || open} className="btn-ink mt-6 h-14 w-full text-[0.8rem]">
                {status === 'checking' ? 'Memeriksa…' : open ? 'Terbuka ✓' : 'Unlock portfolio'} <span aria-hidden>↗</span>
              </button>
            </motion.form>

            <motion.div {...up(0.45)} className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-ink/15 pt-5 text-[0.85rem]">
              <span className="text-ink/60">Belum punya password?</span>
              <a href={`mailto:${email}`} className="group flex items-center gap-2 font-medium">
                Minta akses
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </motion.div>
          </div>
        </div>

        <div className="mono flex h-14 shrink-0 items-center justify-between border-t border-ink/15 px-[clamp(1.25rem,5vw,5rem)]">
          <span className="flex items-center gap-3">
            <Crosshair className="h-4 w-4" /> 6.9757° S, 108.4831° E
          </span>
          <span>© {year} KEZOT.</span>
        </div>
      </section>

      {open && <LoadingScreen done />}
    </main>
  );
}
