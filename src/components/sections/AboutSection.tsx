import React from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Reveal } from '@/components/ui/Reveal';
import type { Experience, Profile } from '@/types';

/*
 * "02 / About me": one sentence in large type, the short bio, and the jobs
 * as a plain list under a hairline. (The numbers live in the hero.)
 */
export const AboutSection: React.FC<{ profile: Profile; experiences: Experience[] }> = ({ profile, experiences }) => {
  return (
    <section id="about" className="border-b border-ink/15 py-20 sm:py-28">
      <div className="wrap grid grid-cols-12 gap-x-6 gap-y-12">
        <SectionTitle
          no="02"
          title={['About', 'me']}
          note={`Based in ${profile.location}.`}
          className="col-span-12 lg:sticky lg:top-28 lg:col-span-3 lg:self-start"
        />

        <div className="col-span-12 lg:col-span-9">
          <Reveal>
            <p className="max-w-[46rem] text-[clamp(1.6rem,2.7vw,2.5rem)] font-medium leading-[1.18] tracking-[-0.025em]">
              I&apos;m a developer who loves turning ideas into clean, useful products,{' '}
              <span className="bg-lime px-1.5 [box-decoration-break:clone]">and a tester</span> who makes sure they hold up.
            </p>
          </Reveal>

          <p className="mt-8 max-w-[40rem] text-[1.02rem] leading-relaxed text-ink/65">{profile.bio}</p>

          <div id="experience" className="mt-16 scroll-mt-28">
            <div className="label flex items-center justify-between border-b border-ink/15 pb-3">
              <span>Experience</span>
              <span className="text-ink/50">{String(experiences.length).padStart(2, '0')}</span>
            </div>
            <ol>
              {experiences.map((exp) => {
                const isCurrent = /present/i.test(exp.period);
                return (
                  <li key={exp.id} className="grid grid-cols-12 items-center gap-x-4 gap-y-2 border-b border-ink/15 py-5">
                    <span className="col-span-12 text-[0.8rem] text-ink/55 sm:col-span-4">{exp.period}</span>
                    <span className="col-span-12 flex items-center gap-3 text-[1.15rem] font-semibold leading-snug sm:col-span-5">
                      {exp.title}
                      {isCurrent && (
                        <span className="rounded-full bg-lime px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em]">
                          Now
                        </span>
                      )}
                    </span>
                    <span className="col-span-12 flex items-center gap-3 text-[0.9rem] text-ink/75 sm:col-span-3 sm:justify-end">
                      <span className="order-2 sm:order-1">{exp.company}</span>
                      <span className="order-1 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-ink/15 bg-white sm:order-2">
                        {exp.logo ? (
                          <img src={exp.logo} alt="" className="h-[70%] w-[70%] object-contain" draggable={false} />
                        ) : (
                          <span className="text-xs font-semibold">{exp.company.charAt(0)}</span>
                        )}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};
