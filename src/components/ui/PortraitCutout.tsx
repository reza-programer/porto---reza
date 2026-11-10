import React from 'react';

/** The cut-out portrait in black and white, over a tilted lime panel, with a thin orbit drawn across. */
export function PortraitCutout({ className = '', alt }: { className?: string; alt: string }) {
  return (
    <div className={`pointer-events-none relative ${className}`}>
      {/* Lime panel */}
      <div aria-hidden className="absolute left-[22%] top-[-4%] h-[112%] w-[46%] origin-bottom rotate-[18deg] bg-lime" />
      {/* Orbit behind */}
      <svg aria-hidden viewBox="0 0 600 300" className="absolute left-[-6%] top-[30%] w-[112%] -rotate-[14deg] overflow-visible">
        <ellipse cx="300" cy="150" rx="298" ry="96" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <img
        src="/images/profile-cutout.webp"
        alt={alt}
        draggable={false}
        className="relative mx-auto block h-full w-auto max-w-none object-contain object-bottom contrast-[1.1] grayscale"
      />
    </div>
  );
}
