'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiAward, FiX } from 'react-icons/fi';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { formatTitle } from '@/lib/project-meta';
import type { Certificate } from '@/types';

const ease = [0.16, 1, 0.3, 1] as const;

/** Full-screen view of one certificate, with arrows through the rest. */
function Viewer({ certificates, index, onIndex, onClose }: { certificates: Certificate[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const cert = certificates[index];
  const step = useCallback(
    (d: number) => onIndex((index + d + certificates.length) % certificates.length),
    [index, certificates.length, onIndex]
  );

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, step]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-modal="true"
      aria-label={formatTitle(cert.title)}
      className="fixed inset-0 z-[70] flex flex-col bg-ink text-sheet"
      onClick={onClose}
    >
      <div className="wrap label flex h-16 shrink-0 items-center justify-between" onClick={(e) => e.stopPropagation()}>
        <span className="tabular-nums">
          {String(index + 1).padStart(2, '0')} / {String(certificates.length).padStart(2, '0')}
        </span>
        <button onClick={onClose} className="-mr-2 flex cursor-pointer items-center gap-2 p-2">
          Close <FiX className="h-4 w-4" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          {cert.image ? (
            <motion.img
              key={cert.id}
              src={cert.image}
              alt={cert.title}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease }}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <FiAward className="h-16 w-16 text-sheet/40" />
          )}
        </AnimatePresence>
        {certificates.length > 1 && (
          <>
            <button onClick={() => step(-1)} aria-label="Previous" className="absolute left-2 cursor-pointer p-3 hover:text-lime sm:left-6">
              <FiArrowLeft className="h-5 w-5" />
            </button>
            <button onClick={() => step(1)} aria-label="Next" className="absolute right-2 cursor-pointer p-3 hover:text-lime sm:right-6">
              <FiArrowRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      <div className="wrap flex shrink-0 flex-col gap-4 py-6 sm:flex-row sm:items-end sm:justify-between" onClick={(e) => e.stopPropagation()}>
        <div className="min-w-0">
          <div className="text-[0.85rem] text-sheet/60">
            {cert.issuer} · {cert.date}
          </div>
          <h3 className="mt-1 text-[clamp(1.3rem,2.6vw,2rem)] font-semibold leading-tight">{formatTitle(cert.title)}</h3>
        </div>
        <div className="flex shrink-0 gap-2">
          {cert.image && (
            <a href={cert.image} target="_blank" rel="noopener noreferrer" className="btn-outline-ink hover:border-sheet hover:bg-sheet hover:text-ink">
              Open file
            </a>
          )}
          {cert.credentialUrl && (
            <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="btn-ink bg-lime! text-ink!">
              Verify <FiArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/*
 * "04 / Certificates": a three-up grid of the documents on light boards,
 * black and white until hovered. Clicking one opens the full view.
 */
export const CertificatesSection: React.FC<{ certificates: Certificate[] }> = ({ certificates }) => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="certificates" className="border-b border-ink/15 py-20 sm:py-28">
      <div className="wrap grid grid-cols-12 gap-x-6 gap-y-12">
        <SectionTitle
          no="04"
          title={['Certifi-', 'cates']}
          note="Courses, programs and exams I've passed."
          className="col-span-12 lg:sticky lg:top-28 lg:col-span-3 lg:self-start"
        />

        <ul className="col-span-12 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:col-span-9">
          {certificates.map((cert, i) => (
            <li key={cert.id}>
              <button
                onClick={() => setOpen(i)}
                className="group block w-full cursor-pointer text-left"
                aria-label={`View certificate: ${formatTitle(cert.title)}`}
              >
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-sheet-2 p-[9%]">
                  {cert.image ? (
                    <img
                      src={cert.image}
                      alt=""
                      loading="lazy"
                      className="max-h-full max-w-full object-contain shadow-[0_10px_24px_-12px_rgba(0,0,0,0.35)] grayscale transition-[filter,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] group-hover:grayscale-0"
                    />
                  ) : (
                    <FiAward className="h-8 w-8 text-ink/30" />
                  )}
                  <span className="arrow-dot absolute bottom-3 right-3 h-8! w-8! opacity-0 transition-[opacity,transform] group-hover:opacity-100">
                    <FiArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
                <h3 className="mt-3 line-clamp-2 text-[0.95rem] font-semibold leading-snug">{formatTitle(cert.title)}</h3>
                <p className="mt-0.5 text-[0.8rem] text-ink/55">
                  {cert.issuer} · {cert.date}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {open !== null && (
          <Viewer key="viewer" certificates={certificates} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};
