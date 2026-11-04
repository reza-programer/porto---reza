'use client';

import React, { useState } from 'react';
import { FiArrowUpRight, FiAward } from 'react-icons/fi';
import { Reveal } from '@/components/ui/Reveal';
import { Modal } from '@/components/ui/Modal';
import { MarkerText } from '@/components/ui/MarkerText';
import { formatTitle } from '@/lib/project-meta';
import type { Certificate } from '@/types';

interface CertificatesSectionProps {
  certificates: Certificate[];
}

const TILTS = [-1.5, 1, -0.5, 1.5, -1, 0.5];

/*
 * Front page of a small newspaper: a masthead, then each certificate as a
 * taped-down clipping with a black-and-white photo that colours in on hover.
 */
export const CertificatesSection: React.FC<CertificatesSectionProps> = ({ certificates }) => {
  const [selected, setSelected] = useState<Certificate | null>(null);
  const edition = certificates.reduce((max, c) => (c.date > max ? c.date : max), '').substring(0, 4);

  return (
    <section id="certificates" className="relative border-b-[3px] border-navy bg-leaf-soft text-navy">
      <div className="wrap py-20 sm:py-24">
        <Reveal>
          <div className="border-y-[3px] border-navy py-1">
            <div className="border-y border-navy px-2 py-5 text-center">
              <div className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.18em]">
                Vol. {edition} · Kuningan edition · {certificates.length} stories
              </div>
              <h2 className="t-marker mt-3">The Reza Times</h2>
              <div className="mt-1 -rotate-1 font-hand text-2xl font-semibold text-flame">certified, and still learning</div>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, i) => (
            <Reveal key={cert.id} delay={(i % 3) * 0.06}>
              <button
                onClick={() => setSelected(cert)}
                className="group relative block w-full cursor-pointer text-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:rotate-0!"
                style={{ rotate: `${TILTS[i % TILTS.length]}deg` }}
                aria-label={`View certificate: ${formatTitle(cert.title)}`}
              >
                <span aria-hidden className="absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 -rotate-3 border border-navy/15 bg-[#fff1a6]/85" />
                <article className="border-[3px] border-navy bg-[#fbfcfe] p-4 shadow-[6px_6px_0_#0c2340] transition-transform duration-300 group-hover:-translate-y-1">
                  <div className="flex items-center justify-between gap-3 border-b-2 border-navy pb-2 font-mono text-[0.62rem] font-bold uppercase">
                    <span className="truncate">{cert.issuer}</span>
                    <span className="shrink-0">{cert.date}</span>
                  </div>
                  <h3 className="mt-3 line-clamp-2 min-h-[2.5em] font-marker text-[1.2rem] uppercase leading-tight">
                    <MarkerText>{formatTitle(cert.title)}</MarkerText>
                  </h3>
                  <div className="mt-3 flex aspect-[4/3] items-center justify-center overflow-hidden border-2 border-navy bg-chalk p-3">
                    {cert.image ? (
                      <img
                        src={cert.image}
                        alt={cert.title}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain grayscale transition-[filter] duration-500 group-hover:grayscale-0"
                      />
                    ) : (
                      <FiAward className="h-10 w-10 text-navy/40" />
                    )}
                  </div>
                  {cert.description && (
                    <p className="mt-3 line-clamp-3 font-mono text-[0.7rem] leading-relaxed text-navy/75">{cert.description}</p>
                  )}
                  <span className="mt-3 inline-flex font-mono text-[0.66rem] font-bold uppercase text-ocean">Read the story →</span>
                </article>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} maxWidth="3xl" title={selected?.issuer}>
        {selected && (
          <div className="space-y-6 text-navy">
            <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto border-b-2 border-navy/15 px-6 pb-4">
              {certificates.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`shrink-0 cursor-pointer rounded-full border-2 border-navy px-3 py-1 font-mono text-[0.68rem] font-bold uppercase transition-colors ${
                    c.id === selected.id ? 'bg-ocean text-white' : 'bg-white hover:bg-chalk'
                  }`}
                >
                  {c.date.substring(0, 4)} — <span className="inline-block max-w-[140px] truncate align-bottom">{formatTitle(c.title)}</span>
                </button>
              ))}
            </div>

            <div>
              <div className="font-mono text-[0.7rem] font-bold uppercase text-ocean">{selected.date}</div>
              <h3 className="mt-2 font-marker text-3xl uppercase leading-tight"><MarkerText>{formatTitle(selected.title)}</MarkerText></h3>
              {selected.description && <p className="t-body mt-3 max-w-2xl text-navy/75">{selected.description}</p>}
            </div>

            <div className="flex min-h-[280px] items-center justify-center border-[3px] border-navy bg-chalk p-4 sm:p-8">
              {selected.image ? (
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="max-h-[60vh] w-auto max-w-full object-contain shadow-[0_24px_48px_-24px_rgba(12,35,64,0.45)]"
                />
              ) : (
                <div className="text-center text-navy/50">
                  <FiAward className="mx-auto mb-2 h-12 w-12" />
                  <p className="t-small">No document preview available</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-navy/15 pt-5">
              <span className="font-mono text-[0.68rem] font-bold uppercase text-navy/60">ID · {selected.id}</span>
              <div className="flex items-center gap-3">
                {selected.image && (
                  <a href={selected.image} target="_blank" rel="noopener noreferrer" className="btn-stamp btn-stamp-paper">
                    Open full image
                  </a>
                )}
                {selected.credentialUrl && (
                  <a href={selected.credentialUrl} target="_blank" rel="noopener noreferrer" className="btn-stamp btn-stamp-ocean">
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
