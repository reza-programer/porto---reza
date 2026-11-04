'use client';

import React, { useEffect, useState } from 'react';
import { FiLayers, FiMaximize2 } from 'react-icons/fi';
import { Tilt } from '@/components/ui/Tilt';
import { MacbookFrame } from '@/components/ui/MacbookFrame';
import { Reveal } from '@/components/ui/Reveal';
import { ScreenshotLightbox } from '@/components/ui/ScreenshotLightbox';

interface ProjectDetailHeroProps {
  images: string[];
  title: string;
  label: string;
}

const SLIDE_MS = 3500;

/** Large tilted screenshot that cycles through the screens and opens the full gallery. */
export const ProjectDetailHero: React.FC<ProjectDetailHeroProps> = ({ images, title, label }) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  // Advance on our own; hold still while the gallery is open or motion is reduced.
  useEffect(() => {
    if (images.length < 2 || open) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setActive((i) => (i + 1) % images.length), SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [images.length, open]);

  return (
    <>
      <Reveal y={40}>
        <div className="group relative">
          <button
            onClick={() => setOpen(true)}
            className="relative block w-full cursor-zoom-in border-[3px] border-navy bg-mist px-[6%] pb-[5%] pt-[6%] text-left shadow-[7px_7px_0_#0c2340]"
            aria-label="Open screenshots"
          >
            <Tilt max={4} scale={1.005} glare={false} className="mx-auto max-w-[980px]">
              <MacbookFrame src={images} active={active} alt={title} label={label} eager />
            </Tilt>
          </button>
          {images.length > 1 && (
            <>
              <span className="absolute bottom-5 left-5 font-mono text-[0.72rem] font-bold tabular-nums text-navy" aria-live="polite">
                {String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
              </span>
              <button
                onClick={() => setOpen(true)}
                className="btn-stamp btn-stamp-ocean absolute bottom-4 right-4"
              >
                <FiLayers className="h-3.5 w-3.5" /> View all {images.length} screens
              </button>
            </>
          )}
        </div>
      </Reveal>

      <ScreenshotLightbox isOpen={open} images={images} initialIndex={active} title={title} onClose={() => setOpen(false)} />
    </>
  );
};

/** Grid of every screenshot; each opens the lightbox at its position. */
export const ProjectDetailGalleryGrid: React.FC<{ images: string[]; title: string }> = ({ images, title }) => {
  const [index, setIndex] = useState<number | null>(null);

  if (images.length <= 1) return null;

  return (
    <>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((src, i) => (
          <Reveal key={src} delay={(i % 3) * 0.06}>
            <button onClick={() => setIndex(i)} className="group block w-full cursor-zoom-in text-left">
              <Tilt max={7}>
                <div className="relative aspect-[21/10] overflow-hidden border-[3px] border-navy bg-white shadow-[5px_5px_0_#0c2340]">
                  <img
                    src={src}
                    alt={`${title} — screen ${i + 1}`}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  />
                  <span className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-navy bg-white text-navy opacity-0 transition-opacity group-hover:opacity-100">
                    <FiMaximize2 className="h-3 w-3" />
                  </span>
                </div>
              </Tilt>
              <div className="mt-3 flex justify-between font-mono text-[0.68rem] font-bold uppercase text-navy">
                <span>Screen {String(i + 1).padStart(2, '0')}</span>
                {i === 0 && <span className="text-flame">Cover</span>}
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      <ScreenshotLightbox
        isOpen={index !== null}
        images={images}
        initialIndex={index ?? 0}
        title={title}
        onClose={() => setIndex(null)}
      />
    </>
  );
};
