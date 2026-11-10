'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Asterisk, Crosshair, ScrollBadge } from '@/components/ui/Glyphs';
import { PortraitCutout } from '@/components/ui/PortraitCutout';
import type { Profile } from '@/types';

const ease = [0.16, 1, 0.3, 1] as const;

/*
 * Two halves split by a hairline: the greeting and a huge two-line name on
 * the left, the cut-out portrait over a tilted lime panel on the right,
 * with the year in the corner and a turning "scroll down" badge.
 */
export const HeroSection: React.FC<{ profile: Profile }> = ({ profile }) => {
  const reduce = useReducedMotion();
  const year = new Date().getFullYear();
  const [, first = 'Mohamad', second = 'Reza'] = ['', ...profile.name.split(' ')];

  const up = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease },
  });

  return (
    <section id="home" className="relative overflow-hidden border-b border-ink/15 pt-[72px]">
      <div className="wrap relative grid grid-cols-12 lg:h-[clamp(620px,calc(100svh-72px),820px)]">
        {/* Hairline splitting the two halves */}
        <span aria-hidden className="absolute inset-y-0 left-[40%] hidden w-px bg-ink/15 lg:block" />

        {/* Text */}
        <div className="relative z-10 col-span-12 flex flex-col pb-10 pt-10 sm:pt-14 lg:col-span-7 lg:pb-12">
          <motion.div {...up(0.05)} className="flex items-center gap-4">
            <Asterisk className="h-9 w-9 text-lime" />
            <span className="text-[0.82rem] font-medium uppercase tracking-[0.2em]">Hello, I&apos;m</span>
          </motion.div>

          <motion.h1 {...up(0.15)} aria-label={profile.name} className="display wdth-125 mt-4 text-[clamp(3.1rem,7.6vw,8.2rem)]">
            <span className="block">{first}</span>
            <span className="block">
              {second}
              <sup className="relative -top-[1.1em] ml-[0.06em] text-[0.3em] font-light tracking-normal">®</sup>
            </span>
          </motion.h1>

          <motion.div {...up(0.3)} className="mt-8 flex max-w-[34rem] items-center gap-5 text-[0.78rem] font-semibold uppercase tracking-[0.28em]">
            <span className="shrink-0">Fullstack Dev &amp; QA</span>
            <span aria-hidden className="h-px flex-1 bg-ink/40" />
            <span className="shrink-0">Indonesia</span>
          </motion.div>

          <motion.p {...up(0.4)} className="mt-7 max-w-[22rem] text-[1.05rem] leading-relaxed text-ink/80">
            Building digital experiences with clean code and careful testing.
          </motion.p>

          <motion.div {...up(0.5)} className="mt-8">
            <a href="#projects" className="btn-ink">
              View my work <span aria-hidden>↗</span>
            </a>
          </motion.div>

          <motion.div {...up(0.6)} className="mono mt-12 hidden items-center gap-4 lg:mt-auto lg:flex lg:pt-12">
            <Crosshair className="h-6 w-6" />
            <span>
              6.9757° S
              <br />
              108.4831° E
            </span>
          </motion.div>
        </div>

        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.25, ease }}
          className="relative col-span-12 h-[min(112vw,520px)] lg:absolute lg:bottom-0 lg:right-[9%] lg:h-[90%] lg:w-[40%]"
        >
          <PortraitCutout alt={profile.name} className="h-full" />
        </motion.div>

        {/* Corner notes */}
        <motion.div {...up(0.5)} className="absolute right-[clamp(1.25rem,3.6vw,3.5rem)] top-10 hidden text-right text-[0.78rem] font-medium uppercase leading-snug tracking-[0.06em] lg:block">
          / {year}
          <br />
          Portfolio
        </motion.div>
        <motion.div {...up(0.7)} className="absolute right-[clamp(1.25rem,3.6vw,3.5rem)] top-[44%] hidden lg:block">
          <ScrollBadge className="h-32 w-32" />
        </motion.div>
      </div>
    </section>
  );
};
