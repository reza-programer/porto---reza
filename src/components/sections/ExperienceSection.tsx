'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FiBriefcase, FiCalendar, FiMapPin, FiChevronDown, FiChevronUp, FiCheckCircle } from 'react-icons/fi';
import type { Experience } from '@/types';

interface ExperienceSectionProps {
  experiences: Experience[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
    },
  },
};

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  // Store expanded item IDs for accordion behavior
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <AnimatedSection id="experience" className="py-20 section-cream mesh-blob-1">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <SectionHeading
          title="Work Experience"
          subtitle="My professional journey and career milestones."
        />

        {/* Timeline Container with Staggered Entrance */}
        <div className="relative border-l-2 border-[#dce4db] ml-4 sm:ml-8 space-y-8">
          {experiences.map((exp, index) => {
            const isExpanded = !!expandedIds[exp.id];

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, y: 25 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.2, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] }}
                className="relative pl-6 sm:pl-9 group"
              >
                {/* Custom Timeline Pin */}
                <div className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-white border-2 border-[#5c7254] flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-125 group-hover:bg-[#3b4d35]">
                  <span className="w-2 h-2 rounded-full bg-[#5c7254] group-hover:bg-white transition-colors" />
                </div>

                {/* Main Card */}
                <div className="bg-white border border-[#dce4db] rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:border-[#b8c9b3]">
                  {/* Top Bar: Role & Period */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#20261e] group-hover:text-[#3b4d35] transition-colors flex items-center gap-2">
                        {exp.title}
                      </h3>
                      <div className="text-sm font-semibold text-[#5c7254] flex items-center gap-1.5 mt-1">
                        <FiBriefcase className="w-4 h-4 shrink-0 text-[#5c7254]" />
                        {exp.company}
                      </div>
                    </div>

                    {/* Period & Location Pills */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 shrink-0">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#edf1eb] text-[#3b4d35] font-semibold rounded-full border border-[#dce4db]/60">
                        <FiCalendar className="w-3.5 h-3.5" />
                        {exp.period}
                      </span>
                      {exp.location && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
                          <FiMapPin className="w-3.5 h-3.5" />
                          {exp.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Skills Tags */}
                  {exp.skills && exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {exp.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-0.5 text-xs font-medium bg-[#edf1eb]/70 text-[#3b4d35] rounded-md border border-[#dce4db]/40 flex items-center gap-1"
                        >
                          <FiCheckCircle className="w-3 h-3 text-[#5c7254]" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Description Section (Expandable for Compact Height) */}
                  <div className="relative">
                    <p
                      className={`text-slate-600 text-sm leading-relaxed transition-all duration-300 ${
                        isExpanded ? '' : 'line-clamp-2'
                      }`}
                    >
                      {exp.description}
                    </p>

                    {/* Toggle Button if description is long */}
                    {exp.description.length > 140 && (
                      <button
                        onClick={() => toggleExpand(exp.id)}
                        className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#3b4d35] hover:text-[#2d3a28] hover:underline focus:outline-none transition-colors"
                        suppressHydrationWarning
                      >
                        {isExpanded ? (
                          <>
                            Tampilkan Lebih Sedikit <FiChevronUp className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            Baca Selengkapnya <FiChevronDown className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
};
