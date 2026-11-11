'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import { SectionTitle } from '@/components/ui/SectionTitle';
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

/** A small barcode drawn from the project's id and title, so each card's is its own. */
function Barcode({ seed }: { seed: string }) {
  const bars = seed.replace(/\s+/g, '').repeat(4).slice(0, 26).split('');
  return (
    <span aria-hidden className="flex h-6 items-stretch gap-[2px]">
      {bars.map((ch, i) => (
        <span key={i} className="bg-ink" style={{ width: `${(ch.charCodeAt(0) % 3) + 1}px`, opacity: i % 5 === 4 ? 0.35 : 1 }} />
      ))}
    </span>
  );
}

/*
 * One project as an ID card: a header strip with the lanyard slot and the
 * number, the whole screenshot (never cropped) on a board, the details in
 * rows, and a barcode with the way in at the bottom.
 */
function IdCard({ item, total }: { item: Item; total: number }) {
  const { project, meta, no } = item;
  const rows = [
    { label: 'Category', value: meta.category },
    { label: 'Stack', value: meta.tags.slice(0, 3).join(' · ') },
    { label: 'Year', value: meta.year },
  ];

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/15 bg-[#f7f6f2] transition-[border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-ink/40 hover:shadow-[0_24px_50px_-28px_rgba(0,0,0,0.35)]"
    >
      {/* Header strip */}
      <div className="relative flex items-center justify-between border-b border-ink/15 px-5 py-3.5">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em]">
          Project <span className="text-ink/45">ID</span>
        </span>
        <span aria-hidden className="absolute left-1/2 top-1/2 h-2.5 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/20 bg-sheet" />
        <span className="numeral text-[0.95rem]">
          {no} / {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* Screenshot, whole */}
      <div className="mx-5 mt-5 flex aspect-[16/10] items-center justify-center overflow-hidden rounded-lg bg-sheet-2 p-3">
        <img
          src={meta.images[0]}
          alt={project.title.trim()}
          loading="lazy"
          className="max-h-full max-w-full rounded-[3px] object-contain shadow-[0_10px_24px_-12px_rgba(0,0,0,0.35)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
        />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col px-5 pt-5">
        <h3 className="text-[1.2rem] font-semibold leading-snug">
          <NoBreak text={project.title} />
        </h3>
        <dl className="mt-4 border-t border-ink/10">
          {rows.map((r) => (
            <div key={r.label} className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-ink/10 py-2.5 text-[0.85rem]">
              <dt className="label pt-[0.1rem] text-[0.66rem] text-ink/45">{r.label}</dt>
              <dd className="min-w-0 font-medium">
                <NoBreak text={r.value} />
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between px-5 pb-5 pt-5">
        <Barcode seed={`${project.id}${project.title}`} />
        <span className="flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.1em]">
          View case
          <span className="arrow-dot h-9! w-9!">
            <FiArrowUpRight className="h-4 w-4" />
          </span>
        </span>
      </div>
    </Link>
  );
}

/*
 * "01 / Selected works", laid out like the certificates: the title block
 * holds still on the left, the project ID cards sit two to a row on the right.
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
      <div className="wrap grid grid-cols-12 gap-x-6 gap-y-12">
        <SectionTitle
          no="01"
          title={['Selected', 'works']}
          note="A few projects that I'm proud of."
          className="col-span-12 lg:sticky lg:top-28 lg:col-span-3 lg:self-start"
        >
          <div role="tablist" aria-label="Filter projects" className="mt-8 flex flex-wrap gap-x-6 gap-y-3 lg:flex-col">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                role="tab"
                aria-selected={filter === f.key}
                onClick={() => setFilter(f.key)}
                className={`flex cursor-pointer items-center gap-2 text-left text-[0.75rem] font-semibold uppercase tracking-[0.08em] transition-opacity ${
                  filter === f.key ? 'opacity-100' : 'opacity-45 hover:opacity-100'
                }`}
              >
                <span aria-hidden className={`h-2 w-2 rounded-full ${filter === f.key ? 'bg-lime ring-1 ring-ink' : 'bg-ink/20'}`} />
                {f.label}
              </button>
            ))}
          </div>
        </SectionTitle>

        <motion.ul
          key={filter}
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="col-span-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-9"
        >
          {visible.map((item) => (
            <li key={item.project.id}>
              <IdCard item={item} total={items.length} />
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};
