'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface MacbookFrameProps {
  images: string[];
  alt?: string;
  className?: string;
  projectId?: string;
}

export const MacbookFrame: React.FC<MacbookFrameProps> = ({
  images,
  alt = 'Project Screenshot',
  className = '',
  projectId,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const validImages = images && images.length > 0 ? images : ['/images/projects/project1.svg'];

  // Auto slide images every 3.5 seconds
  useEffect(() => {
    if (validImages.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
    }, 3500);

    return () => clearInterval(interval);
  }, [validImages.length, isHovered]);

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  const ImageDisplay = (
    <div className="relative bg-slate-950 rounded-sm overflow-hidden group cursor-pointer">
      {/* Stacked images with crossfade */}
      <div className="relative w-full">
        {validImages.map((src, idx) => (
          <img
            key={src}
            src={src}
            alt={`${alt} ${idx + 1}`}
            className={`w-full h-auto block transition-opacity duration-700 ease-in-out ${
              idx === currentIndex
                ? 'relative opacity-100'
                : 'absolute inset-0 opacity-0 pointer-events-none'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows for Multi-image Gallery */}
      {validImages.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-slate-900/80 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-slate-900 transition-all shadow-md z-20"
            title="Previous image"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-900/80 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-slate-900 transition-all shadow-md z-20"
            title="Next image"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800/50 z-20">
            <div
              className="h-full bg-[#5c7254] transition-all duration-500 ease-out"
              style={{ width: `${((currentIndex + 1) / validImages.length) * 100}%` }}
            />
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-slate-900/70 backdrop-blur-md rounded-full z-20">
            {validImages.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-5 bg-[#5c7254]' : 'w-1.5 bg-slate-400/60 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div
      className={`relative w-full max-w-4xl mx-auto ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* MacBook Screen Bezel */}
      <div className="relative bg-slate-900 rounded-t-[1.2rem] p-2.5 sm:p-3 shadow-2xl border border-slate-800 border-b-0">
        {/* Top Bar with traffic lights */}
        <div className="flex items-center gap-1.5 mb-2 px-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />

          {/* Counter Tag */}
          {validImages.length > 1 && (
            <div className="ml-auto px-2.5 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-mono rounded-md border border-slate-700/60">
              {currentIndex + 1} / {validImages.length}
            </div>
          )}
        </div>

        {/* Screen Display — Clickable to project detail page if projectId provided */}
        {projectId ? (
          <Link href={`/projects/${projectId}`} className="block">
            {ImageDisplay}
          </Link>
        ) : (
          ImageDisplay
        )}
      </div>

      {/* MacBook Bottom Base / Lip */}
      <div className="relative mx-auto w-[106%] -ml-[3%] h-3 sm:h-4 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-500 rounded-b-xl shadow-lg flex justify-center border-t border-slate-300">
        <div className="w-16 sm:w-24 h-1 sm:h-1.5 bg-slate-500/60 rounded-b-md" />
      </div>
    </div>
  );
};
