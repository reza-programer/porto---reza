import React from 'react';

/** Eight-armed asterisk with round ends. */
export function Asterisk({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round">
      <path d="M20 4v32M4 20h32M8.7 8.7l22.6 22.6M31.3 8.7 8.7 31.3" />
    </svg>
  );
}

/** Four-pointed star with curved sides, outlined. */
export function Sparkle({ className = 'h-6 w-6', filled = false }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1">
      <path d="M12 1c.6 6.2 4.8 10.4 11 11-6.2.6-10.4 4.8-11 11-.6-6.2-4.8-10.4-11-11 6.2-.6 10.4-4.8 11-11Z" />
    </svg>
  );
}

/** Thin crosshair, for the coordinates. */
export function Crosshair({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M12 0v24M0 12h24" />
    </svg>
  );
}

/** Any short text set round a turning circle, with something still in the middle. */
export function RingText({ text, children, className = 'h-32 w-32' }: { text: string; children?: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 100 100" className="spin-slow absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <path id="ring-text" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" />
        </defs>
        <text fontSize="9.6" fontWeight="500" letterSpacing="2.6" fill="currentColor">
          <textPath href="#ring-text">{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

/** "SCROLL DOWN" set round a circle that turns slowly, with an arrow in the middle. */
export function ScrollBadge({ href = '#projects', className = 'h-32 w-32' }: { href?: string; className?: string }) {
  return (
    <a href={href} aria-label="Scroll down" className={`group relative block ${className}`}>
      <svg viewBox="0 0 100 100" className="spin-slow absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <path id="scroll-ring" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" />
        </defs>
        <text fontSize="9.6" fontWeight="500" letterSpacing="2.6" fill="currentColor">
          <textPath href="#scroll-ring">SCROLL DOWN · SCROLL DOWN ·</textPath>
        </text>
      </svg>
      <svg
        viewBox="0 0 24 24"
        className="absolute left-1/2 top-1/2 h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 group-hover:rotate-45"
        aria-hidden
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <path d="M5 19 19 5M8 5h11v11" />
      </svg>
    </a>
  );
}
