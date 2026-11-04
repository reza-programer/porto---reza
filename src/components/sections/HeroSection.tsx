'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DeskScene, SCENE, type DeskLayout } from '@/components/hero/DeskScene';
import { WORK_FILTER_EVENT } from '@/components/sections/ProjectsSection';
import { MarkerText } from '@/components/ui/MarkerText';
import { sketchArrow, sketchRect } from '@/lib/sketch';
import type { Profile, Project } from '@/types';

interface HeroSectionProps {
  profile: Profile;
  projects: Project[];
}

type Point = [number, number];
type HotspotId = 'projects' | 'mobile' | 'contact' | 'experience' | 'certificates' | 'qa';

/** Where a hotspot sits in one layout, in that layout's scene units. */
interface Spot {
  /** Hit area and outline: x, y, width, height. */
  box: [number, number, number, number];
  /** Where the handwritten label starts (or ends, with `alignEnd`). */
  label: Point;
  alignEnd?: boolean;
  arrow: [Point, Point, Point];
  /** Where the photo sticker moves to while this spot is active. */
  avatar: Point;
  /** Label colour: navy on the wall, white on the blue desk front. */
  onDesk?: boolean;
}

interface Hotspot {
  id: HotspotId;
  title: string;
  note: string;
  // Positions for the wide desk (also used, cropped, on tablets) and the phone desk.
  at: Record<'wide' | 'tall', Spot>;
}

/*
 * Things on the desk you can point at. Hovering (or tapping) one draws a
 * marker outline around it, writes a note beside it and moves Reza's photo
 * sticker next to it; clicking goes to the matching section.
 */
const HOTSPOTS: Hotspot[] = [
  {
    id: 'projects',
    title: 'Projects',
    note: 'web apps & dashboards',
    at: {
      wide: { box: [626, 360, 438, 262], label: [700, 282], arrow: [[756, 336], [744, 350], [760, 362]], avatar: [1042, 352] },
      tall: { box: [178, 608, 438, 264], label: [20, 470], arrow: [[250, 548], [240, 580], [256, 612]], avatar: [110, 615] },
    },
  },
  {
    id: 'mobile',
    title: 'Mobile app',
    note: 'built with react native',
    at: {
      wide: { box: [1052, 412, 108, 210], label: [1176, 236], arrow: [[1196, 290], [1192, 362], [1160, 412]], avatar: [1106, 352] },
      tall: {
        box: [628, 660, 110, 212],
        label: [740, 900],
        alignEnd: true,
        arrow: [[690, 900], [698, 886], [690, 874]],
        avatar: [690, 618],
        onDesk: true,
      },
    },
  },
  {
    id: 'contact',
    title: 'Coffee?',
    note: "let's talk, it's on me",
    at: {
      wide: { box: [1164, 456, 146, 166], label: [1112, 376], arrow: [[1186, 432], [1178, 444], [1192, 456]], avatar: [1330, 478] },
      tall: { box: [376, 400, 146, 166], label: [368, 420], alignEnd: true, arrow: [[350, 498], [366, 520], [382, 510]], avatar: [530, 380] },
    },
  },
  {
    id: 'experience',
    title: 'Experience',
    note: "where I've worked",
    at: {
      wide: { box: [868, 80, 306, 230], label: [950, 322], arrow: [[1004, 324], [998, 316], [1010, 310]], avatar: [1216, 252] },
      tall: { box: [238, 80, 306, 230], label: [252, 318], arrow: [[290, 322], [284, 314], [292, 306]], avatar: [640, 250] },
    },
  },
  {
    id: 'certificates',
    title: 'Certificates',
    note: 'always learning',
    at: {
      wide: { box: [640, 80, 180, 174], label: [648, 282], arrow: [[702, 284], [694, 270], [712, 254]], avatar: [596, 168] },
      tall: { box: [38, 88, 180, 174], label: [44, 284], arrow: [[98, 286], [90, 274], [104, 262]], avatar: [130, 430] },
    },
  },
  {
    id: 'qa',
    title: 'QA & Testing',
    note: 'I break things on purpose',
    at: {
      wide: { box: [475, 444, 172, 178], label: [489, 652], arrow: [[525, 652], [515, 638], [527, 622]], avatar: [653, 470], onDesk: true },
      tall: { box: [8, 686, 176, 184], label: [20, 900], arrow: [[56, 900], [48, 888], [60, 874]], avatar: [256, 664], onDesk: true },
    },
  },
];

