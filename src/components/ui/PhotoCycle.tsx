'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion';

/*
 * Cycles the ID-card photo through several images, each switch using a
 * different transition:
 *   burst  – a ring of light expands from the chest and reveals the next photo
 *   pixels – the next photo assembles from small tiles, like a digital dissolve
 *   scan   – a soft-edged scan line sweeps the next photo in from the top
 * The container must be `relative overflow-hidden` with container-type: size
 * (so `cqh` units refer to the photo's height).
 */

type Effect = 'burst' | 'pixels' | 'scan';
const EFFECTS: Effect[] = ['burst', 'pixels', 'scan'];

const HOLD_MS = 3000;
const EASE = [0.65, 0, 0.35, 1] as const;

interface RevealProps {
  src: string;
  position: string;
  alt: string;
  reduce: boolean;
  onDone: () => void;
}

function Photo({ src, position, alt, className = '', style }: {
  src: string;
  position: string;
  alt: string;
  className?: string;
  style?: React.ComponentProps<typeof motion.img>['style'];
}) {
  return (
    <motion.img
      src={src}
      alt={alt}
      draggable={false}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
      style={{ objectPosition: position, ...style }}
    />
  );
}

/* ---- burst: circle of light from the chest ---------------------------- */

const BURST_Y = 58; // % from top — roughly where the chest emblem sits

function BurstReveal({ src, position, alt, reduce, onDone }: RevealProps) {
  const r = useMotionValue(0); // radius in cqh; 80cqh covers the far corners
  const clip = useMotionTemplate`circle(${r}cqh at 50% ${BURST_Y}%)`;
  const ringLeft = useMotionTemplate`calc(50% - ${r}cqh)`;
  const ringTop = useMotionTemplate`calc(${BURST_Y}% - ${r}cqh)`;
  const ringSize = useTransform(r, (v) => `${v * 2}cqh`);
  const ringOpacity = useTransform(r, [0, 6, 60, 80], [0, 1, 0.8, 0]);
  const flash = useTransform(r, [0, 10, 40], [0, 0.35, 0]);
  const scale = useTransform(r, [0, 80], [1.12, 1]);

  useEffect(() => {
    const controls = animate(r, 80, { duration: reduce ? 0 : 1.5, ease: [0.7, 0, 0.2, 1] });
    controls.then(onDone);
    return () => controls.stop();
  }, [r, reduce, onDone]);

  return (
    <>
      <Photo src={src} position={position} alt={alt} style={{ clipPath: clip, WebkitClipPath: clip, scale }} />
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-white" style={{ opacity: flash }} />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute rounded-full shadow-[0_0_0_2px_rgba(255,255,255,0.85),0_0_28px_8px_rgba(255,255,255,0.55),inset_0_0_24px_4px_rgba(255,255,255,0.45)]"
        style={{ left: ringLeft, top: ringTop, width: ringSize, height: ringSize, opacity: ringOpacity }}
      />
    </>
  );
}

/* ---- pixels: tiles pop in --------------------------------------------- */

const COLS = 7;
const ROWS = 9;

// Deterministic jitter in [0, 1) so the pattern is stable.
const jitter = (i: number) => ((i * 9301 + 49297) % 233280) / 233280;

const TILES = Array.from({ length: COLS * ROWS }, (_, i) => {
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  // Sweep roughly from top-right to bottom-left, with noise so it feels digital.
  const delay = ((COLS - 1 - c) / COLS) * 0.35 + (r / ROWS) * 0.45 + jitter(i) * 0.35;
  return { c, r, delay };
});
const LAST_TILE = TILES.reduce((best, t, i) => (t.delay > TILES[best].delay ? i : best), 0);

