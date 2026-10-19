'use client';

import React, { useEffect, useRef, useState } from 'react';

/*
 * Cycles the ID-card photo through several images on a <canvas>, each switch
 * using a different transition:
 *   burst  – a ring of light expands from the chest and reveals the next photo
 *   pixels – the next photo assembles from small tiles, like a digital dissolve
 *   scan   – a soft-edged scan line sweeps the next photo in from the top
 *
 * Drawing every frame ourselves (instead of stacking <img> layers with
 * clip-path / mask) means no flash when a photo swaps, no half-decoded first
 * frames, and nothing for Safari's 3D compositing to break inside the card.
 * All photos are decoded before the first transition starts.
 */

type Effect = 'burst' | 'pixels' | 'scan';
const EFFECTS: Effect[] = ['burst', 'pixels', 'scan'];

const HOLD_MS = 3000;
const DURATION_MS: Record<Effect, number> = { burst: 1500, pixels: 1700, scan: 1800 };

const BURST_Y = 0.58; // where the chest emblem sits, as a fraction of height
const FEATHER = 0.35; // softness of the scan edge, as a fraction of height
const COLS = 7;
const ROWS = 9;
const TILE_MS = 450;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

// Deterministic jitter in [0, 1) so the tile pattern is stable.
const jitter = (i: number) => ((i * 9301 + 49297) % 233280) / 233280;

const TILE_DELAYS = Array.from({ length: COLS * ROWS }, (_, i) => {
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  // Sweep roughly from top-right to bottom-left, with noise so it feels digital.
  return (((COLS - 1 - c) / COLS) * 0.3 + (r / ROWS) * 0.4 + jitter(i) * 0.3) * (DURATION_MS.pixels - TILE_MS);
});

interface Frame {
  img: HTMLImageElement;
  pos: [number, number];
}

function parsePosition(p: string): [number, number] {
  const [x = '50%', y = '50%'] = p.split(/\s+/);
  return [parseFloat(x) / 100, parseFloat(y) / 100];
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    img
      .decode()
      .then(() => resolve(img))
      .catch(() => (img.complete && img.naturalWidth ? resolve(img) : reject(new Error(`Failed to load ${src}`))));
  });
}

/** Draws like `object-fit: cover` + `object-position`, optionally zoomed in. */
function drawCover(ctx: CanvasRenderingContext2D, f: Frame, w: number, h: number, zoom = 1) {
  const ir = f.img.naturalWidth / f.img.naturalHeight;
  let dw = w;
  let dh = w / ir;
  if (dh < h) {
    dh = h;
    dw = h * ir;
  }
  dw *= zoom;
  dh *= zoom;
  ctx.drawImage(f.img, (w - dw) * f.pos[0], (h - dh) * f.pos[1], dw, dh);
}

