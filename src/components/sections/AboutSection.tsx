'use client';

import React from 'react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { FiMail, FiMapPin, FiPhone, FiCheckCircle } from 'react-icons/fi';
import type { Profile } from '@/types';

interface AboutSectionProps {
  profile: Profile;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  return (
    <AnimatedSection id="about" className="py-20 section-warm mesh-blob-2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <SectionHeading
          title="About Me"
          subtitle="Learn more about my technical background, experience, and development principles."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Key Stats Cards */}
          <div className="space-y-4">
            <Card className="flex items-center gap-4 border-l-4 border-l-[#5c7254] shadow-xs hover:shadow-md transition-shadow bg-white">
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{profile.stats.projectsCompleted}+</div>
                <div className="text-xs text-slate-500 font-medium">Projects Completed</div>
              </div>
            </Card>

            <Card className="flex items-center gap-4 border-l-4 border-l-[#3b4d35] shadow-xs hover:shadow-md transition-shadow bg-white">
              <div>
                <div className="text-2xl font-bold text-slate-900">{profile.stats.yearsExperience}+</div>
                <div className="text-xs text-slate-500 font-medium">Years Experience</div>
              </div>
            </Card>

            <Card className="flex items-center gap-4 border-l-4 border-l-[#8fa382] shadow-xs hover:shadow-md transition-shadow bg-white">
              <div>
                <div className="text-2xl font-bold text-slate-900">{profile.stats.certificatesEarned}+</div>
                <div className="text-xs text-slate-500 font-medium">Certifications Earned</div>
              </div>
            </Card>
          </div>

          {/* Main About Description & Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xs border-slate-200/60 p-8 bg-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6 pb-6 border-b border-slate-100">
                <img
                  src={profile.avatar || '/images/profile.png'}
                  alt={profile.name}
                  className="w-16 h-16 rounded-2xl object-cover object-top border-2 border-indigo-500 shadow-md shrink-0"
                />
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    Junior Fullstack Developer &amp; Manual QA <FiCheckCircle className="w-4 h-4 text-indigo-500" />
                  </h3>
                  <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                    {profile.name} • {profile.location}
                  </p>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed mb-4 text-sm sm:text-base">
                {profile.bio}
              </p>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                I specialize in building scalable web applications with modern technologies like React, Next.js, Laravel, Python, and PostgreSQL. As a QA, I ensure every product is thoroughly tested for reliability and quality.
              </p>

              <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <FiMail className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="truncate">{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <FiPhone className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <FiMapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>{profile.location}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};
