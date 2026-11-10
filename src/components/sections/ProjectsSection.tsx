'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { NoBreak } from '@/components/ui/NoBreak';
import { getProjectMeta, type ProjectKind, type ProjectMeta } from '@/lib/project-meta';
import type { Project } from '@/types';

type Filter = 'all' | ProjectKind;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All projects' },
  { key: 'dev', label: 'Development' },
  { key: 'qa', label: 'QA & testing' },
];

interface Item {
  project: Project;
  meta: ProjectMeta;
  no: string;
}

const ease = [0.16, 1, 0.3, 1] as const;

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 18 18 6M9 6h9v9" />
    </svg>
  );
}

/**
 * Screenshot on a dark board, black and white until hovered, with the lime
 * arrow in the corner. The featured one runs the full width.
 */
function Card({ item, featured }: { item: Item; featured: boolean }) {
  const { project, meta, no } = item;
  return (
    <Link href={`/projects/${project.id}`} className="group block">
      <div className={`relative overflow-hidden bg-[#161616] ${featured ? 'px-[6%] pt-[4.5%]' : 'px-[8%] pt-[8%]'}`}>
        <img
          src={meta.images[0]}
          alt={project.title.trim()}
          loading="lazy"
          className={`block w-full object-cover object-top grayscale transition-[filter,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 group-hover:grayscale-0 ${
            featured ? 'aspect-[16/10] md:aspect-[2.2/1]' : 'aspect-[16/10]'
          }`}
        />
        <span className={`arrow-dot absolute ${featured ? 'bottom-5 right-5 h-12! w-12!' : 'bottom-4 right-4'}`}>
          <Arrow />
        </span>
      </div>

      <div className="mt-4 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h3 className={`font-semibold leading-snug ${featured ? 'text-[clamp(1.2rem,1.8vw,1.6rem)]' : 'text-[1.05rem]'}`}>
            <NoBreak text={project.title} />
          </h3>
          <p className="mt-1 text-[0.85rem] text-ink/60">{meta.tags.slice(0, featured ? 4 : 2).join(' · ')}</p>
        </div>
        <span className="numeral shrink-0 text-[1.05rem] text-ink/60">
          {no} / {meta.year}
        </span>
      </div>
    </Link>
  );
}

/*
 * "01 / Selected works" across the top, then the projects at full width:
 * the first one in the current filter as a wide feature, the rest two to a row.
 */
export const ProjectsSection: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Filter>('all');

  const items = useMemo<Item[]>(
    () => projects.map((project, i) => ({ project, meta: getProjectMeta(project), no: String(i + 1).padStart(2, '0') })),
    [projects]
  );
  const visible = filter === 'all' ? items : items.filter((i) => i.meta.kind === filter);

  return (
    <section id="projects" className="border-b border-ink/15 py-20 sm:py-28">
      <div className="wrap">
        <div className="flex flex-col gap-8 border-b border-ink/15 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="numeral text-[clamp(2rem,3vw,2.6rem)] leading-none">01 /</div>
            <h2 className="display wdth-112 mt-2 text-[clamp(2.8rem,6.4vw,6.6rem)]">Selected works</h2>
          </div>
          <div className="flex flex-col gap-5 lg:items-end lg:text-right">
            <p className="text-[0.95rem] text-ink/70">A few projects that I&apos;m proud of.</p>
            <div role="tablist" aria-label="Filter projects" className="flex flex-wrap gap-x-6 gap-y-3">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  role="tab"
                  aria-selected={filter === f.key}
                  onClick={() => setFilter(f.key)}
                  className={`flex cursor-pointer items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.08em] transition-opacity ${
                    filter === f.key ? 'opacity-100' : 'opacity-45 hover:opacity-100'
                  }`}
                >
                  <span aria-hidden className={`h-2 w-2 rounded-full ${filter === f.key ? 'bg-lime ring-1 ring-ink' : 'bg-ink/20'}`} />
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.ul
          key={filter}
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="mt-12 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2"
        >
          {visible.map((item, i) => (
            <li key={item.project.id} className={i === 0 ? 'md:col-span-2' : undefined}>
              <Card item={item} featured={i === 0} />
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};
