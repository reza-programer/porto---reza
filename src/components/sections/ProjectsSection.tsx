'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FiGithub, FiImage } from 'react-icons/fi';
import { ScreenshotLightbox } from '@/components/ui/ScreenshotLightbox';
import { getProjectMeta, type ProjectKind, type ProjectMeta } from '@/lib/project-meta';
import { techIcon } from '@/lib/tech-icons';
import type { Project } from '@/types';

/** Fired by the hero desk to open the list on a given tab. */
export const WORK_FILTER_EVENT = 'work:filter';

interface ProjectsSectionProps {
  projects: Project[];
}

type Filter = 'all' | ProjectKind;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'dev', label: 'Development' },
  { key: 'qa', label: 'QA' },
];

interface Item {
  project: Project;
  meta: ProjectMeta;
  no: string;
}

const ease = [0.16, 1, 0.3, 1] as const;

/** The project's cover, taped down like a photo print. */
function Print({ item, className = '' }: { item: Item; className?: string }) {
  return (
    <figure className={`relative border-[3px] border-navy bg-white p-[3%] pb-0 shadow-[7px_7px_0_#0c2340] ${className}`}>
      <span aria-hidden className="absolute -top-3 left-[12%] h-6 w-[22%] -rotate-6 border border-navy/15 bg-[#fff1a6]/85" />
      <span aria-hidden className="absolute -top-3 right-[10%] h-6 w-[18%] rotate-[5deg] border border-navy/15 bg-[#fff1a6]/85" />
      {/* Natural aspect: covers range from 16:10 to nearly 3:1, so cropping to one ratio cut them off. */}
      <div className="overflow-hidden border-2 border-navy bg-chalk">
        <img src={item.meta.images[0]} alt={item.project.title.trim()} className="block h-auto w-full" />
      </div>
      <figcaption className="flex items-baseline justify-between gap-4 px-1 py-2.5">
        <span className="min-w-0 truncate font-hand text-[1.65rem] font-bold leading-none">{item.project.title.trim()}</span>
        <span className="shrink-0 font-mono text-[0.7rem] font-bold">{item.meta.year}</span>
      </figcaption>
    </figure>
  );
}

