'use client';

import React from 'react';
import { MarkerText } from '@/components/ui/MarkerText';
import { Reveal } from '@/components/ui/Reveal';
import { techIcon } from '@/lib/tech-icons';
import type { Profile } from '@/types';

// Everything in the toolbox, for the running ticker at the top.
const TOOLS = [
  'Laravel',
  'Vue.js',
  'React',
  'Next.js',
  'React Native',
  'JavaScript',
  'TypeScript',
  'Python',
  'CodeIgniter',
  'Tailwind CSS',
  'MySQL',
  'PostgreSQL',
  'Docker',
  'Git',
  'GitHub',
  'Postman',
  'Selenium',
  'JMeter',
  'Jira',
  'Google Colab',
];

interface SkillsSectionProps {
  profile: Profile;
}

/*
 * Laid out like a shop shelf: each skill is a product card with its icon,
 * name and a level bar, grouped by category on a blue block.
 */
export const SkillsSection: React.FC<SkillsSectionProps> = ({ profile }) => {
  return (
    <section id="skills" className="relative overflow-hidden border-b-[3px] border-navy bg-ocean text-white">
      <div className="overflow-hidden border-b-[3px] border-navy bg-navy py-3" aria-hidden>
        <div className="ticker flex w-max gap-10 pr-10 font-mono text-[0.8rem] font-bold uppercase">
          {[...TOOLS, ...TOOLS].map((name, i) => {
            const Icon = techIcon(name);
            return (
              <span key={i} className="flex items-center gap-2.5 whitespace-nowrap">
                <Icon className="h-4 w-4 text-ice" />
                {name}
                <span className="ml-8 text-flame">✦</span>
              </span>
            );
          })}
        </div>
      </div>

      <div className="wrap py-20 sm:py-24">
        <Reveal>
          <h2 className="t-marker relative inline-block">
            My toolbox
            <span className="absolute -right-4 top-full -rotate-3 whitespace-nowrap font-hand text-[0.4em] normal-case text-sun sm:-right-10">
              what I reach for every day
            </span>
          </h2>
          <p className="mt-10 max-w-lg font-mono text-[0.82rem] leading-relaxed text-white/80">
            Tech stack and tools I use to build, test, and deploy modern applications.
          </p>
        </Reveal>

        {profile.skills.map((cat) => (
          <Reveal key={cat.category} className="mt-14">
            <div className="flex items-center gap-4">
              <h3 className="font-marker text-xl uppercase sm:text-2xl"><MarkerText>{cat.category}</MarkerText></h3>
              <span className="h-[3px] flex-1 rounded-full bg-white/25" />
              <span className="font-mono text-[0.7rem] font-bold uppercase text-ice">{cat.skills.length} items</span>
            </div>

            <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {cat.skills.map((s) => {
                const Icon = techIcon(s.name);
                return (
                  <li
                    key={s.name}
                    className="group flex flex-col border-[3px] border-navy bg-white text-navy shadow-[5px_5px_0_#0c2340] transition-transform duration-300 hover:-translate-y-1 hover:-rotate-1"
                  >
                    <div className="flex aspect-[5/3] items-center justify-center border-b-[3px] border-navy bg-chalk">
                      <Icon className="h-11 w-11 text-ocean transition-transform duration-300 group-hover:scale-110" aria-hidden />
                    </div>
                    <div className="flex flex-1 flex-col justify-between gap-3 p-3">
                      <div className="font-mono text-[0.76rem] font-bold uppercase leading-tight">{s.name}</div>
                      <div className="flex items-center gap-2" title={`Level ${s.level} / 100`}>
                        <span className="h-3 flex-1 overflow-hidden rounded-full border-2 border-navy bg-white">
                          <span className="block h-full bg-leaf" style={{ width: `${s.level}%` }} />
                        </span>
                        <span className="font-mono text-[0.68rem] font-bold tabular-nums">{s.level}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
};
