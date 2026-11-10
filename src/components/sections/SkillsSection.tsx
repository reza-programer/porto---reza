import React from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { techIcon } from '@/lib/tech-icons';
import type { Profile } from '@/types';

// Everything else in the kit that isn't in a category.
const ALSO = ['React', 'Next.js', 'TypeScript', 'React Native', 'Tailwind CSS', 'Docker', 'Git'];

/** "Postman (API Testing)" → "Postman" */
const plainName = (name: string) => name.replace(/\s*\(.*\)\s*$/, '');

/*
 * "03 / Tech stack": one column per category, each tool a line with its
 * icon. No levels or bars.
 */
export const SkillsSection: React.FC<{ profile: Profile }> = ({ profile }) => {
  return (
    <section id="skills" className="border-b border-ink/15 py-20 sm:py-28">
      <div className="wrap grid grid-cols-12 gap-x-6 gap-y-12">
        <SectionTitle
          no="03"
          title={['Tech', 'stack']}
          note="What I build and test with."
          className="col-span-12 lg:sticky lg:top-28 lg:col-span-3 lg:self-start"
        />

        <div className="col-span-12 lg:col-span-9">
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-3">
            {profile.skills.map((cat) => (
              <div key={cat.category}>
                <h3 className="label border-b border-ink pb-3">{cat.category.replace(/ Management| & Frameworks| Tools/g, '')}</h3>
                <ul>
                  {cat.skills.map((s) => {
                    const Icon = techIcon(s.name);
                    return (
                      <li key={s.name} className="group flex items-center gap-3 border-b border-ink/15 py-3.5">
                        <Icon className="h-5 w-5 shrink-0 opacity-80" aria-hidden />
                        <span className="text-[1rem] font-medium transition-transform duration-300 group-hover:translate-x-1">
                          {plainName(s.name)}
                        </span>
                        <span aria-hidden className="ml-auto h-2 w-2 rounded-full bg-lime opacity-0 transition-opacity group-hover:opacity-100" />
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-12 flex flex-wrap gap-x-5 gap-y-2 text-[0.85rem] text-ink/60">
            <span className="font-semibold text-ink">Also</span>
            {ALSO.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
};
