'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;

/** Diagonal caution tape with a running label, laid across the screen. */
function CautionTape({ className, reverse = false }: { className: string; reverse?: boolean }) {
  const words = Array.from({ length: 8 }, (_, i) => (
    <span key={i} className="flex items-center gap-6">
      Lagi dibangun <span aria-hidden>✦</span> Under construction <span aria-hidden>✦</span>
    </span>
  ));
  return (
    <div aria-hidden className={`caution-tape absolute left-[-10%] z-0 w-[120%] overflow-hidden border-y-[3px] border-navy py-2 ${className}`}>
      <div
        className="ticker flex w-max gap-6 font-mono text-[0.78rem] font-bold uppercase tracking-[0.12em] text-navy"
        style={reverse ? { animationDirection: 'reverse' } : undefined}
      >
        {words}
        {words}
      </div>
    </div>
  );
}

/** A hand-drawn padlock; the shackle lifts when it opens. */
function Padlock({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 120 150" className="h-full w-full overflow-visible" aria-hidden>
      <path
        d="M30 70 V48 a30 30 0 0 1 60 0 V70"
        fill="none"
        stroke="#0c2340"
        strokeWidth="14"
        strokeLinecap="round"
        className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{ transform: open ? 'translateY(-16px) rotate(-14deg)' : undefined, transformOrigin: '90px 70px' }}
      />
      <path
        d="M30 70 V48 a30 30 0 0 1 60 0 V70"
        fill="none"
        stroke="#d5dbe3"
        strokeWidth="6"
        strokeLinecap="round"
        className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{ transform: open ? 'translateY(-16px) rotate(-14deg)' : undefined, transformOrigin: '90px 70px' }}
      />
      <rect x="12" y="66" width="96" height="76" rx="14" fill="#0b5cad" stroke="#0c2340" strokeWidth="4" />
      <rect x="22" y="76" width="22" height="8" rx="4" fill="#ffffff" opacity="0.35" />
      <circle cx="60" cy="98" r="9" fill="#0c2340" />
      <path d="M56 104 L64 104 L62 122 L58 122 Z" fill="#0c2340" />
    </svg>
  );
}

/*
 * The "kepo yaaa?" screen shown while privacy mode is on: caution tape,
 * Reza in a hard hat, a swinging padlock and the password form. A wrong
 * password shakes the card; the right one opens the lock and loads the page.
 */
export function LockScreen({ avatar, email }: { avatar: string; email: string }) {
  const reduce = useReducedMotion();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'wrong' | 'open'>('idle');
  const [attempt, setAttempt] = useState(0);

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
      }, 900);
    } else {
      setStatus('wrong');
      setAttempt((n) => n + 1);
    }
  };

  return (
    <main className="grain relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-chalk px-5 py-32 text-navy">
      <CautionTape className="top-6 -rotate-3" />
      <CautionTape className="bottom-6 rotate-2" reverse />

      <motion.div
        key={attempt}
        initial={attempt === 0 ? { opacity: 0, y: reduce ? 0 : 24 } : false}
        animate={attempt === 0 ? { opacity: 1, y: 0 } : { x: reduce ? 0 : [0, -12, 12, -9, 9, -4, 4, 0] }}
        transition={attempt === 0 ? { duration: 0.9, ease } : { duration: 0.5 }}
        className="relative z-10 w-full max-w-lg text-center"
      >
        {/* Padlock swinging on its hook, with Reza peeking out in a hard hat */}
        <div className="relative mx-auto h-36 w-56">
          <div className="swing absolute left-6 top-0 h-32 w-24">
            <Padlock open={status === 'open'} />
          </div>
          <div className="bob absolute right-2 top-6 w-24">
            <svg viewBox="0 0 100 46" className="absolute -top-7 left-1/2 z-10 w-[86%] -translate-x-1/2 -rotate-6" aria-hidden>
              <path d="M10 40 C10 10 90 10 90 40 Z" fill="#ffd23f" stroke="#0c2340" strokeWidth="4" strokeLinejoin="round" />
              <path d="M44 14 h12 v26 h-12 z" fill="#ffd23f" stroke="#0c2340" strokeWidth="3" strokeLinejoin="round" />
              <rect x="2" y="38" width="96" height="8" rx="4" fill="#ffd23f" stroke="#0c2340" strokeWidth="4" />
            </svg>
            <div className="aspect-square overflow-hidden rounded-full border-[5px] border-white bg-ice shadow-[0_8px_18px_rgba(12,35,64,0.3)]">
              <img src={avatar} alt="" className="h-full w-full object-cover object-[50%_18%]" draggable={false} />
            </div>
          </div>
        </div>

        <h1 className="mt-8 font-marker text-[clamp(2.2rem,8vw,3.6rem)] uppercase leading-none">
          Kepo yaaa?{' '}
          <span className="inline-block origin-bottom animate-[wiggle_1.6s_ease-in-out_infinite] motion-reduce:animate-none" aria-hidden>
            👀
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-sm font-hand text-[1.9rem] font-semibold leading-tight">
          Sabar yaa, portofolio ini lagi dalam <span className="text-flame">tahap pengembangan.</span>
        </p>

        <div className="mx-auto mt-6 max-w-xs">
          <div className="flex items-center justify-between font-mono text-[0.68rem] font-bold uppercase">
            <span>
              Lagi dibangun<span className="loading-dots" />
            </span>
            <span className="text-ocean">hampir jadi</span>
          </div>
          <div className="mt-1.5 h-4 overflow-hidden rounded-full border-2 border-navy bg-white">
            <div className="progress-stripes h-full rounded-full border-r-2 border-navy" />
          </div>
        </div>

        <form onSubmit={submit} className="mx-auto mt-9 max-w-sm">
          <label htmlFor="visitor-password" className="block font-mono text-[0.7rem] font-bold uppercase text-navy/70">
            Punya password? Masuk di sini
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="visitor-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (status === 'wrong') setStatus('idle');
              }}
              placeholder="Masukkan password"
              aria-invalid={status === 'wrong'}
              className="min-w-0 flex-1 rounded-full border-2 border-navy bg-white px-4 py-2.5 font-mono text-sm shadow-[3px_3px_0_#0c2340] outline-none placeholder:text-navy/40 focus:border-ocean"
            />
            <button type="submit" disabled={!password || status === 'checking' || status === 'open'} className="btn-stamp btn-stamp-ocean shrink-0">
              {status === 'checking' ? 'Cek…' : status === 'open' ? 'Yeay!' : 'Buka →'}
            </button>
          </div>
          <p aria-live="polite" className="mt-3 min-h-[1.75rem] font-hand text-xl font-semibold">
            {status === 'wrong' && <span className="text-flame">Yah, password-nya salah. Coba lagi ya!</span>}
            {status === 'open' && <span className="text-ocean">Yeay, silakan masuk…</span>}
          </p>
        </form>

        <p className="mt-2 font-mono text-[0.72rem] leading-relaxed text-navy/70">
          Belum punya password? Minta ke Reza lewat{' '}
          <a href={`mailto:${email}`} className="link-draw font-bold text-navy">
            {email}
          </a>
        </p>
      </motion.div>
    </main>
  );
}