// Sizes that depend on how much a layout is scaled down: label type, the
// sticker and its border are in cqw of the scene; the outline in scene units.
const LOOK: Record<DeskLayout, { title: string; note: string; lift: string; sticker: string; border: string; stroke: number }> = {
  wide: {
    title: 'text-[1.55cqw]',
    note: 'text-[1.75cqw]',
    lift: 'translate-y-[0.6cqw]',
    sticker: '-ml-[3.7cqw] -mt-[3.7cqw] w-[7.4cqw]',
    border: 'border-[0.45cqw]',
    stroke: 4,
  },
  // The wide sizes scaled up by 1440/1020, since this crop shows less of the scene.
  mid: {
    title: 'text-[2.19cqw]',
    note: 'text-[2.47cqw]',
    lift: 'translate-y-[0.85cqw]',
    sticker: '-ml-[5.22cqw] -mt-[5.22cqw] w-[10.45cqw]',
    border: 'border-[0.64cqw]',
    stroke: 4,
  },
  tall: {
    title: 'text-[4cqw]',
    note: 'text-[4.6cqw]',
    lift: 'translate-y-[1.2cqw]',
    sticker: '-ml-[7cqw] -mt-[7cqw] w-[14cqw]',
    border: 'border-[0.9cqw]',
    stroke: 6,
  },
};

const CYCLE_MS = 2600;
const IDLE_AFTER_TOUCH_MS = 4000;

const ease = [0.16, 1, 0.3, 1] as const;

type Stats = React.ComponentProps<typeof DeskScene>['stats'];

