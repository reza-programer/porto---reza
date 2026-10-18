'use client';

import React from 'react';
import {
  SiApachejmeter,
  SiCodeigniter,
  SiDocker,
  SiGit,
  SiGithub,
  SiGooglecolab,
  SiJavascript,
  SiJira,
  SiLaravel,
  SiMysql,
  SiNextdotjs,
  SiPostgresql,
  SiPostman,
  SiPython,
  SiReact,
  SiSelenium,
  SiTailwindcss,
  SiVuedotjs,
} from 'react-icons/si';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';
import { SkillSphere, type SphereItem } from '@/components/ui/SkillSphere';
import type { Profile } from '@/types';

const sphereItems: SphereItem[] = [
  { name: 'Laravel', icon: SiLaravel },
  { name: 'Vue.js', icon: SiVuedotjs },
  { name: 'React', icon: SiReact },
  { name: 'Next.js', icon: SiNextdotjs },
  { name: 'JavaScript', icon: SiJavascript },
  { name: 'Python', icon: SiPython },
  { name: 'CodeIgniter', icon: SiCodeigniter },
  { name: 'Tailwind CSS', icon: SiTailwindcss },
  { name: 'MySQL', icon: SiMysql },
  { name: 'PostgreSQL', icon: SiPostgresql },
  { name: 'Docker', icon: SiDocker },
  { name: 'Git', icon: SiGit },
  { name: 'GitHub', icon: SiGithub },
  { name: 'Postman', icon: SiPostman },
  { name: 'Selenium', icon: SiSelenium },
  { name: 'JMeter', icon: SiApachejmeter },
  { name: 'Jira', icon: SiJira },
  { name: 'Google Colab', icon: SiGooglecolab },
];

interface SkillsSectionProps {
  profile: Profile;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ profile }) => {
  return (
    <section id="skills" className="overflow-hidden py-20 sm:py-28">
      <div className="wrap">
        <SectionHeader
          index="03"
          label="Skills"
          title="Skills & technologies"
          intro="Tech stack and tools I use to build, test, and deploy modern applications."
        />

        <div className="grid grid-cols-12 items-center gap-x-8 gap-y-14">
          <div className="col-span-12 lg:col-span-5">
            {profile.skills.map((cat, ci) => (
              <Reveal key={cat.category} delay={ci * 0.06}>
                <div className="border-t border-line py-6">
                  <h3 className="eyebrow mb-4">{cat.category}</h3>
                  <ul className="flex flex-wrap gap-2">
                    {cat.skills.map((s) => (
                      <li key={s.name} className="chip px-3 py-1.5 text-[0.8125rem] text-ink">
                        {s.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="col-span-12 lg:col-span-7" delay={0.1}>
            <SkillSphere items={sphereItems} />
            <p className="eyebrow mt-2 text-center">Move your cursor to spin</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
