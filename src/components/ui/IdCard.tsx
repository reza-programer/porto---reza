'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PhotoCycle } from '@/components/ui/PhotoCycle';
import type { Profile } from '@/types';

/*
 * A staff-style ID card hanging from a lanyard.
 *
 * Plain DOM + CSS 3D so the text stays crisp and uses the site font.
 * A small spring simulation drives the swing; the mouse tilts the card,
 * dragging swings it, and a click flips it to show the back.
 */

const CARD_W = 300;
const CARD_H = 480;

// Deterministic barcode bars from a string (decorative).
function barcode(seed: string) {
  const bars: number[] = [];
  for (const ch of seed) {
    const c = ch.charCodeAt(0);
    bars.push((c % 3) + 1, ((c >> 2) % 2) + 1);
  }
  return bars;
}

function SlotHole() {
  return <div className="mx-auto mt-3.5 h-2 w-14 rounded-full bg-paper shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]" />;
}

export const IdCard: React.FC<{ profile: Profile }> = ({ profile }) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [strap, setStrap] = useState(150);
  const [flipped, setFlipped] = useState(false);

  // Mutable simulation state, read and written by the animation loop.
  const sim = useRef({
    angle: 0,
    vel: 0,
    dragging: false,
    grabOffset: 0,
    lastAngle: 0,
    lastTime: 0,
    downX: 0,
    downY: 0,
    downTime: 0,
    tiltX: 0,
    tiltY: 0,
    rx: 0,
    ry: 0,
    flip: 0,
    flipTarget: 0,
  });

  // Strap length keeps the card vertically centred in the available space.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(() => {
      const h = stage.clientHeight;
      setStrap(Math.max(70, Math.min(320, h / 2 - CARD_H / 2 + 10)));
    });
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  // Animation loop.
  useEffect(() => {
    const stage = stageRef.current;
    const rig = rigRef.current;
    const card = cardRef.current;
    if (!stage || !rig || !card) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const s = sim.current;
    let raf = 0;
    let prev = performance.now();
    let visible = true;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      const t = now / 1000;

      if (!s.dragging) {
        const wind = reduce ? 0 : Math.sin(t * 0.8) * 1.6 + Math.sin(t * 0.33) * 1.1;
        const acc = -16 * (s.angle - wind) - 2.4 * s.vel;
        s.vel += acc * dt;
        s.angle += s.vel * dt;
      }

      const twist = Math.max(-28, Math.min(28, -s.vel * 0.1));
      const k = Math.min(1, dt * 8);
      s.rx += (s.tiltX - s.rx) * k;
      s.ry += (s.tiltY + twist - s.ry) * k;
      s.flip += (s.flipTarget - s.flip) * Math.min(1, dt * 6);

      rig.style.transform = `rotate(${s.angle}deg)`;
      card.style.transform = `rotateX(${s.rx}deg) rotateY(${s.ry + s.flip}deg)`;
      card.style.setProperty('--sheen', `${50 - (s.ry + s.flip) * 1.6}%`);

      if (visible) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was) {
        prev = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(stage);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  // Angle (deg) of the pointer as seen from the lanyard anchor.
  const pointerAngle = (e: React.PointerEvent) => {
    const rect = stageRef.current!.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = Math.max(20, e.clientY - rect.top);
    return (-Math.atan2(dx, dy) * 180) / Math.PI;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = sim.current;
    e.currentTarget.setPointerCapture(e.pointerId);
    s.dragging = true;
    s.grabOffset = pointerAngle(e) - s.angle;
    s.lastAngle = s.angle;
    s.lastTime = performance.now();
    s.downX = e.clientX;
    s.downY = e.clientY;
    s.downTime = s.lastTime;
    s.vel = 0;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = sim.current;
    if (s.dragging) {
      const now = performance.now();
      const next = Math.max(-65, Math.min(65, pointerAngle(e) - s.grabOffset));
      const dt = Math.max(1, now - s.lastTime) / 1000;
      s.vel = s.vel * 0.5 + ((next - s.lastAngle) / dt) * 0.5;
      s.angle = next;
      s.lastAngle = next;
      s.lastTime = now;
      return;
    }
    if (e.pointerType !== 'mouse' || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    s.tiltX = (0.5 - py) * 18;
    s.tiltY = (px - 0.5) * 26;
  };

  const release = (e: React.PointerEvent<HTMLDivElement>, cancelled = false) => {
    const s = sim.current;
    if (!s.dragging) return;
    s.dragging = false;
    const moved = Math.hypot(e.clientX - s.downX, e.clientY - s.downY);
    if (!cancelled && moved < 6 && performance.now() - s.downTime < 350) {
      s.flipTarget = s.flipTarget === 0 ? 180 : 0;
      setFlipped(s.flipTarget === 180);
    }
  };

  const onPointerLeave = () => {
    const s = sim.current;
    s.tiltX = 0;
    s.tiltY = 0;
  };

  const handle = profile.socialLinks.github?.replace(/^https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '');
  const bars = barcode(profile.email);
  const photos = [profile.avatar || '/images/profile.png', ...(profile.avatarAlts ?? [])];
  // The formal portrait is framed tighter than the edited ones.
  const photoPositions = photos.map((_, i) => (i === 0 ? '50% 15%' : '50% 20%'));

  const face =
    'absolute inset-0 flex flex-col overflow-hidden rounded-[22px] border border-line bg-surface [backface-visibility:hidden] shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_30px_60px_-30px_rgba(10,10,10,0.35),0_12px_24px_-12px_rgba(10,10,10,0.18)]';
  const sheen =
    'pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.55)_48%,transparent_62%)] bg-[length:260%_100%] [background-position:var(--sheen)_0] mix-blend-soft-light';

  return (
    <div ref={stageRef} className="relative h-full w-full select-none">
      <div className="absolute left-1/2 top-0 origin-top -translate-x-1/2 scale-[0.82] sm:scale-100">
        <div ref={rigRef} className="origin-top will-change-transform" style={{ width: CARD_W }}>
          {/* Lanyard */}
          <div
            className="relative mx-auto w-7 overflow-hidden bg-ink [mask-image:linear-gradient(to_bottom,transparent,#000_70px)]"
            style={{ height: strap }}
            aria-hidden
          >
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 pb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/90 [writing-mode:vertical-rl]">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i}>Reza Nurpadilah</span>
              ))}
            </div>
          </div>

          {/* Clip */}
          <div className="relative z-10 mx-auto -mt-1 flex h-7 w-11 items-end justify-center rounded-md bg-gradient-to-b from-[#f2f2f2] to-[#b9b9b9] shadow-[0_2px_4px_rgba(0,0,0,0.2)]" aria-hidden>
            <div className="mb-1 h-2 w-6 rounded-full bg-[#8d8d8d]/60" />
          </div>
          <div className="relative z-10 mx-auto -mt-0.5 h-5 w-1.5 rounded-b-sm bg-gradient-to-b from-[#c8c8c8] to-[#9b9b9b]" aria-hidden />

          {/* Card */}
          <div className="-mt-3 [perspective:1100px]">
            <div
              ref={cardRef}
              role="button"
              tabIndex={0}
              aria-pressed={flipped}
              aria-label={flipped ? 'ID card, back side. Press to flip.' : 'ID card. Press to flip.'}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  sim.current.flipTarget = sim.current.flipTarget === 0 ? 180 : 0;
                  setFlipped(sim.current.flipTarget === 180);
                }
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={(e) => release(e)}
              onPointerCancel={(e) => release(e, true)}
              onPointerLeave={onPointerLeave}
              className="relative cursor-grab touch-pan-y [transform-style:preserve-3d] active:cursor-grabbing"
              style={{ width: CARD_W, height: CARD_H }}
            >
              {/* Front */}
              <div className={face}>
                <SlotHole />
                <div className="flex items-center justify-between px-5 pt-3">
                  <span className="text-[15px] font-semibold tracking-[-0.03em]">
                    Reza<span className="text-accent">.</span>
                  </span>
                  <span className="eyebrow text-[10px]">Portfolio ID</span>
                </div>

                <div className="relative mx-5 mt-3.5 aspect-[4/5] overflow-hidden rounded-xl bg-[#cfd4dc] [container-type:size]">
                  <PhotoCycle photos={photos} positions={photoPositions} alt={profile.name} />
                </div>

                <div className="mt-auto px-5 pb-6">
                  <div className="text-[18px] font-semibold leading-tight tracking-[-0.02em]">{profile.name}</div>
                  <div className="t-small mt-1 text-muted">{profile.title}</div>
                </div>
                <div className={sheen} />
              </div>

              {/* Back */}
              <div className={`${face} [transform:rotateY(180deg)]`}>
                <SlotHole />
                <div className="flex flex-1 flex-col px-6 pt-6">
                  <div className="eyebrow">Contact</div>
                  <dl className="mt-4 space-y-3.5">
                    {[
                      { k: 'Email', v: profile.email },
                      profile.phone ? { k: 'WhatsApp', v: profile.phone } : null,
                      handle ? { k: 'GitHub', v: handle } : null,
                      profile.socialLinks.linkedin ? { k: 'LinkedIn', v: 'Mohamad Reza Nurpadilah' } : null,
                    ]
                      .filter(Boolean)
                      .map((row) => (
                        <div key={row!.k}>
                          <dt className="eyebrow text-[10px]">{row!.k}</dt>
                          <dd className="t-small mt-0.5 break-all font-medium">{row!.v}</dd>
                        </div>
                      ))}
                  </dl>

                  <div className="mt-auto pb-5">
                    <div className="flex h-10 items-stretch gap-[2px]" aria-hidden>
                      {bars.map((w, i) => (
                        <span key={i} className={i % 2 === 0 ? 'bg-ink' : 'bg-transparent'} style={{ width: w * 1.5 }} />
                      ))}
                    </div>
                    <p className="t-small mt-3 text-muted">Click the card to flip it back.</p>
                  </div>
                </div>
                <div className={sheen} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
