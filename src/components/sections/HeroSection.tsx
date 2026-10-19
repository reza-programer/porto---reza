'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FiArrowDown, FiArrowUpRight } from 'react-icons/fi';
import { IdCard } from '@/components/ui/IdCard';
import type { Profile } from '@/types';

interface HeroSectionProps {
  profile: Profile;
}

const ease = [0.16, 1, 0.3, 1] as const;

/*
 * Entrance timeline (seconds). Everything appears one piece at a time:
 * eyebrow lines → headline lines → bio word by word → buttons → stats.
 */
const T = {
  eyebrow: 0.1,
  headline: 0.3,
  headlineStep: 0.12,
  bio: 0.75,
  bioStep: 0.016,
  buttons: 1.15,
  stats: 1.35,
};

/** A line that rises out of a clipping mask. */
function MaskLine({ children, delay, className = '' }: { children: React.ReactNode; delay: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: reduce ? 0 : '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1.05, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Text that fades in word by word, from slightly blurred to sharp. */
function Words({ text, delay, step }: { text: string; delay: number; step: number }) {
  const reduce = useReducedMotion();
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <motion.span
            className="inline-block"
            initial={reduce ? false : { opacity: 0, y: 8, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: delay + i * step, ease }}
          >
            {word}
          </motion.span>{' '}
        </React.Fragment>
      ))}
    </>
  );
}

/** Counts from 0 up to `to` once `delay` has passed. */
function CountUp({ to, delay }: { to: number; delay: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    const timer = window.setTimeout(() => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const duration = reduce ? 0 : 1400;
      const start = performance.now();
      const tick = (now: number) => {
        const p = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        setValue(Math.round(to * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay * 1000);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [to, delay]);

  return <span className="tabular-nums">{value}</span>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  const reduce = useReducedMotion();
  const rise = (delay: number, y = 14) => ({
    initial: { opacity: 0, y: reduce ? 0 : y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease },
  });

  const stats = [
    { value: profile.stats.projectsCompleted, label: 'Projects built' },
    { value: profile.stats.yearsExperience, label: 'Years experience' },
    { value: profile.stats.certificatesEarned, label: 'Certifications' },
  ];

  return (
    <section id="home" className="relative overflow-hidden pt-20 sm:pt-24">
      <div className="wrap grid grid-cols-12 items-center gap-x-8 gap-y-4 lg:min-h-[calc(100svh-6rem)]">
        {/* Copy */}
        <div className="col-span-12 pt-10 lg:col-span-6 lg:pt-0">
          <div className="eyebrow flex flex-col gap-2">
            <motion.span {...rise(T.eyebrow, 10)} className="text-ink">
              {profile.name}
            </motion.span>
            <motion.span {...rise(T.eyebrow + 0.1, 10)} className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50 motion-reduce:hidden" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Available for new roles &amp; freelance
            </motion.span>
          </div>

          <h1 className="t-display mt-6">
            <MaskLine delay={T.headline}>Junior Fullstack</MaskLine>
            <MaskLine delay={T.headline + T.headlineStep}>Developer</MaskLine>
            <MaskLine delay={T.headline + T.headlineStep * 2} className="text-muted">
              &amp; Manual QA
            </MaskLine>
          </h1>

          <p className="t-lead mt-6 max-w-xl text-muted">
            <Words text={profile.bio} delay={T.bio} step={T.bioStep} />
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <motion.a {...rise(T.buttons)} href="#projects" className="btn btn-primary group">
              See selected work
              <FiArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </motion.a>
            {profile.resumeUrl && (
              <motion.a {...rise(T.buttons + 0.1)} href={profile.resumeUrl} className="btn btn-outline group">
                Curriculum Vitae
                <FiArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </motion.a>
            )}
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                {...rise(T.stats + i * 0.1)}
                className={`flex flex-col-reverse border-t border-line pt-5 ${i > 0 ? 'border-l pl-4 sm:pl-5' : ''}`}
              >
                <dt className="t-small text-muted">{s.label}</dt>
                <dd className="t-h2 mb-1">
                  <CountUp to={s.value} delay={T.stats + i * 0.1} />
                  <span className="text-faint">+</span>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>

        {/* ID card */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.45, ease }}
          className="relative col-span-12 h-[540px] sm:h-[640px] lg:col-span-6 lg:h-[calc(100svh-6rem)] lg:max-h-[780px] lg:min-h-[620px]"
        >
          <IdCard profile={profile} />
        </motion.div>
      </div>
    </section>
  );
};
