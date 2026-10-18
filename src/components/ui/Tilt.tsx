'use client';

import React, { useRef } from 'react';

interface TiltProps {
  children: React.ReactNode;
  className?: string;
  /** Maximum rotation in degrees. */
  max?: number;
  /** Scale applied while hovered. */
  scale?: number;
  glare?: boolean;
}

/**
 * Perspective tilt that follows the mouse, with a soft light glare.
 * Touch and pen input are ignored so scrolling on phones is unaffected.
 */
export const Tilt: React.FC<TiltProps> = ({ children, className = '', max = 7, scale = 1.015, glare = true }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    cardRef.current.style.transition = 'transform 120ms linear';
    cardRef.current.style.transform = `rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) scale(${scale})`;

    if (glareRef.current) {
      glareRef.current.style.opacity = '1';
      glareRef.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.45), rgba(255,255,255,0) 55%)`;
    }
  };

  const handleLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transition = 'transform 900ms cubic-bezier(0.16, 1, 0.3, 1)';
    cardRef.current.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    if (glareRef.current) glareRef.current.style.opacity = '0';
  };

  return (
    <div className={`[perspective:1400px] ${className}`} onPointerMove={handleMove} onPointerLeave={handleLeave}>
      <div ref={cardRef} className="relative h-full will-change-transform [transform-style:preserve-3d]">
        {children}
        {glare && (
          <div
            ref={glareRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 mix-blend-soft-light transition-opacity duration-500"
          />
        )}
      </div>
    </div>
  );
};
