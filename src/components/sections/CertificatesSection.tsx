'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import {
  FiAward,
  FiExternalLink,
  FiMaximize2,
  FiCalendar,
  FiBriefcase,
  FiFileText,
} from 'react-icons/fi';
import type { Certificate } from '@/types';

interface CertificatesSectionProps {
  certificates: Certificate[];
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({ certificates }) => {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  return (
    <AnimatedSection id="certificates" className="py-20 section-cream mesh-blob-1">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}
        >
          <SectionHeading
            title="Certificates & Badges"
            subtitle="Professional certifications and credentials I've earned."
          />
        </motion.div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <div
                onClick={() => setSelectedCert(cert)}
                className="flex flex-col h-full group cursor-pointer bg-white border border-[#E2DFD6] rounded-2xl overflow-hidden shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#CAD4C5] transition-all duration-250"
              >
                {/* Document Sheet Preview Box */}
                <div className="h-48 sm:h-52 bg-[#FAF9F5] flex items-center justify-center p-3 sm:p-4 relative border-b border-[#E8E5DC]">
                  {cert.image ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="max-w-full max-h-full object-contain rounded-md border border-[#E0DDD5] shadow-xs group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-xs flex items-center justify-center text-[#5c7254]">
                      <FiAward className="w-7 h-7" />
                    </div>
                  )}
                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-[#3B4D35]/90 backdrop-blur-xs text-white text-[11px] font-medium rounded-full shadow-xs opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1">
                    <span>Inspect</span>
                    <FiMaximize2 className="w-3 h-3" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#5c7254] mb-2">
                    <span className="px-2 py-0.5 bg-[#EEF3EC] text-[#3B4D35] rounded-md border border-[#DCE4DB] font-mono text-[10px]">
                      {cert.date.substring(0, 4)}
                    </span>
                    <span className="truncate text-slate-500">{cert.issuer}</span>
                  </div>

                  <h3 className="font-bold text-[#1E241C] text-base mb-2 group-hover:text-[#3b4d35] transition-colors line-clamp-2 leading-snug">
                    {cert.title}
                  </h3>

                  {cert.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                      {cert.description}
                    </p>
                  )}

                  <div className="mt-auto pt-3.5 border-t border-[#F0ECE1] flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 font-mono text-[11px]">
                      <FiCalendar className="w-3 h-3 text-[#5c7254]" />
                      {cert.date}
                    </span>

                    <span className="inline-flex items-center gap-1 font-semibold text-[#3b4d35] group-hover:gap-1.5 transition-all text-xs">
                      View Credential <FiMaximize2 className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Certificate Detailed Viewer Modal */}
      <Modal
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        maxWidth="2xl"
      >
        {selectedCert && (
          <div className="space-y-6 py-2">
            {/* Top Switcher Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-slate-100 scrollbar-none">
              {certificates.map((cert) => {
                const isActive = cert.id === selectedCert.id;
                const year = cert.date.substring(0, 4);
                return (
                  <button
                    key={cert.id}
                    onClick={() => setSelectedCert(cert)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                      isActive
                        ? 'bg-[#3b4d35] text-white shadow-xs'
                        : 'bg-[#edf1eb] text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{year} —</span>
                    <span className="max-w-[150px] truncate">{cert.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Certificate Header */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#edf1eb] border border-[#dce4db] text-[#3b4d35] flex items-center justify-center shrink-0 shadow-xs">
                <FiBriefcase className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f1ede4] text-[#3b4d35] border border-[#dce4db]">
                  📅 {selectedCert.date}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                  {selectedCert.title}
                </h3>
                <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                  <FiAward className="w-4 h-4 text-[#5c7254] shrink-0" />
                  {selectedCert.issuer}
                </p>
              </div>
            </div>

            {/* Document Description */}
            {selectedCert.description && (
              <div className="space-y-2 pt-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#3b4d35] flex items-center gap-1.5">
                  <FiFileText className="w-3.5 h-3.5" /> Certificate Document
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed bg-[#f8f6f0] p-4 rounded-xl border border-[#dce4db]">
                  {selectedCert.description}
                </p>
              </div>
            )}

            {/* Large Certificate Document Display */}
            <div className="space-y-2">
              <div className="relative bg-[#20261e] rounded-2xl border border-[#dce4db] overflow-hidden shadow-lg p-2 sm:p-4">
                <div className="bg-white rounded-xl overflow-hidden shadow-inner flex items-center justify-center min-h-[300px]">
                  {selectedCert.image ? (
                    <img
                      src={selectedCert.image}
                      alt={selectedCert.title}
                      className="w-full h-auto max-h-[500px] object-contain rounded-lg"
                    />
                  ) : (
                    <div className="p-12 text-center text-slate-400">
                      <FiAward className="w-16 h-16 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm font-medium">No document preview available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Action Links */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-400">
                Credential ID: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">{selectedCert.id}</code>
              </div>

              <div className="flex items-center gap-3">
                {selectedCert.image && (
                  <a
                    href={selectedCert.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors"
                  >
                    <FiMaximize2 className="w-3.5 h-3.5" /> Open Full Image
                  </a>
                )}

                {selectedCert.credentialUrl && (
                  <a
                    href={selectedCert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3b4d35] text-white rounded-lg text-xs font-semibold hover:bg-[#2d3a28] shadow-xs transition-colors"
                  >
                    Verify Credential <FiExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AnimatedSection>
  );
};
