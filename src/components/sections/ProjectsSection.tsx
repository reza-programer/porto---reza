'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { MacbookFrame } from '@/components/ui/MacbookFrame';
import { FiExternalLink, FiGithub, FiArrowRight, FiLayers } from 'react-icons/fi';
import type { Project } from '@/types';

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const allTags = ['All', ...Array.from(new Set(projects.flatMap((p) => p.tags)))];

  const filteredProjects = selectedTag === 'All'
    ? projects
    : projects.filter((p) => p.tags.includes(selectedTag));

  return (
    <AnimatedSection id="projects" className="py-20 section-sage dot-matrix">
      {/* Decorative corner elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-white/40 via-transparent to-transparent rounded-bl-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}
        >
          <SectionHeading
            title="Featured Projects"
            subtitle="Explore some of the recent applications, systems, and fullstack projects I've built."
          />
        </motion.div>

        {/* Filter Tags */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {allTags.map((tag, index) => (
            <motion.button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.3, delay: 0.15 + (index * 0.05) }}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 ${
                selectedTag === tag
                  ? 'bg-[#3b4d35] text-white shadow-md'
                  : 'bg-white/80 text-[#3b4d35] border border-[#dce4db] hover:bg-white'
              }`}
            >
              {tag}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid — 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {filteredProjects.map((project, index) => {
            const allImages = [
              project.image,
              ...(project.gallery || []),
            ].filter(Boolean);

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
              >
                <Card className="flex flex-col h-full overflow-hidden group p-0 border-[#dce4db] bg-white hover:shadow-lg hover:border-[#b8c9b3] transition-all rounded-2xl">
                  {/* MacBook Frame Container */}
                  <div className="p-4 pb-0">
                    <div className="bg-[#edf1eb] rounded-xl p-3 border border-[#dce4db]/60">
                      <MacbookFrame images={allImages} alt={project.title} projectId={project.id} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-xl font-bold text-[#20261e] group-hover:text-[#5c7254] transition-colors">
                        <Link href={`/projects/${project.id}`}>
                          {project.title}
                        </Link>
                      </h3>
                      {allImages.length > 1 && (
                        <span className="text-[10px] font-semibold bg-[#edf1eb] text-[#3b4d35] px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#dce4db] shrink-0">
                          <FiLayers className="w-3 h-3" /> {allImages.length} Screenshots
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                      {project.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-[#edf1eb]/60 text-slate-700 rounded-lg border border-[#dce4db]/40"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                      <div className="flex items-center gap-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
                            title="GitHub Repository"
                          >
                            <FiGithub className="w-4 h-4" />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
                            title="Live Demo"
                          >
                            <FiExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      <Link
                        href={`/projects/${project.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3b4d35] hover:bg-[#2d3a28] text-white text-xs font-bold rounded-full shadow-xs transition-all"
                      >
                        View Details &amp; Gallery <FiArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
};