export function PhotoCycle({ photos, positions, alt }: { photos: string[]; positions: string[]; alt: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const key = photos.join('|') + positions.join('|');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Offscreen buffers: `next` holds the incoming photo, `work` composites the scan mask.
    const next = document.createElement('canvas');
    const work = document.createElement('canvas');
    const nctx = next.getContext('2d')!;
    const wctx = work.getContext('2d')!;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frames: Frame[] = [];
    let index = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let timer = 0;
    let animating = false;
    let cancelled = false;

    const drawStill = () => {
      if (!frames.length || !w) return;
      ctx.clearRect(0, 0, w, h);
      drawCover(ctx, frames[index], w, h);
    };

    const resize = () => {
      // Layout size, not getBoundingClientRect: the card is 3D-rotated and scaled.
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      for (const c of [canvas, next, work]) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      for (const c of [ctx, nctx, wctx]) c.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!animating) drawStill();
    };

    const renderBurst = (from: Frame, to: Frame, p: number) => {
      const e = easeInOut(p);
      const cx = w / 2;
      const cy = h * BURST_Y;
      const r = e * Math.hypot(cx, Math.max(cy, h - cy)) * 1.04;

      drawCover(ctx, from, w, h);
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(0, r), 0, Math.PI * 2);
      ctx.clip();
      drawCover(ctx, to, w, h, 1.12 - 0.12 * e);
      ctx.restore();

      const flash = p < 0.1 ? (p / 0.1) * 0.3 : 0.3 * clamp01(1 - (p - 0.1) / 0.3);
      if (flash > 0) {
        ctx.fillStyle = `rgba(255,255,255,${flash})`;
        ctx.fillRect(0, 0, w, h);
      }

      const ring = p < 0.08 ? p / 0.08 : clamp01(1 - (p - 0.7) / 0.3);
      if (ring > 0 && r > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = `rgba(255,255,255,${0.9 * ring})`;
        ctx.shadowColor = `rgba(255,255,255,${0.85 * ring})`;
        ctx.shadowBlur = 22;
        ctx.stroke();
        ctx.restore();
      }
    };

    const renderPixels = (from: Frame, p: number) => {
      const elapsed = p * DURATION_MS.pixels;
      const tw = w / COLS;
      const th = h / ROWS;

      drawCover(ctx, from, w, h);
      TILE_DELAYS.forEach((delay, i) => {
        const t = clamp01((elapsed - delay) / TILE_MS);
        if (t <= 0) return;
        const k = easeOutExpo(t);
        const s = 0.25 + 0.75 * k;
        const c = i % COLS;
        const r = Math.floor(i / COLS);
        const dw = tw * s + 0.5;
        const dh = th * s + 0.5;
        const dx = c * tw + (tw - dw) / 2;
        const dy = r * th + (th - dh) / 2;

        ctx.globalAlpha = Math.min(1, t * 2.5);
        ctx.drawImage(next, c * tw * dpr, r * th * dpr, tw * dpr, th * dpr, dx, dy, dw, dh);
        const glow = (1 - k) * 0.55;
        if (glow > 0.01) {
          ctx.fillStyle = `rgba(255,255,255,${glow})`;
          ctx.fillRect(dx, dy, dw, dh);
        }
        ctx.globalAlpha = 1;
      });
    };

    const renderScan = (from: Frame, to: Frame, p: number) => {
      const e = easeInOut(p);
      const edge = (e * (1 + FEATHER) - FEATHER) * h;

      drawCover(ctx, from, w, h);

      wctx.globalCompositeOperation = 'source-over';
      wctx.clearRect(0, 0, w, h);
      drawCover(wctx, to, w, h, 1.06 - 0.06 * e);
      wctx.globalCompositeOperation = 'destination-in';
      const g = wctx.createLinearGradient(0, edge, 0, edge + FEATHER * h);
      g.addColorStop(0, 'rgba(0,0,0,1)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      wctx.fillStyle = g;
      wctx.fillRect(0, 0, w, h);
      wctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(work, 0, 0, w, h);

      const line = (p < 0.1 ? p / 0.1 : p > 0.9 ? (1 - p) / 0.1 : 1) * 0.75;
      if (line > 0) {
        ctx.save();
        ctx.fillStyle = `rgba(255,255,255,${line})`;
        ctx.shadowColor = 'rgba(255,255,255,0.85)';
        ctx.shadowBlur = 16;
        ctx.fillRect(0, edge + (FEATHER * h) / 2 - 0.5, w, 1);
        ctx.restore();
      }
    };

    const runTransition = () => {
      const fromIdx = index;
      const toIdx = (index + 1) % frames.length;
      const effect = EFFECTS[fromIdx % EFFECTS.length];
      const from = frames[fromIdx];
      const to = frames[toIdx];
      const duration = DURATION_MS[effect];

      nctx.clearRect(0, 0, w, h);
      drawCover(nctx, to, w, h);

      animating = true;
      const start = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const p = clamp01((now - start) / duration);
        ctx.clearRect(0, 0, w, h);
        if (effect === 'burst') renderBurst(from, to, p);
        else if (effect === 'pixels') renderPixels(from, p);
        else renderScan(from, to, p);

        if (p < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          index = toIdx;
          animating = false;
          drawStill();
          schedule();
        }
      };
      raf = requestAnimationFrame(tick);
    };

    const schedule = () => {
      if (cancelled || reduce || frames.length < 2) return;
      timer = window.setTimeout(runTransition, HOLD_MS);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    Promise.all(photos.map(loadImage))
      .then((imgs) => {
        if (cancelled) return;
        frames = imgs.map((img, i) => ({ img, pos: parsePosition(positions[i] ?? '50% 50%') }));
        resize();
        drawStill();
        setReady(true);
        schedule();
      })
      .catch((err) => console.error(err));

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      ro.disconnect();
    };
    // `key` captures the photo list and positions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <>
      {/* Server-rendered fallback (and what shows until the canvas is ready). */}
      <img
        src={photos[0]}
        alt={alt}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: positions[0] }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`}
      />
    </>
  );
}
