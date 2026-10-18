'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FiArrowDown, FiArrowUpRight } from 'react-icons/fi';
import { IdCard } from '@/components/ui/IdCard';
import type { Profile } from '@/types';

interface HeroSectionProps {
  profile: Profile;
}

const ease = [0.16, 1, 0.3, 1] as const;

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
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
          <motion.div {...rise(0.05)} className="eyebrow flex flex-col gap-2">
            <span className="text-ink">{profile.name}</span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Available for new roles &amp; freelance
            </span>
          </motion.div>

          <motion.h1 {...rise(0.12)} className="t-display mt-6">
            <span className="block">Junior Fullstack</span>
            <span className="block">Developer</span>
            <span className="block text-muted">&amp; Manual QA</span>
          </motion.h1>

          <motion.p {...rise(0.2)} className="t-lead mt-6 max-w-xl text-muted">
            {profile.bio}
          </motion.p>

          <motion.div {...rise(0.28)} className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#projects" className="btn btn-primary group">
              See selected work
              <FiArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} className="btn btn-outline group">
                Curriculum Vitae
                <FiArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}
          </motion.div>

          <motion.dl {...rise(0.36)} className="mt-12 grid max-w-lg grid-cols-3 border-t border-line">
            {stats.map((s, i) => (
              <div key={s.label} className={`flex flex-col-reverse pt-5 ${i > 0 ? 'border-l border-line pl-4 sm:pl-5' : ''}`}>
                <dt className="t-small text-muted">{s.label}</dt>
                <dd className="t-h2 mb-1">
                  {s.value}
                  <span className="text-faint">+</span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* ID card */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.15, ease }}
          className="relative col-span-12 h-[540px] sm:h-[640px] lg:col-span-6 lg:h-[calc(100svh-6rem)] lg:max-h-[780px] lg:min-h-[620px]"
        >
          <IdCard profile={profile} />
        </motion.div>
      </div>
    </section>
  );
};
