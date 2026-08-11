'use client';

import React from 'react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { SectionHeading } from '@/components/ui/SectionHeading';
import {
  SiLaravel,
  SiVuedotjs,
  SiCodeigniter,
  SiPython,
  SiPostman,
  SiSelenium,
  SiJira,
  SiApachejmeter,
  SiPostgresql,
  SiJavascript,
  SiMysql,
} from 'react-icons/si';

interface TechItem {
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgLight: string;
}

const skillsList: TechItem[] = [
  {
    name: 'Laravel',
    category: 'Backend Framework',
    icon: SiLaravel,
    color: '#FF2D20',
    bgLight: 'rgba(255, 45, 32, 0.08)',
  },
  {
    name: 'Vue.js',
    category: 'Frontend Framework',
    icon: SiVuedotjs,
    color: '#4FC08D',
    bgLight: 'rgba(79, 192, 141, 0.08)',
  },
  {
    name: 'CodeIgniter',
    category: 'PHP Framework',
    icon: SiCodeigniter,
    color: '#EF4223',
    bgLight: 'rgba(239, 66, 35, 0.08)',
  },
  {
    name: 'Python',
    category: 'Programming Language',
    icon: SiPython,
    color: '#3776AB',
    bgLight: 'rgba(55, 118, 171, 0.08)',
  },
  {
    name: 'Postman',
    category: 'API Testing & Dev',
    icon: SiPostman,
    color: '#FF6C37',
    bgLight: 'rgba(255, 108, 55, 0.08)',
  },
  {
    name: 'SQL / MySQL',
    category: 'Database Management',
    icon: SiMysql,
    color: '#4479A1',
    bgLight: 'rgba(68, 121, 161, 0.08)',
  },
  {
    name: 'Selenium',
    category: 'Automated Testing',
    icon: SiSelenium,
    color: '#43B02A',
    bgLight: 'rgba(67, 176, 42, 0.08)',
  },
  {
    name: 'Jira',
    category: 'Agile & Project Mgmt',
    icon: SiJira,
    color: '#0052CC',
    bgLight: 'rgba(0, 82, 204, 0.08)',
  },
  {
    name: 'JMeter',
    category: 'Performance & Load Test',
    icon: SiApachejmeter,
    color: '#D22128',
    bgLight: 'rgba(210, 33, 40, 0.08)',
  },
  {
    name: 'PostgreSQL',
    category: 'Relational Database',
    icon: SiPostgresql,
    color: '#4169E1',
    bgLight: 'rgba(65, 105, 225, 0.08)',
  },
  {
    name: 'JavaScript',
    category: 'Web Programming',
    icon: SiJavascript,
    color: '#F7DF1E',
    bgLight: 'rgba(247, 223, 30, 0.15)',
  },
];

export const SkillsSection: React.FC = () => {
  // Duplicate arrays for infinite seamless loop
  const row1 = [...skillsList, ...skillsList];
  const row2 = [...skillsList.slice().reverse(), ...skillsList.slice().reverse()];

  return (
    <AnimatedSection id="skills" className="py-20 overflow-hidden section-warm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
        <SectionHeading
          title="Skills & Technologies"
          subtitle="Tech stack and tools I use to build, test, and deploy modern applications."
        />
      </div>

      {/* Marquee Container with Gradient Blur Fades on Edges */}
      <div className="relative w-full space-y-6">
        {/* Left Fade Shadow */}
        <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-40 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #f4f1e8, transparent)' }} />
        
        {/* Right Fade Shadow */}
        <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-40 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #f4f1e8, transparent)' }} />

        {/* Row 1: Moving Left */}
        <div className="overflow-hidden py-2">
          <div className="animate-marquee-left flex gap-6">
            {row1.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={`r1-${item.name}-${index}`}
                  className="flex items-center gap-4 bg-white border border-[#dce4db] rounded-2xl px-6 py-4 shadow-xs hover:shadow-md hover:border-[#b8c9b3] transition-all duration-300 shrink-0 group cursor-default"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shrink-0"
                    style={{ backgroundColor: item.bgLight, color: item.color }}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base group-hover:text-[#3b4d35] transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">{item.category}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 2: Moving Right */}
        <div className="overflow-hidden py-2">
          <div className="animate-marquee-right flex gap-6">
            {row2.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={`r2-${item.name}-${index}`}
                  className="flex items-center gap-4 bg-white border border-[#dce4db] rounded-2xl px-6 py-4 shadow-xs hover:shadow-md hover:border-[#b8c9b3] transition-all duration-300 shrink-0 group cursor-default"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shrink-0"
                    style={{ backgroundColor: item.bgLight, color: item.color }}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base group-hover:text-[#3b4d35] transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">{item.category}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};
