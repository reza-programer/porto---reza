'use client';

import React from 'react';
import Link from 'next/link';
import { FiArrowUpRight, FiLayers } from 'react-icons/fi';

interface ProjectShowcaseProps {
  images: string[];
  alt: string;
  projectId?: string;
  badgeLabel?: string;
  onOpenLightbox?: (index: number) => void;
  className?: string;
  aspectRatio?: string;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({
  images,
  alt,
  projectId,
  badgeLabel,
  onOpenLightbox,
  className = '',
  aspectRatio = 'aspect-[16/10]',
}) => {
  const validImages = images && images.length > 0 ? images : ['/images/projects/project1.svg'];
  const mainImage = validImages[0];

  const handleScreenCountClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOpenLightbox) {
      onOpenLightbox(0);
    }
  };

  const content = (
    <div
      className={`relative ${aspectRatio} w-full overflow-hidden rounded-xl sm:rounded-2xl border border-[#E2DFD6] bg-[#F7F5EE] shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 ease-out cursor-pointer hover:border-[#8E9F88] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)]`}
    >
      {/* Crisp High-Res Screenshot */}
      <img
        src={mainImage}
        alt={alt}
        className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        loading="lazy"
      />

      {/* Subtle Matte Overlay on Hover */}
      <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />

      {/* Floating Screen Count Badge (Clickable to peek gallery) */}
      {validImages.length > 1 && (
        <button
          onClick={handleScreenCountClick}
          className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#D9D6CE] text-[11px] font-mono font-medium text-slate-700 shadow-2xs hover:bg-[#EEF3EC] hover:text-[#3B4D35] transition-all z-10 cursor-pointer"
          title="Quick preview gallery"
        >
          <FiLayers className="w-3 h-3 text-[#5C7254]" />
          <span>{validImages.length} screens</span>
        </button>
      )}

      {/* Floating Category Badge if provided */}
      {badgeLabel && (
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#1E241C]/80 backdrop-blur-md text-[10px] font-mono font-semibold tracking-wider text-white uppercase shadow-2xs">
          {badgeLabel}
        </div>
      )}

      {/* Hover Explore Pill */}
      <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-[#3B4D35] px-3.5 py-1.5 text-xs font-semibold text-white opacity-0 backdrop-blur-md transition-all duration-250 transform translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 shadow-md">
        <span>View Project</span>
        <FiArrowUpRight className="w-3.5 h-3.5" />
      </div>
    </div>
  );

  if (projectId) {
    return (
      <div className={`relative group ${className}`}>
        <Link href={`/projects/${projectId}`} className="block">
          {content}
        </Link>
      </div>
    );
  }

  return <div className={`relative group ${className}`}>{content}</div>;
};
