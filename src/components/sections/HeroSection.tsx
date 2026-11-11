'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Profile } from '@/types';

const ease = [0.16, 1, 0.3, 1] as const;

/*
 * Plain two-column opening: availability, the name, role and one line of
 * intro with two actions on the left; the portrait on a lime card on the
 * right; and the key numbers in a row along the bottom.
 */
export const HeroSection: React.FC<{ profile: Profile }> = ({ profile }) => {
  const reduce = useReducedMotion();
  const [, first = 'Mohamad', second = 'Reza'] = ['', ...profile.name.split(' ')];

  const stats = [
    { value: `${profile.stats.projectsCompleted}+`, label: 'Projects delivered' },
    { value: `${profile.stats.yearsExperience}+`, label: 'Years of experience' },
    { value: String(profile.stats.certificatesEarned), label: 'Certificates' },
    { value: 'GMT+7', label: `Based in ${profile.location.split(',')[0]}` },
  ];

  const up = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease },
  });

  return (
    <section id="home" className="border-b border-ink/15 pt-[72px]">
      <div className="wrap flex flex-col lg:min-h-[calc(100svh-72px)]">
        <div className="grid flex-1 grid-cols-1 items-center gap-x-10 gap-y-12 py-12 lg:grid-cols-12 lg:py-8">
          {/* Text */}
          <div className="lg:col-span-7">
            <motion.span
              {...up(0.05)}
              className="inline-flex items-center gap-2.5 rounded-full border border-ink/15 bg-white/60 py-1.5 pl-2.5 pr-4 text-[0.78rem] font-medium"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-lime motion-reduce:hidden" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-lime ring-1 ring-ink/40" />
              </span>
              Available for freelance &amp; full-time
            </motion.span>

            <motion.h1 {...up(0.12)} aria-label={profile.name} className="display wdth-125 mt-7 text-[clamp(3rem,6.8vw,7.4rem)]">
              <span className="block">{first}</span>
              <span className="block">{second}</span>
            </motion.h1>

            <motion.div
              {...up(0.22)}
              className="mt-7 flex max-w-[34rem] items-center gap-5 text-[0.76rem] font-semibold uppercase tracking-[0.24em]"
            >
              <span className="shrink-0">Fullstack Dev &amp; QA</span>
              <span aria-hidden className="h-px flex-1 bg-ink/30" />
              <span className="shrink-0">Indonesia</span>
            </motion.div>

            <motion.p {...up(0.3)} className="mt-6 max-w-[30rem] text-[1.1rem] leading-relaxed text-ink/70">
              I build web applications with Laravel and Vue, and test them properly before they ship.
            </motion.p>

            <motion.div {...up(0.38)} className="mt-9 flex flex-wrap gap-3">
              <a href="#projects" className="btn-ink">
                View my work <span aria-hidden>↗</span>
              </a>
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} className="btn-outline-ink">
                  Curriculum vitae
                </a>
              )}
            </motion.div>
          </div>

          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease }}
            className="lg:col-span-5"
          >
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px] overflow-hidden rounded-[28px] bg-lime lg:ml-auto lg:mr-0 lg:h-[min(calc(100svh-340px),600px)] lg:w-auto lg:max-w-none">
              <img
                src="/images/profile-cutout.webp"
                alt={profile.name}
                draggable={false}
                className="absolute bottom-0 left-1/2 h-[92%] w-auto max-w-none -translate-x-1/2 object-contain contrast-[1.08] grayscale"
              />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl bg-sheet/95 px-4 py-3 backdrop-blur">
                <div className="min-w-0">
                  <div className="truncate text-[0.9rem] font-semibold">{profile.name}</div>
                  <div className="truncate text-[0.78rem] text-ink/60">Fullstack Developer &amp; Manual QA</div>
                </div>
                <span className="shrink-0 rounded-full bg-ink px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-sheet">
                  {new Date().getFullYear()}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Numbers */}
        <motion.dl {...up(0.5)} className="grid grid-cols-2 border-t border-ink/15 sm:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col-reverse gap-1.5 py-6 ${i % 2 ? 'pl-5 sm:pl-8' : ''} ${i > 0 ? 'sm:border-l sm:border-ink/15 sm:pl-8' : ''} ${
                i % 2 ? 'border-l border-ink/15' : ''
              } ${i > 1 ? 'border-t border-ink/15 sm:border-t-0' : ''}`}
            >
              <dt className="text-[0.8rem] text-ink/55">{s.label}</dt>
              <dd className="display wdth-112 text-[clamp(1.9rem,3vw,2.8rem)] leading-none">{s.value}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
};
