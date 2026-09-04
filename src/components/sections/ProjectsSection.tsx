'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectShowcase } from '@/components/ui/ProjectShowcase';
import { ScreenshotLightbox } from '@/components/ui/ScreenshotLightbox';
import { FiExternalLink, FiGithub, FiArrowRight, FiLayers } from 'react-icons/fi';
import type { Project } from '@/types';

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [lightboxData, setLightboxData] = useState<{
    isOpen: boolean;
    images: string[];
    initialIndex: number;
    title: string;
  }>({
    isOpen: false,
    images: [],
    initialIndex: 0,
    title: '',
  });

  const allTags = ['All', ...Array.from(new Set(projects.flatMap((p) => p.tags)))];

  const filteredProjects = selectedTag === 'All'
    ? projects
    : projects.filter((p) => p.tags.includes(selectedTag));

  const handleOpenLightbox = (images: string[], index: number, title: string) => {
    setLightboxData({
      isOpen: true,
      images,
      initialIndex: index,
      title,
    });
  };

  const getProjectMeta = (project: Project) => {
    const isQA =
      project.title.toLowerCase().includes('uat') ||
      project.title.toLowerCase().includes('testing') ||
      project.title.toLowerCase().includes('test');

    const allImages = [project.image, ...(project.gallery || [])].filter(Boolean);

    let categoryLabel = 'WEB APPLICATION';

    if (isQA) {
      categoryLabel = 'QUALITY ASSURANCE';
    } else if (project.title.toLowerCase().includes('mizuki')) {
      categoryLabel = 'HOTEL RESERVATION';
    } else if (project.title.toLowerCase().includes('simtah')) {
      categoryLabel = 'GIS & GOV PLATFORM';
    } else if (project.tags.some((t) => t.toLowerCase().includes('apriori'))) {
      categoryLabel = 'DATA MINING & E-COMMERCE';
    } else if (project.title.toLowerCase().includes('sparta')) {
      categoryLabel = 'E-COMMERCE SYSTEM';
    } else if (project.title.toLowerCase().includes('office')) {
      categoryLabel = 'ENTERPRISE SYSTEM';
    }

    return {
      categoryLabel,
      allImages,
    };
  };

  const featuredProject = filteredProjects[0];
  const gridProjects = filteredProjects.slice(1);

  return (
    <AnimatedSection id="projects" className="py-20 sm:py-28 section-cream mesh-blob-1">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35 }}
        >
          <SectionHeading
            title="Featured Projects"
            subtitle="Curated collection of web applications, enterprise systems, and quality engineering case studies."
          />
        </motion.div>

        {/* Filter Tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="flex flex-wrap justify-center gap-2 mb-14"
        >
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 cursor-pointer ${
                selectedTag === tag
                  ? 'bg-[#3B4D35] text-white shadow-xs'
                  : 'bg-white text-[#3B4D35] border border-[#D9D6CE] hover:bg-[#F3F5F1]'
              }`}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* 1. FEATURED HERO SHOWCASE (Project 01) */}
        {featuredProject && (
          <motion.div
            key={featuredProject.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4 }}
            className="mb-12 sm:mb-16"
          >
            {(() => {
              const meta = getProjectMeta(featuredProject);
              return (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E2DFD6] p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.07)] transition-all duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Left: Project Details */}
                    <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="text-xs font-mono font-bold text-[#3B4D35] bg-[#EEF3EC] px-2.5 py-0.5 rounded-md border border-[#DCE4DB]">
                          01 / FEATURED
                        </span>
                        <span className="text-xs font-mono font-bold tracking-wider text-[#5C7254] uppercase">
                          {meta.categoryLabel}
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-bold text-[#1E241C] mb-3 tracking-tight">
                        <Link
                          href={`/projects/${featuredProject.id}`}
                          className="hover:text-[#5C7254] transition-colors"
                        >
                          {featuredProject.title}
                        </Link>
                      </h3>

                      <p className="text-slate-600 text-sm leading-relaxed mb-6 whitespace-pre-line">
                        {featuredProject.description}
                      </p>

                      {/* Tech Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-8">
                        {featuredProject.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-xs font-medium bg-[#F5F4EF] text-slate-700 rounded-lg border border-[#E2DFD7]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#F0ECE1]">
                        <Link
                          href={`/projects/${featuredProject.id}`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3B4D35] hover:bg-[#2D3A28] text-white text-xs sm:text-sm font-semibold rounded-full shadow-xs transition-all group"
                        >
                          <span>Explore Case Study</span>
                          <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        {meta.allImages.length > 1 && (
                          <button
                            onClick={() => handleOpenLightbox(meta.allImages, 0, featuredProject.title)}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#F7F5F0] hover:bg-[#EEF3EC] text-slate-700 hover:text-[#3B4D35] text-xs font-semibold rounded-full border border-[#D9D6CE] transition-all cursor-pointer"
                          >
                            <FiLayers className="w-3.5 h-3.5 text-[#5C7254]" />
                            <span>Gallery ({meta.allImages.length})</span>
                          </button>
                        )}

                        {featuredProject.githubUrl && (
                          <a
                            href={featuredProject.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-[#FAF9F5] hover:bg-[#EEF3EC] text-slate-700 rounded-full transition-colors border border-[#D9D6CE]"
                            title="GitHub Repository"
                          >
                            <FiGithub className="w-4 h-4" />
                          </a>
                        )}
                        {featuredProject.liveUrl && (
                          <a
                            href={featuredProject.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-[#FAF9F5] hover:bg-[#EEF3EC] text-slate-700 rounded-full transition-colors border border-[#D9D6CE]"
                            title="Live Demo"
                          >
                            <FiExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Right: Large Pristine Hero Image */}
                    <div className="lg:col-span-7 order-1 lg:order-2">
                      <ProjectShowcase
                        images={meta.allImages}
                        alt={featuredProject.title}
                        projectId={featuredProject.id}
                        aspectRatio="aspect-[16/10]"
                        onOpenLightbox={(idx) => handleOpenLightbox(meta.allImages, idx, featuredProject.title)}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}

        {/* 2. THE REST OF PROJECTS IN A BALANCED 2-COLUMN STUDIO GRID */}
        {gridProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {gridProjects.map((project, index) => {
              const meta = getProjectMeta(project);
              const projectNumber = String(index + 2).padStart(2, '0');

              return (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="flex flex-col bg-white rounded-2xl border border-[#E2DFD6] p-5 sm:p-6 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:border-[#CAD4C5] transition-all duration-250 group"
                >
                  {/* Clean Direct Screenshot Preview */}
                  <div className="w-full mb-5">
                    <ProjectShowcase
                      images={meta.allImages}
                      alt={project.title}
                      projectId={project.id}
                      aspectRatio="aspect-[16/10]"
                      onOpenLightbox={(idx) => handleOpenLightbox(meta.allImages, idx, project.title)}
                    />
                  </div>

                  {/* Metadata & Title */}
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-mono font-bold text-[#3B4D35] bg-[#EEF3EC] px-2 py-0.5 rounded border border-[#DCE4DB]">
                        {projectNumber}
                      </span>
                      <span className="text-[11px] font-mono font-bold tracking-wider text-[#5C7254] uppercase truncate">
                        {meta.categoryLabel}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#1E241C] mb-2 tracking-tight group-hover:text-[#5C7254] transition-colors">
                      <Link href={`/projects/${project.id}`}>
                        {project.title}
                      </Link>
                    </h3>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
                      {project.description.replace(/\n+/g, ' ')}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1 mb-5 mt-auto">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 text-[10px] font-medium bg-[#F5F4EF] text-slate-700 rounded-md border border-[#E2DFD7]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-3.5 border-t border-[#F0ECE1]">
                      <Link
                        href={`/projects/${project.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3B4D35] hover:text-[#2D3A28] transition-colors group/link"
                      >
                        <span>View Project Details</span>
                        <FiArrowRight className="w-3.5 h-3.5 group-link-hover:translate-x-0.5 transition-transform" />
                      </Link>

                      <div className="flex items-center gap-1.5">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-[#FAF9F5] hover:bg-[#EEF3EC] text-slate-700 rounded-md transition-colors border border-[#D9D6CE]"
                            title="GitHub Repository"
                          >
                            <FiGithub className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-[#FAF9F5] hover:bg-[#EEF3EC] text-slate-700 rounded-md transition-colors border border-[#D9D6CE]"
                            title="Live Demo"
                          >
                            <FiExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>

      {/* Clean Fullscreen Gallery Lightbox */}
      <ScreenshotLightbox
        isOpen={lightboxData.isOpen}
        images={lightboxData.images}
        initialIndex={lightboxData.initialIndex}
        title={lightboxData.title}
        onClose={() => setLightboxData((prev) => ({ ...prev, isOpen: false }))}
      />
    </AnimatedSection>
  );
};