function PixelReveal({ src, position, alt, reduce, onDone }: RevealProps) {
  useEffect(() => {
    if (reduce) onDone();
  }, [reduce, onDone]);
  if (reduce) return null;

  return (
    <div aria-hidden className="absolute inset-0">
      {TILES.map((t, i) => (
        <motion.div
          key={i}
          className="absolute overflow-hidden"
          style={{
            left: `${(t.c / COLS) * 100}%`,
            top: `${(t.r / ROWS) * 100}%`,
            // Exact fractions: each tile's inner image is sized relative to the tile,
            // so any overlap here would shift the pieces out of alignment.
            width: `${100 / COLS}%`,
            height: `${100 / ROWS}%`,
          }}
          initial={{ opacity: 0, scale: 0.2, filter: 'brightness(2.2)' }}
          animate={{ opacity: 1, scale: 1, filter: 'brightness(1)' }}
          transition={{ duration: 0.45, delay: t.delay, ease: [0.16, 1, 0.3, 1] }}
          onAnimationComplete={i === LAST_TILE ? onDone : undefined}
        >
          <img
            src={src}
            alt={i === 0 ? alt : ''}
            draggable={false}
            className="absolute max-w-none object-cover"
            style={{
              objectPosition: position,
              width: `${COLS * 100}%`,
              height: `${ROWS * 100}%`,
              left: `${-t.c * 100}%`,
              top: `${-t.r * 100}%`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

/* ---- scan: soft-edged sweep ------------------------------------------- */

const FEATHER = 35;

function ScanReveal({ src, position, alt, reduce, onDone }: RevealProps) {
  const p = useMotionValue(0);
  const edge = useTransform(p, (v) => v * (100 + FEATHER) - FEATHER);
  const mask = useMotionTemplate`linear-gradient(to bottom, #000 ${edge}%, transparent calc(${edge}% + ${FEATHER}%))`;
  const lineTop = useTransform(edge, (e) => `${e + FEATHER / 2}%`);
  const lineOpacity = useTransform(p, [0, 0.1, 0.9, 1], [0, 0.75, 0.75, 0]);
  const scale = useTransform(p, [0, 1], [1.06, 1]);

  useEffect(() => {
    const controls = animate(p, 1, { duration: reduce ? 0 : 1.8, ease: EASE });
    controls.then(onDone);
    return () => controls.stop();
  }, [p, reduce, onDone]);

  return (
    <>
      <Photo src={src} position={position} alt={alt} style={{ maskImage: mask, WebkitMaskImage: mask, scale }} />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 h-px bg-white shadow-[0_0_18px_5px_rgba(255,255,255,0.55)]"
        style={{ top: lineTop, opacity: lineOpacity }}
      />
    </>
  );
}

const REVEALS: Record<Effect, React.FC<RevealProps>> = {
  burst: BurstReveal,
  pixels: PixelReveal,
  scan: ScanReveal,
};

/* ---- cycle ------------------------------------------------------------ */

export function PhotoCycle({ photos, positions, alt }: { photos: string[]; positions: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [incoming, setIncoming] = useState<{ to: number; effect: Effect; key: number } | null>(null);
  const [reduce, setReduce] = useState(false);
  const pendingTo = useRef(0);

  // Warm the cache so every switch is instant.
  useEffect(() => {
    photos.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduce(mq.matches);
    mq.addEventListener('change', update);
    const t = window.setTimeout(update, 0);
    return () => {
      mq.removeEventListener('change', update);
      window.clearTimeout(t);
    };
  }, [photos]);

  // After each hold, start the next transition.
  useEffect(() => {
    if (incoming || photos.length < 2) return;
    const t = window.setTimeout(() => {
      const to = (index + 1) % photos.length;
      pendingTo.current = to;
      setIncoming({ to, effect: EFFECTS[index % EFFECTS.length], key: Date.now() });
    }, HOLD_MS);
    return () => window.clearTimeout(t);
  }, [incoming, index, photos.length]);

  // Stable so the running reveal's effect isn't restarted on re-render.
  const finish = useCallback(() => {
    setIndex(pendingTo.current);
    setIncoming(null);
  }, []);

  const Reveal = incoming ? REVEALS[incoming.effect] : null;

  return (
    <>
      <Photo src={photos[index]} position={positions[index]} alt={alt} />
      {incoming && Reveal && (
        <Reveal
          key={incoming.key}
          src={photos[incoming.to]}
          position={positions[incoming.to]}
          alt={alt}
          reduce={reduce}
          onDone={finish}
        />
      )}
    </>
  );
}
