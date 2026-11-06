'use client';

import React, { useRef, useState } from 'react';
import { motion, useAnimate, useReducedMotion } from 'framer-motion';
import { FiArrowRight, FiCheck, FiLock, FiUnlock } from 'react-icons/fi';

const ease = [0.16, 1, 0.3, 1] as const;

/*
 * Shown while privacy mode is on: a quiet, centred screen with Reza's photo,
 * a short note and the password field. A wrong password shakes the field;
 * the right one swaps the lock badge open and loads the page.
 */
export function LockScreen({ name, avatar, email }: { name: string; avatar: string; email: string }) {
  const reduce = useReducedMotion();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'wrong' | 'open'>('idle');
  const [fieldRef, animate] = useAnimate<HTMLDivElement>();
  const inputRef = useRef<HTMLInputElement>(null);

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
      // Same URL now passes the gate; the lock page itself goes home.
      window.setTimeout(() => {
        if (window.location.pathname === '/locked') window.location.replace('/');
        else window.location.reload();
      }, 700);
    } else {
      setStatus('wrong');
      inputRef.current?.select();
      if (!reduce) animate(fieldRef.current, { x: [0, -8, 8, -5, 5, 0] }, { duration: 0.4 });
    }
  };

  const open = status === 'open';
  const wrong = status === 'wrong';

  return (
    <main className="relative flex min-h-svh flex-col overflow-hidden bg-paper text-ink">
      {/* Faint dot grid that fades out toward the edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(var(--color-line-strong)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
      />

      <header className="wrap relative flex items-center justify-between gap-4 py-6">
        <span className="t-small truncate font-medium">
          <span className="sm:hidden">{name.split(' ').slice(0, 2).join(' ')}</span>
          <span className="hidden sm:inline">{name}</span>
        </span>
        <span className="chip shrink-0">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-amber-500/60 motion-reduce:hidden" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-amber-500" />
          </span>
          Dalam pengembangan
        </span>
      </header>

      <section className="relative flex flex-1 items-center justify-center px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="w-full max-w-[420px] text-center"
        >
          <div className="relative mx-auto w-fit">
            <img
              src={avatar}
              alt=""
              draggable={false}
              className="h-[72px] w-[72px] rounded-full border border-line bg-accent-soft object-cover object-[50%_18%]"
            />
            <span
              className={`absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full text-white ring-4 ring-paper transition-colors duration-300 ${
                open ? 'bg-emerald-600' : 'bg-ink'
              }`}
            >
              {open ? <FiUnlock className="h-3.5 w-3.5" /> : <FiLock className="h-3.5 w-3.5" />}
            </span>
          </div>

          <h1 className="t-h2 mt-7">Portofolio ini masih privat</h1>
          <p className="t-body mx-auto mt-3 max-w-[34ch] text-muted">
            Lagi dirapikan sebelum dibuka untuk umum. Kalau kamu punya password, silakan masuk.
          </p>

          <form onSubmit={submit} className="mt-8">
            <label htmlFor="visitor-password" className="sr-only">
              Password
            </label>
            <div
              ref={fieldRef}
              className={`flex items-center gap-2 rounded-full border bg-surface p-1.5 pl-5 shadow-[0_1px_2px_rgba(10,10,10,0.04)] transition-[border-color,box-shadow] duration-200 ${
                wrong
                  ? 'border-red-300 ring-[3px] ring-red-500/10'
                  : 'border-line-strong focus-within:border-ink focus-within:ring-[3px] focus-within:ring-ink/[0.06]'
              }`}
            >
              <input
                ref={inputRef}
                id="visitor-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (wrong) setStatus('idle');
                }}
                placeholder="Masukkan password"
                aria-invalid={wrong}
                aria-describedby="visitor-password-status"
                disabled={open}
                // The pill around it shows focus; the global :focus-visible
                // outline would draw a second box inside it.
                style={{ outline: 'none' }}
                className="t-body min-w-0 flex-1 bg-transparent py-1.5 placeholder:text-faint"
              />
              <button
                type="submit"
                disabled={!password || status === 'checking' || open}
                className={`btn shrink-0 px-4 py-2.5 text-paper disabled:cursor-not-allowed ${
                  open ? 'bg-emerald-600' : 'bg-ink hover:bg-ink-2 disabled:opacity-40'
                }`}
              >
                {status === 'checking' ? (
                  'Memeriksa…'
                ) : open ? (
                  <>
                    Terbuka <FiCheck className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Masuk <FiArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
            <p id="visitor-password-status" aria-live="polite" className="t-small mt-3 min-h-[1.25rem]">
              {wrong && <span className="text-red-600">Password-nya salah. Coba lagi, ya.</span>}
              {open && <span className="text-emerald-700">Berhasil, membuka portofolio…</span>}
            </p>
          </form>
        </motion.div>
      </section>

      <footer className="wrap relative py-6 text-center">
        <p className="t-small text-muted">
          Belum punya password? Minta ke{' '}
          <a href={`mailto:${email}`} className="link-draw font-medium text-ink">
            {email}
          </a>
        </p>
      </footer>
    </main>
  );
}
