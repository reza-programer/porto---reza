'use client';

import React from 'react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FiMail, FiMapPin, FiPhone, FiCheckCircle } from 'react-icons/fi';
import type { Profile } from '@/types';

interface AboutSectionProps {
  profile: Profile;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  return (
    <AnimatedSection id="about" className="py-20 section-cream mesh-blob-2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <SectionHeading
          title="About Me"
          subtitle="Learn more about my technical background, experience, and development principles."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Profile Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E2DFD6] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-5">
                <img
                  src={profile.avatar || '/images/profile.png'}
                  alt={profile.name}
                  className="w-full h-full rounded-2xl object-cover object-top border-2 border-[#DCE4DB] shadow-sm"
                />
                <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#3B4D35] text-white shadow-xs flex items-center gap-1">
                  <FiCheckCircle className="w-2.5 h-2.5 text-emerald-400" />
                  <span>VERIFIED</span>
                </span>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-[#1E241C]">
                  {profile.name}
                </h3>
                <p className="text-xs font-semibold text-[#5C7254] mt-0.5">
                  {profile.title}
                </p>
                <p className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1">
                  <FiMapPin className="w-3 h-3 text-[#5C7254]" /> {profile.location}
                </p>
              </div>
            </div>

            {/* Quick Contact Links */}
            <div className="pt-5 border-t border-[#F0ECE1] space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#EEF3EC] text-[#3B4D35] flex items-center justify-center shrink-0">
                  <FiMail className="w-3.5 h-3.5" />
                </div>
                <a
                  href={`mailto:${profile.email}`}
                  className="hover:text-[#3B4D35] transition-colors truncate"
                >
                  {profile.email}
                </a>
              </div>
              {profile.phone && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#EEF3EC] text-[#3B4D35] flex items-center justify-center shrink-0">
                    <FiPhone className="w-3.5 h-3.5" />
                  </div>
                  <a
                    href="https://wa.me/6281224290502"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#3B4D35] transition-colors"
                  >
                    {profile.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right: Bio & Key Metrics */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E2DFD6] p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF3EC] text-[#3B4D35] text-xs font-mono font-semibold mb-4">
                <span>// ENGINEERING PHILOSOPHY</span>
              </div>

              <h4 className="text-xl sm:text-2xl font-bold text-[#1E241C] mb-4 tracking-tight leading-snug">
                Building scalable web systems with rigorous quality standards.
              </h4>

              <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3 mb-8">
                <p>{profile.bio}</p>
                <p>
                  I specialize in building scalable web applications with modern technologies like React, Next.js, Laravel, Vue.js, and MySQL. With a strong foundation in Quality Assurance, I bridge the gap between design, robust code, and thorough test verification.
                </p>
              </div>
            </div>

            {/* Key Metrics Strip */}
            <div className="pt-6 border-t border-[#F0ECE1] grid grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#3B4D35]">
                  {profile.stats.projectsCompleted}+
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Projects Built
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#3B4D35]">
                  {profile.stats.yearsExperience}+
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Years Exp.
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#3B4D35]">
                  {profile.stats.certificatesEarned}+
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Certifications
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};
