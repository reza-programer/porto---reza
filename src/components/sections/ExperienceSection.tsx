'use client';

import React, { useEffect, useRef } from 'react';
import { MarkerText } from '@/components/ui/MarkerText';
import { Reveal } from '@/components/ui/Reveal';
import type { Experience } from '@/types';

interface ExperienceSectionProps {
  experiences: Experience[];
}

// Organic shapes the company stickers sit on (viewBox -100 -100 200 200).
const BLOBS = [
  'M60,-48C74,-30,78,-6,71,16C64,38,46,56,24,65C2,74,-24,74,-45,62C-66,50,-82,26,-80,1C-78,-24,-58,-48,-35,-64C-12,-80,46,-66,60,-48Z',
  'M52,-62C68,-50,79,-31,80,-11C81,9,72,30,57,46C42,62,21,73,-2,75C-25,77,-50,70,-64,53C-78,36,-81,9,-74,-14C-67,-37,-50,-56,-30,-67C-10,-78,36,-74,52,-62Z',
  'M47,-55C62,-44,76,-30,77,-14C78,2,66,18,56,35C46,52,38,70,23,76C8,82,-14,76,-32,66C-50,56,-64,42,-71,24C-78,6,-78,-16,-68,-33C-58,-50,-38,-62,-18,-67C2,-72,32,-66,47,-55Z',
];
const BLOB_COLORS = ['#0b5cad', '#7ac143', '#ffd23f', '#a9cdf0', '#e2231a'];
const TILTS = [-4, 3, -2, 5, -3];

const SPEED = 45; // px per second while drifting on its own
const RESUME_MS = 2500; // quiet time after a swipe or click before drifting again

/** Width of one copy of the list: from the first card to the first card of the second copy. */
function copyWidth(row: HTMLElement, count: number) {
  const items = row.children;
  if (items.length <= count) return 0;
  return (items[count] as HTMLElement).offsetLeft - (items[0] as HTMLElement).offsetLeft;
}

/*
 * A sideways row of company stickers on colour blobs that drifts along on
 * its own, looping forever. It pauses under the mouse and while someone
 * swipes or uses the arrows, then carries on from wherever they left it.
 */
export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  const rowRef = useRef<HTMLUListElement>(null);
  const hovering = useRef(false);
  const holdUntil = useRef(0);

  // Two copies back to back, so the drift can jump back by one copy's width
  // without anything visibly moving.
  const loop = [...experiences, ...experiences];

  useEffect(() => {
    const row = rowRef.current;
    if (!row || experiences.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let visible = false;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(row);

    let raf = 0;
    let last = performance.now();
    let pos = row.scrollLeft; // fractional; scrollLeft itself may round

    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;

      // Any scroll we didn't make ourselves is the visitor: let them have it.
      if (Math.abs(row.scrollLeft - pos) > 2) holdUntil.current = now + RESUME_MS;

      if (visible && !hovering.current && now > holdUntil.current && !document.hidden) {
        pos += (SPEED * dt) / 1000;
        const p = copyWidth(row, experiences.length);
        if (p > 0 && pos >= p) pos -= p;
        row.scrollLeft = pos;
      } else {
        pos = row.scrollLeft;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [experiences.length]);

  const step = (dir: 1 | -1) => {
    const row = rowRef.current;
    const card = row?.querySelector('li');
    if (!row || !card) return;
    const by = card.clientWidth + 32;
    holdUntil.current = performance.now() + RESUME_MS;
    // Near the start, hop forward one copy first so "previous" can keep going.
    if (dir === -1 && row.scrollLeft < by) row.scrollLeft += copyWidth(row, experiences.length);
    row.scrollBy({ left: dir * by, behavior: 'smooth' });
  };

  return (
    <section id="experience" className="grain relative overflow-hidden border-b-[3px] border-navy bg-chalk py-20 text-navy sm:py-24">
      <div className="wrap flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <h2 className="t-marker relative inline-block">
            Where I&apos;ve
            <br />
            worked
            <span className="absolute left-[105%] top-[0.15em] hidden -rotate-6 whitespace-nowrap font-hand text-[0.4em] normal-case text-flame sm:block">
              every desk taught me something
            </span>
          </h2>
          <p className="mt-6 max-w-md font-mono text-[0.82rem] leading-relaxed text-navy/75">
            My professional journey and career milestones.
          </p>
        </Reveal>

        <Reveal delay={0.05} className="flex items-center gap-4">
          <span className="font-hand text-2xl font-semibold text-flame">‹‹ swipe to see more ››</span>
          <div className="hidden gap-2 sm:flex">
            <button onClick={() => step(-1)} className="btn-stamp btn-stamp-paper h-11 w-11 p-0" aria-label="Previous">
              ←
            </button>
            <button onClick={() => step(1)} className="btn-stamp btn-stamp-ocean h-11 w-11 p-0" aria-label="Next">
              →
            </button>
          </div>
        </Reveal>
      </div>

      <ul
        ref={rowRef}
        className="no-scrollbar mt-12 flex gap-8 overflow-x-auto pb-6 pt-4"
        style={{ paddingInline: 'max(1.25rem, calc((100vw - 1200px) / 2 + 2rem))' }}
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') hovering.current = true;
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse') hovering.current = false;
        }}
      >
        {loop.map((exp, k) => {
          const i = k % experiences.length;
          const isCurrent = /present/i.test(exp.period);
          return (
            <li key={`${exp.id}-${k}`} className="group w-[74vw] max-w-[300px] shrink-0" aria-hidden={k >= experiences.length || undefined}>
              <Reveal delay={Math.min(i, 4) * 0.06}>
                <div className="relative aspect-square">
                  <svg viewBox="-100 -100 200 200" className="absolute inset-0 h-full w-full" aria-hidden>
                    <path
                      d={BLOBS[i % BLOBS.length]}
                      fill={BLOB_COLORS[i % BLOB_COLORS.length]}
                      stroke="#0c2340"
                      strokeWidth="2.5"
                      className="origin-center transition-transform [transform-box:fill-box] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-12"
                    />
                  </svg>
                  <div className="bob absolute inset-0" style={{ animationDelay: `${-i * 0.7}s` }}>
                    <div
                      className="absolute inset-[19%] flex items-center justify-center rounded-full border-[3px] border-navy bg-white shadow-[0_0_0_7px_#fff,0_14px_24px_-10px_rgba(12,35,64,0.45)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      style={{ rotate: `${TILTS[i % TILTS.length]}deg` }}
                    >
                      {exp.logo ? (
                        <img src={exp.logo} alt={exp.company} className="h-[60%] w-[60%] object-contain" draggable={false} />
                      ) : (
                        <span className="font-marker text-6xl">{exp.company.charAt(0)}</span>
                      )}
                    </div>
                  </div>
                  {isCurrent && (
                    <span className="absolute right-[4%] top-[6%] rotate-12 rounded-full border-2 border-navy bg-flame px-3 py-1 font-mono text-[0.65rem] font-bold uppercase text-white">
                      Now
                    </span>
                  )}
                </div>

                <div className="mt-5 px-1">
                  <div className="font-mono text-[0.7rem] font-bold uppercase text-ocean">{exp.period}</div>
                  <h3 className="mt-1.5 font-marker text-[1.45rem] uppercase leading-none">
                    <MarkerText>{exp.title}</MarkerText>
                  </h3>
                  <div className="mt-1 font-hand text-[1.6rem] font-semibold leading-tight text-navy/80">{exp.company}</div>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
