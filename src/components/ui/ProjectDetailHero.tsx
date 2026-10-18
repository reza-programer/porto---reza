'use client';

import React, { useState } from 'react';
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

/** Large tilted screenshot that opens the full gallery. */
export const ProjectDetailHero: React.FC<ProjectDetailHeroProps> = ({ images, title, label }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Reveal y={40}>
        <div className="group relative">
          <button
            onClick={() => setOpen(true)}
            className="block w-full cursor-zoom-in rounded-2xl border border-line bg-[linear-gradient(180deg,#f3f3f1_0%,#eaeae7_100%)] px-[6%] pb-[4%] pt-[6%] text-left"
            aria-label="Open screenshots"
          >
            <Tilt max={4} scale={1.005} glare={false} className="mx-auto max-w-[980px]">
              <MacbookFrame src={images[0]} alt={title} label={label} eager />
            </Tilt>
          </button>
          {images.length > 1 && (
            <button
              onClick={() => setOpen(true)}
              className="btn btn-primary absolute bottom-4 right-4 py-2.5 shadow-lg"
            >
              <FiLayers className="h-3.5 w-3.5" /> View all {images.length} screens
            </button>
          )}
        </div>
      </Reveal>

      <ScreenshotLightbox isOpen={open} images={images} initialIndex={0} title={title} onClose={() => setOpen(false)} />
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
              <Tilt max={7} className="rounded-lg">
                <div className="relative aspect-[21/10] overflow-hidden rounded-lg border border-line bg-surface">
                  <img
                    src={src}
                    alt={`${title} — screen ${i + 1}`}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  />
                  <span className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-surface text-ink opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                    <FiMaximize2 className="h-3 w-3" />
                  </span>
                </div>
              </Tilt>
              <div className="eyebrow mt-3 flex justify-between">
                <span>Screen {String(i + 1).padStart(2, '0')}</span>
                {i === 0 && <span>Cover</span>}
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
