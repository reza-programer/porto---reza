'use client';

import React, { useState } from 'react';
import { Reveal } from '@/components/ui/Reveal';
import { ScreenshotLightbox } from '@/components/ui/ScreenshotLightbox';

/** The cover on a dark board; opens every screen. */
export function CoverPlate({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState(false);
  if (!images.length) return null;

  return (
    <>
      <Reveal y={30}>
        <button
          onClick={() => setOpen(true)}
          className="group relative block w-full cursor-zoom-in bg-[#161616] px-[6%] pt-[5%] text-left"
          aria-label={`Open ${images.length} screens`}
        >
          <img
            src={images[0]}
            alt={title}
            className="mx-auto block h-auto w-full max-w-[1100px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5"
          />
          {images.length > 1 && (
            <span className="absolute bottom-5 right-5 flex items-center gap-3 rounded-full bg-lime py-2 pl-4 pr-2 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-ink">
              All {images.length} screens
              <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-lime transition-transform duration-500 group-hover:rotate-45">
                ↗
              </span>
            </span>
          )}
        </button>
      </Reveal>
      <ScreenshotLightbox isOpen={open} images={images} initialIndex={0} title={title} onClose={() => setOpen(false)} />
    </>
  );
}

/** Every screen in columns at its own shape (phones tall, dashboards wide). */
export function ScreensGrid({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  if (images.length <= 1) return null;

  return (
    <>
      <div className="columns-2 gap-4 lg:columns-3">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setIndex(i)}
            className="group mb-4 block w-full cursor-zoom-in break-inside-avoid text-left sm:mb-6"
          >
            <div className="overflow-hidden bg-sheet-2">
              <img
                src={src}
                alt={`${title} — screen ${i + 1}`}
                loading="lazy"
                className="block h-auto w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
              />
            </div>
            <div className="mt-2 text-[0.75rem] text-ink/50 transition-colors group-hover:text-ink">
              {String(i + 1).padStart(2, '0')}
            </div>
          </button>
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
}
