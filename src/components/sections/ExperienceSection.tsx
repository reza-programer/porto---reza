'use client';

import React, { useState } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';
import { formatTags } from '@/lib/project-meta';
import type { Experience } from '@/types';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <section id="experience" className="py-20 sm:py-28">
      <div className="wrap">
        <SectionHeader
          index="03"
          label="Experience"
          title="Work experience"
          intro="My professional journey and career milestones."
        />

        <div className="border-t border-line">
          {experiences.map((exp, i) => {
            const isOpen = !!expanded[exp.id];
            const long = exp.description.length > 160;
            const isCurrent = /present/i.test(exp.period);

            return (
              <Reveal key={exp.id} delay={Math.min(i, 4) * 0.04}>
                <article className="grid grid-cols-12 gap-x-8 gap-y-4 border-b border-line py-8">
                  <div className="col-span-12 md:col-span-3">
                    <div className="t-small font-medium text-ink">{exp.period}</div>
                    {exp.location && <div className="t-small mt-0.5 text-muted">{exp.location}</div>}
                    {isCurrent && (
                      <span className="chip mt-3 border-accent-soft bg-accent-soft text-accent">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Current
                      </span>
                    )}
                  </div>

                  <div className="col-span-12 md:col-span-9 lg:col-span-6">
                    <div className="flex items-center gap-4">
                      {exp.logo && (
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-surface p-1.5">
                          <img src={exp.logo} alt={exp.company} className="h-full w-full object-contain" />
                        </span>
                      )}
                      <div className="min-w-0">
                        <h3 className="t-h3">{exp.title}</h3>
                        <div className="t-body text-muted">{exp.company}</div>
                      </div>
                    </div>

                    <p className={`t-body mt-4 text-ink-2 ${long && !isOpen ? 'line-clamp-3' : ''}`}>{exp.description}</p>
                    {long && (
                      <button
                        onClick={() => setExpanded((p) => ({ ...p, [exp.id]: !p[exp.id] }))}
                        className="t-small mt-2 inline-flex cursor-pointer items-center gap-1.5 font-medium text-muted transition-colors hover:text-ink"
                        aria-expanded={isOpen}
                      >
                        {isOpen ? <FiMinus className="h-3 w-3" /> : <FiPlus className="h-3 w-3" />}
                        {isOpen ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>

                  {exp.skills?.length > 0 && (
                    <ul className="col-span-12 flex flex-wrap content-start gap-1.5 md:col-span-9 md:col-start-4 lg:col-span-3 lg:col-start-auto lg:justify-end">
                      {formatTags(exp.skills).map((s) => (
                        <li key={s} className="chip">
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