/** What the project is made of: its stack as a grid of ingredients, plus the way in. */
function Recipe({ item, onGallery }: { item: Item; onGallery: () => void }) {
  const { project, meta } = item;
  return (
    <div className="border-[3px] border-navy bg-chalk p-5 shadow-[6px_6px_0_#0c2340] sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="font-marker text-2xl uppercase">Composition</h3>
        <span className="font-hand text-xl font-semibold text-flame">what it&apos;s made of</span>
      </div>

      <ul className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
        {meta.tags.map((tag) => {
          const Icon = techIcon(tag);
          return (
            <li
              key={tag}
              className="flex flex-col items-center justify-center gap-2 border-2 border-navy bg-white px-1.5 py-3 text-center"
            >
              <Icon className="h-6 w-6" aria-hidden />
              <span className="font-mono text-[0.62rem] font-bold uppercase leading-tight">{tag}</span>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 line-clamp-4 text-[0.92rem] leading-relaxed text-navy/85">
        {project.description.replace(/\s+/g, ' ').trim()}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link href={`/projects/${project.id}`} className="btn-stamp btn-stamp-ocean">
          Open case study <span aria-hidden>↗</span>
        </Link>
        {meta.images.length > 1 && (
          <button onClick={onGallery} className="btn-stamp btn-stamp-paper">
            <FiImage className="h-3.5 w-3.5" /> {meta.images.length} screens
          </button>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-stamp btn-stamp-paper"
            aria-label="Source code"
            title="Source code"
          >
            <FiGithub className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

/*
 * Laid out like a café menu: a taped print of the chosen project on the left,
 * and on the right tabs, the list to pick from, and the chosen project's
 * "composition" (its tech stack). On small screens the print and composition
 * open under the chosen row instead.
 */
export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ images: string[]; title: string } | null>(null);

  const items = useMemo<Item[]>(
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
  const selected = visible.find((i) => i.project.id === selectedId) ?? visible[0];

  useEffect(() => {
    const onFilter = (e: Event) => {
      setFilter((e as CustomEvent<Filter>).detail);
      setSelectedId(null);
    };
    window.addEventListener(WORK_FILTER_EVENT, onFilter);
    return () => window.removeEventListener(WORK_FILTER_EVENT, onFilter);
  }, []);

  const openGallery = (item: Item) => setLightbox({ images: item.meta.images, title: item.project.title.trim() });

  return (
    <section id="projects" className="relative border-y-[3px] border-navy bg-mist text-navy">
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {/* Showcase */}
        <div className="grain relative hidden border-r-[3px] border-navy bg-chalk lg:block">
          <div className="sticky top-16 flex h-[calc(100svh-4rem)] max-h-[900px] flex-col px-10 py-10 xl:px-14 xl:py-12">
            <h2 className="relative font-marker text-[clamp(2.6rem,4.2vw,4.4rem)] uppercase leading-[0.95]">
              Selected
              <br />
              work
              <span className="absolute left-[7.6em] top-[3.1em] -rotate-6 whitespace-nowrap font-hand text-[0.42em] normal-case text-flame">
                fresh from my desk
              </span>
            </h2>

            <div className="relative mt-6 flex min-h-0 flex-1 items-center justify-center">
              <AnimatePresence mode="popLayout" initial={false}>
                {selected && (
                  <motion.div
                    key={selected.project.id}
                    className="w-full max-w-[min(620px,calc((100svh-22rem)*1.6))]"
                    initial={{ opacity: 0, rotate: reduce ? -2 : -8, y: reduce ? 0 : 40, scale: 0.95 }}
                    animate={{ opacity: 1, rotate: -2, y: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: reduce ? -2 : 4, y: reduce ? 0 : -30, scale: 0.97 }}
                    transition={{ duration: 0.55, ease }}
                  >
                    <Link href={`/projects/${selected.project.id}`} aria-label={`Open ${selected.project.title.trim()}`}>
                      <Print item={selected} />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {selected && (
              <div className="mt-6 flex items-end justify-between gap-6 font-mono text-[0.72rem] font-bold uppercase">
                <span>
                  {selected.no} / {String(items.length).padStart(2, '0')}
                </span>
                <span className="truncate">{selected.meta.category}</span>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <div className="min-w-0 px-5 py-16 sm:px-8 lg:px-10 xl:px-14 xl:py-20">
          <h2 className="font-marker text-[clamp(2.4rem,10vw,3.5rem)] uppercase leading-[0.95] lg:hidden">Selected work</h2>
          <p className="mt-3 max-w-md font-mono text-[0.8rem] leading-relaxed lg:mt-0">
            Pick a project to see what it&apos;s made of: web apps, enterprise systems and QA case studies.
          </p>

          <div role="tablist" aria-label="Filter projects" className="mt-7 flex border-[3px] border-navy bg-white">
            {FILTERS.map((f, i) => (
              <button
                key={f.key}
                role="tab"
                aria-selected={filter === f.key}
                onClick={() => {
                  setFilter(f.key);
                  setSelectedId(null);
                }}
                className={`flex-1 cursor-pointer px-3 py-2.5 font-mono text-[0.72rem] font-bold uppercase transition-colors ${
                  i > 0 ? 'border-l-[3px] border-navy' : ''
                } ${filter === f.key ? 'bg-ocean text-white' : 'hover:bg-chalk'}`}
              >
                {f.label} <span className="opacity-60">{counts[f.key]}</span>
              </button>
            ))}
          </div>

          <ul className="mt-6 border-t-2 border-navy">
            {visible.map((item) => {
              const on = item === selected;
              const Icon = techIcon(item.meta.tags[0] ?? '');
              return (
                <li key={item.project.id} className="border-b-2 border-navy">
                  <button
                    onClick={() => setSelectedId(item.project.id)}
                    aria-pressed={on}
                    className={`group flex w-full cursor-pointer items-center gap-4 px-2 py-3.5 text-left transition-colors ${
                      on ? 'bg-chalk' : 'hover:bg-[#c5dbf1]'
                    }`}
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-navy transition-colors ${
                        on ? 'bg-ocean text-white' : 'bg-white'
                      }`}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-mono text-[0.85rem] font-bold uppercase">{item.project.title.trim()}</span>
                      <span className="block truncate font-mono text-[0.7rem] opacity-70">{item.meta.category}</span>
                    </span>
                    <span className="font-mono text-[0.7rem] font-bold">{item.meta.year}</span>
                    <span
                      aria-hidden
                      className={`font-marker text-lg text-flame transition-[opacity,translate] duration-300 ${
                        on ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0 group-hover:opacity-50'
                      }`}
                    >
                      →
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        className="overflow-hidden lg:hidden"
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: reduce ? 0 : 0.45, ease }}
                      >
                        <div className="space-y-7 px-1 pb-8 pt-5">
                          <Link href={`/projects/${item.project.id}`} aria-label={`Open ${item.project.title.trim()}`} className="block">
                            <Print item={item} className="-rotate-1" />
                          </Link>
                          <Recipe item={item} onGallery={() => openGallery(item)} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          {selected && (
            <div className="mt-10 hidden lg:block">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selected.project.id}
                  initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -8 }}
                  transition={{ duration: 0.3, ease }}
                >
                  <Recipe item={selected} onGallery={() => openGallery(selected)} />
                </motion.div>
              </AnimatePresence>
            </div>
          )}
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
