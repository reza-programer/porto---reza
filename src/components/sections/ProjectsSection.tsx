'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { FiArrowUpRight, FiGithub, FiImage } from 'react-icons/fi';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';
import { Tilt } from '@/components/ui/Tilt';
import { MacbookFrame } from '@/components/ui/MacbookFrame';
import { ScreenshotLightbox } from '@/components/ui/ScreenshotLightbox';
import { getProjectMeta, slugify, type ProjectKind } from '@/lib/project-meta';
import type { Project } from '@/types';

interface ProjectsSectionProps {
  projects: Project[];
}

type Filter = 'all' | ProjectKind;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'dev', label: 'Development' },
  { key: 'qa', label: 'Quality Assurance' },
];

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [filter, setFilter] = useState<Filter>('all');
  const [lightbox, setLightbox] = useState<{ images: string[]; title: string } | null>(null);

  const items = useMemo(
    () => projects.map((project, i) => ({ project, meta: getProjectMeta(project), no: String(i + 1).padStart(2, '0') })),
    [projects]
  );

  const counts = useMemo(
    () => ({
      all: items.length,
      dev: items.filter((i) => i.meta.kind === 'dev').length,
      qa: items.filter((i) => i.meta.kind === 'qa').length,
    }),
    [items]
  );

  const visible = filter === 'all' ? items : items.filter((i) => i.meta.kind === filter);

  return (
    <section id="projects" className="py-20 sm:py-28">
      <div className="wrap">
        <SectionHeader
          index="01"
          label="Work"
          title="Selected work"
          intro="Curated collection of web applications, enterprise systems, and quality engineering case studies."
          aside={
            <div className="inline-flex rounded-full border border-line bg-surface p-1" role="tablist" aria-label="Filter projects">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  role="tab"
                  aria-selected={filter === f.key}
                  onClick={() => setFilter(f.key)}
                  className={`t-small cursor-pointer rounded-full px-3.5 py-1.5 font-medium transition-colors ${
                    filter === f.key ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
                  }`}
                >
                  {f.label}
                  <span className={`ml-1.5 tabular-nums ${filter === f.key ? 'text-paper/60' : 'text-faint'}`}>
                    {counts[f.key]}
                  </span>
                </button>
              ))}
            </div>
          }
        />

        <div key={filter} className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2">
          {visible.map(({ project, meta, no }, i) => (
            <Reveal key={project.id} delay={(i % 2) * 0.06}>
              <article className="group flex h-full flex-col">
                <Link
                  href={`/projects/${project.id}`}
                  aria-label={`Open ${project.title.trim()}`}
                  className="block rounded-2xl border border-line bg-[linear-gradient(180deg,#f3f3f1_0%,#eaeae7_100%)] px-[7%] pb-[5%] pt-[8%] transition-colors duration-500 group-hover:border-line-strong"
                >
                  <Tilt max={6} glare={false}>
                    <MacbookFrame src={meta.images[0]} alt={project.title} label={`${slugify(project.title)}.app`} />
                  </Tilt>
                </Link>

                <div className="mt-5 flex items-center justify-between gap-4">
                  <div className="eyebrow flex min-w-0 items-center gap-2">
                    <span className="text-ink">{no}</span>
                    <span className="truncate">{meta.category}</span>
                    <span className="text-line-strong">·</span>
                    <span>{meta.year}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {meta.images.length > 1 && (
                      <button
                        onClick={() => setLightbox({ images: meta.images, title: project.title.trim() })}
                        className="chip cursor-pointer transition-colors hover:border-ink hover:text-ink"
                        title="Open screenshot gallery"
                      >
                        <FiImage className="h-3 w-3" /> {meta.images.length}
                      </button>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="chip transition-colors hover:border-ink hover:text-ink"
                        title="Source code"
                        aria-label="Source code"
                      >
                        <FiGithub className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="t-h3 mt-2.5">
                  <Link href={`/projects/${project.id}`} className="inline-flex items-center gap-1.5 hover:text-accent">
                    {project.title.trim()}
                    <FiArrowUpRight className="h-4 w-4 text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                  </Link>
                </h3>

                <p className="t-body mt-2 line-clamp-2 text-muted">{project.description.replace(/\s+/g, ' ').trim()}</p>

                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {meta.tags.map((tag) => (
                    <li key={tag} className="chip">
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <ScreenshotLightbox
        isOpen={!!lightbox}
        images={lightbox?.images ?? []}
        initialIndex={0}
        title={lightbox?.title}
        onClose={() => setLightbox(null)}
      />
    </section>
  );
};
