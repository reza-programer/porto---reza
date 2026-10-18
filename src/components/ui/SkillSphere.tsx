'use client';

import React, { useEffect, useRef } from 'react';
import type { IconType } from 'react-icons';

export interface SphereItem {
  name: string;
  icon: IconType;
}

/**
 * A rotating sphere of skill chips, projected with plain CSS transforms.
 * Moving the mouse over it steers the spin; it idles slowly otherwise.
 */
export const SkillSphere: React.FC<{ items: SphereItem[] }> = ({ items }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const target = useRef({ vx: 0.0012, vy: 0.0035 });

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const n = items.length;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const points = items.map((_, i) => {
      const y = 1 - (2 * (i + 0.5)) / n;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      return [Math.cos(theta) * r, y, Math.sin(theta) * r] as const;
    });

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let radius = wrap.clientWidth * 0.39;
    let ax = 0.35;
    let ay = 0;
    let vx = target.current.vx;
    let vy = target.current.vy;
    let raf = 0;
    let visible = true;

    const draw = () => {
      vx += (target.current.vx - vx) * 0.05;
      vy += (target.current.vy - vy) * 0.05;
      ax += vx;
      ay += vy;

      const cx = Math.cos(ax);
      const sx = Math.sin(ax);
      const cy = Math.cos(ay);
      const sy = Math.sin(ay);

      points.forEach(([x, y, z], i) => {
        const el = itemRefs.current[i];
        if (!el) return;
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y2 = y * cx - z1 * sx;
        const z2 = y * sx + z1 * cx;
        const depth = (z2 + 1) / 2;
        const scale = 0.62 + depth * 0.5;
        el.style.transform = `translate3d(${x1 * radius}px, ${y2 * radius}px, 0) translate(-50%, -50%) scale(${scale})`;
        el.style.opacity = String(0.14 + depth * 0.86);
        el.style.zIndex = String(Math.round(depth * 100));
      });
    };

    const loop = () => {
      draw();
      if (visible && !reduce) raf = requestAnimationFrame(loop);
    };
    loop();

    const io = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (visible && !wasVisible && !reduce) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(wrap);

    const ro = new ResizeObserver(() => {
      radius = wrap.clientWidth * 0.39;
      if (reduce) draw();
    });
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [items]);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / rect.width - 0.5;
    const dy = (e.clientY - rect.top) / rect.height - 0.5;
    target.current = { vx: -dy * 0.03, vy: dx * 0.03 };
  };

  const handleLeave = () => {
    target.current = { vx: 0.0012, vy: 0.0035 };
  };

  return (
    <div
      ref={wrapRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="relative mx-auto aspect-square w-full max-w-[560px] select-none"
    >
      {/* Wireframe globe for depth cues */}
      <div aria-hidden className="pointer-events-none absolute inset-[11%] rounded-full border border-line" />
      <div aria-hidden className="pointer-events-none absolute inset-x-[11%] top-1/2 h-[24%] -translate-y-1/2 rounded-[50%] border border-line" />
      <div aria-hidden className="pointer-events-none absolute inset-y-[11%] left-1/2 w-[24%] -translate-x-1/2 rounded-[50%] border border-line" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />

      <ul className="absolute left-1/2 top-1/2 h-0 w-0">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <li
              key={item.name}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="absolute left-0 top-0 opacity-0 will-change-transform"
            >
              <span className="flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface t-small px-3.5 py-1.5 font-medium text-ink shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:border-ink hover:bg-ink hover:text-paper">
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {item.name}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
