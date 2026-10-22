'use client';

import React, { useState } from 'react';
import { FiArrowUpRight, FiAward, FiMaximize2 } from 'react-icons/fi';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';
import { Tilt } from '@/components/ui/Tilt';
import { Modal } from '@/components/ui/Modal';
import { formatTitle } from '@/lib/project-meta';
import type { Certificate } from '@/types';

interface CertificatesSectionProps {
  certificates: Certificate[];
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({ certificates }) => {
  const [selected, setSelected] = useState<Certificate | null>(null);

  return (
    <section id="certificates" className="py-20 sm:py-28">
      <div className="wrap">
        <SectionHeader
          index="04"
          label="Certificates"
          title="Certificates & credentials"
          intro="Professional certifications and credentials I've earned."
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, i) => (
            <Reveal key={cert.id} delay={(i % 3) * 0.06}>
              <button
                onClick={() => setSelected(cert)}
                className="group block w-full cursor-pointer text-left"
                aria-label={`View certificate: ${formatTitle(cert.title)}`}
              >
                <Tilt max={7} className="rounded-xl">
                  <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-line bg-[#f2f1ef] p-6">
                    {cert.image ? (
                      <img
                        src={cert.image}
                        alt={cert.title}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain shadow-[0_18px_36px_-18px_rgba(0,0,0,0.35)] transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                      />
                    ) : (
                      <FiAward className="h-10 w-10 text-faint" />
                    )}
                    <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface text-ink opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100">
                      <FiMaximize2 className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Tilt>

                <div className="eyebrow mt-5 flex items-center gap-2">
                  <span className="text-ink">{cert.date.substring(0, 4)}</span>
                  <span className="text-line-strong">·</span>
                  <span className="truncate">{cert.issuer}</span>
                </div>
                <h3 className="t-h3 mt-2 line-clamp-2 transition-colors group-hover:text-accent">{formatTitle(cert.title)}</h3>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} maxWidth="3xl" title={selected?.issuer}>
        {selected && (
          <div className="space-y-6">
            <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto border-b border-line px-6 pb-4">
              {certificates.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`chip shrink-0 cursor-pointer transition-colors ${
                    c.id === selected.id ? 'border-ink bg-ink text-paper' : 'hover:border-ink hover:text-ink'
                  }`}
                >
                  {c.date.substring(0, 4)} — <span className="inline-block max-w-[140px] truncate align-bottom">{formatTitle(c.title)}</span>
                </button>
              ))}
            </div>

            <div>
              <div className="eyebrow">{selected.date}</div>
              <h3 className="t-h2 mt-2">{formatTitle(selected.title)}</h3>
              {selected.description && <p className="t-body mt-3 max-w-2xl text-muted">{selected.description}</p>}
            </div>

            <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-line bg-[#f2f1ef] p-4 sm:p-8">
              {selected.image ? (
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="max-h-[60vh] w-auto max-w-full object-contain shadow-[0_24px_48px_-24px_rgba(0,0,0,0.35)]"
                />
              ) : (
                <div className="text-center text-faint">
                  <FiAward className="mx-auto mb-2 h-12 w-12" />
                  <p className="t-small">No document preview available</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
              <span className="eyebrow">ID · {selected.id}</span>
              <div className="flex items-center gap-2">
                {selected.image && (
                  <a href={selected.image} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                    Open full image
                  </a>
                )}
                {selected.credentialUrl && (
                  <a href={selected.credentialUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    Verify credential <FiArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};