function RiseLine({ children, delay, className = '' }: { children: React.ReactNode; delay: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: reduce ? 0 : '105%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

interface DeskProps {
  layout: DeskLayout;
  className: string;
  stats: Stats;
  avatar: string;
  hrefs: Record<HotspotId, string>;
  active: HotspotId | null;
  onSelect: (id: HotspotId) => void;
  onHover: (inside: boolean) => void;
}

/** The desk scene in one layout, with its outlines, notes, sticker and hit areas. */
function Desk({ layout, className, stats, avatar, hrefs, active, onSelect, onHover }: DeskProps) {
  const reduce = useReducedMotion();
  const pointerType = useRef('mouse');
  const { x: ox, w, h } = SCENE[layout];
  const look = LOOK[layout];
  // Scene units to percentages of the box: positions start from the crop's left edge, sizes don't.
  const pctX = (x: number) => `${((x - ox) / w) * 100}%`;
  const pctW = (size: number) => `${(size / w) * 100}%`;
  const pctY = (y: number) => `${(y / h) * 100}%`;
  const spotOf = (hs: Hotspot) => hs.at[layout === 'tall' ? 'tall' : 'wide'];
  const hot = HOTSPOTS.find((s) => s.id === active);
  const current = hot && spotOf(hot);

  return (
    <div
      className={`@container relative ${className}`}
      style={{ aspectRatio: `${w} / ${h}` }}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') onHover(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') onHover(false);
      }}
    >
      <DeskScene stats={stats} layout={layout} />

      {/* Marker outlines and arrows */}
      <svg viewBox={`${ox} 0 ${w} ${h}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        {HOTSPOTS.map((hs, n) => {
          const spot = spotOf(hs);
          const strokes = [...sketchRect(...spot.box, n + 3), ...sketchArrow(...spot.arrow)];
          const on = hs.id === active;
          return (
            <g key={hs.id} className={on ? 'is-active' : undefined}>
              {strokes.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  pathLength={1}
                  className="sketch-line"
                  fill="none"
                  stroke={spot.onDesk ? '#ffffff' : '#e2231a'}
                  strokeWidth={look.stroke}
                  strokeLinecap="round"
                  style={{ transitionDelay: on ? `${i * 70}ms` : '0ms' }}
                />
              ))}
            </g>
          );
        })}
      </svg>

      {/* Handwritten notes */}
      {HOTSPOTS.map((hs) => {
        const spot = spotOf(hs);
        const on = hs.id === active;
        return (
          <div
            key={hs.id}
            aria-hidden
            className={`pointer-events-none absolute whitespace-nowrap transition-[opacity,translate] duration-300 ${
              on ? 'translate-y-0 opacity-100 delay-200' : `${look.lift} opacity-0`
            } ${spot.onDesk ? 'text-white' : 'text-navy'} ${spot.alignEnd ? 'text-right' : ''}`}
            style={
              spot.alignEnd
                ? { right: pctW(ox + w - spot.label[0]), top: pctY(spot.label[1]) }
                : { left: pctX(spot.label[0]), top: pctY(spot.label[1]) }
            }
          >
            <div className={`font-marker uppercase leading-none ${look.title}`}>
              <MarkerText>{hs.title}</MarkerText>
            </div>
            <div className={`font-hand font-semibold leading-tight ${look.note} ${spot.onDesk ? '' : 'text-flame'}`}>{hs.note}</div>
          </div>
        );
      })}

      {/* Photo sticker that follows the active spot */}
      <motion.div
        aria-hidden
        className={`pointer-events-none absolute z-20 ${look.sticker}`}
        initial={false}
        animate={
          current
            ? { left: pctX(current.avatar[0]), top: pctY(current.avatar[1]), opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.6 }
        }
        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 140, damping: 17 }}
      >
        <div className="bob">
          <div
            className={`aspect-square overflow-hidden rounded-full border-white bg-ice shadow-[0_0.5cqw_1.2cqw_rgba(12,35,64,0.35)] ${look.border}`}
          >
            <img src={avatar} alt="" draggable={false} className="h-full w-full object-cover object-[50%_18%]" />
          </div>
        </div>
      </motion.div>

      {/* Hit areas */}
      {HOTSPOTS.map((hs) => {
        const spot = spotOf(hs);
        return (
          <a
            key={hs.id}
            href={hrefs[hs.id]}
            aria-label={`${hs.title} — ${hs.note}`}
            className="absolute z-10 rounded-[1cqw] outline-offset-2"
            style={{ left: pctX(spot.box[0]), top: pctY(spot.box[1]), width: pctW(spot.box[2]), height: pctY(spot.box[3]) }}
            onPointerDown={(e) => {
              pointerType.current = e.pointerType;
            }}
            onPointerEnter={(e) => {
              if (e.pointerType === 'mouse') onSelect(hs.id);
            }}
            onFocus={(e) => {
              if (e.currentTarget.matches(':focus-visible')) onSelect(hs.id);
            }}
            onClick={(e) => {
              // On touch the first tap only points at the object; the second one opens it.
              if (pointerType.current !== 'mouse' && active !== hs.id) {
                e.preventDefault();
                onSelect(hs.id);
                return;
              }
              if (hs.id === 'qa' || hs.id === 'projects') {
                window.dispatchEvent(new CustomEvent(WORK_FILTER_EVENT, { detail: hs.id === 'qa' ? 'qa' : 'all' }));
              }
            }}
          />
        );
      })}

      {layout === 'tall' && (
        <p className="pointer-events-none absolute bottom-[3%] left-0 right-0 text-center font-hand text-[5cqw] font-semibold text-white/85">
          tap anything on the desk
        </p>
      )}
    </div>
  );
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile, projects }) => {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<HotspotId | null>(null);
  const hovering = useRef(false);
  const lastTouch = useRef(0);

  const mobileProject = projects.find((p) => p.tags.some((t) => /react native|expo|flutter/i.test(t)));
  const hrefs: Record<HotspotId, string> = {
    projects: '#projects',
    mobile: mobileProject ? `/projects/${mobileProject.id}` : '#projects',
    contact: '#contact',
    experience: '#experience',
    certificates: '#certificates',
    qa: '#projects',
  };

  // Walk through the spots on its own until someone points at the desk.
  useEffect(() => {
    if (reduce) return;
    let i = -1;
    const advance = () => {
      if (hovering.current || Date.now() - lastTouch.current < IDLE_AFTER_TOUCH_MS) return;
      i = (i + 1) % HOTSPOTS.length;
      setActive(HOTSPOTS[i].id);
    };
    const start = window.setTimeout(advance, 1400);
    const timer = window.setInterval(advance, CYCLE_MS);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer);
    };
  }, [reduce]);

  const select = useCallback((id: HotspotId) => {
    lastTouch.current = Date.now();
    setActive(id);
  }, []);

  const hover = useCallback((inside: boolean) => {
    hovering.current = inside;
    if (!inside) lastTouch.current = Date.now();
  }, []);

  const stats: Stats = [
    { value: profile.stats.projectsCompleted, label: 'projects' },
    { value: profile.stats.yearsExperience, label: 'yrs exp' },
    { value: profile.stats.certificatesEarned, label: 'certs' },
  ];
  const desk = { stats, avatar: profile.avatar || '/images/profile.png', hrefs, active, onSelect: select, onHover: hover };

  return (
    <section id="home" className="hero grain relative overflow-hidden bg-chalk pt-16 text-navy">
      <div className="hero-stage relative">
        {/* Intro: above the desk on small screens, written on the wall from lg up (see .hero-* in globals.css) */}
        <div className="hero-copy wrap relative z-10 pb-8 pt-10">
          <motion.p
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.72rem] font-bold uppercase tracking-[0.06em] hero-eyebrow"
          >
            <span>{profile.name}</span>
            <span className="flex items-center gap-1.5 text-navy/70">
              <span className="h-2 w-2 rounded-full border-[1.5px] border-navy bg-leaf" />
              Open to work
            </span>
          </motion.p>

          <h1 className="relative mt-8 font-marker text-[clamp(2.1rem,8.5vw,3.75rem)] uppercase leading-[0.98] hero-title">
            <motion.span
              initial={{ opacity: 0, scale: reduce ? 1 : 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1, ease }}
              className="absolute -top-[0.62em] left-[0.1em] origin-bottom-left -rotate-6 font-hand text-[0.48em] normal-case text-flame"
            >
              junior
            </motion.span>
            <RiseLine delay={0.25}>Fullstack</RiseLine>
            <RiseLine delay={0.37}>Developer</RiseLine>
            <RiseLine delay={0.49} className="text-ocean">
              <MarkerText>& Manual QA</MarkerText>
            </RiseLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease }}
            className="mt-5 max-w-[34rem] text-[0.95rem] leading-relaxed text-navy/80 hero-bio"
          >
            {profile.bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease }}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            <a href="#projects" className="btn-stamp btn-stamp-ocean">
              See my work <span aria-hidden>↓</span>
            </a>
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} className="btn-stamp btn-stamp-paper">
                <span className="lg:hidden">Curriculum Vitae</span>
                <span className="hidden lg:inline">CV</span> <span aria-hidden>↗</span>
              </a>
            )}
          </motion.div>
        </div>

        {/* The desk: one long desk from tablet width up, a stacked one on phones */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease }}
          className="hero-desk relative"
        >
          <Desk layout="wide" className="hidden lg:block" {...desk} />
          <Desk layout="mid" className="hidden md:block lg:hidden" {...desk} />
          <Desk layout="tall" className="md:hidden" {...desk} />
        </motion.div>
      </div>
    </section>
  );
};
