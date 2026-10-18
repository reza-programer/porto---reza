import React from 'react';

interface MacbookFrameProps {
  src: string;
  alt: string;
  label?: string;
  eager?: boolean;
  className?: string;
}

const DOCK_ICONS = ['#3a3a3a', '#6b6b6b', '#9a9a9a', '#cfcfcf', '#5a5a5a'];

/**
 * A CSS laptop mockup. The 16:10 screen shows a minimal desktop with a browser
 * window; the screenshot sits in that window at its own ~2.08:1 aspect with
 * object-contain, so it is never cropped. Every size inside uses container
 * units (cqw) so the whole device scales with its column.
 */
export const MacbookFrame: React.FC<MacbookFrameProps> = ({ src, alt, label, eager = false, className = '' }) => {
  return (
    <div className={`@container relative w-full select-none ${className}`}>
      {/* Lid */}
      <div className="relative mx-auto w-[88cqw] rounded-t-[2.4cqw] bg-[#111] p-[1.5cqw] pb-[1.1cqw] shadow-[0_0_0_0.3cqw_#cfd0d2,0_0_0_0.36cqw_#a9abae]">
        <span className="absolute left-1/2 top-[0.5cqw] h-[0.55cqw] w-[0.55cqw] -translate-x-1/2 rounded-full bg-[#2b2b2b]" />

        {/* Screen */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-[0.5cqw] bg-[radial-gradient(130%_90%_at_50%_0%,#f5f5f4_0%,#e2e2df_55%,#cfcfcb_100%)]">
          {/* Menu bar */}
          <div className="absolute inset-x-0 top-0 flex h-[1.7cqw] items-center gap-[1.1cqw] bg-white/70 px-[1.4cqw]">
            <span className="h-[0.75cqw] w-[0.75cqw] rounded-full bg-ink" />
            <span className="h-[0.45cqw] w-[3.2cqw] rounded-full bg-ink/40" />
            <span className="h-[0.45cqw] w-[2.4cqw] rounded-full bg-ink/25" />
            <span className="h-[0.45cqw] w-[2.8cqw] rounded-full bg-ink/25" />
            <span className="ml-auto h-[0.45cqw] w-[4cqw] rounded-full bg-ink/25" />
          </div>

          {/* Browser window */}
          <div className="absolute left-[2.6cqw] right-[2.6cqw] top-[3cqw] overflow-hidden rounded-[0.7cqw] bg-white shadow-[0_1.2cqw_2.4cqw_-0.6cqw_rgba(0,0,0,0.28),0_0_0_0.08cqw_rgba(0,0,0,0.08)]">
            <div className="flex h-[2.6cqw] items-center gap-[0.55cqw] border-b border-black/[0.06] bg-[#f6f6f5] px-[1.1cqw]">
              <span className="h-[0.7cqw] w-[0.7cqw] rounded-full bg-[#d0d0cd]" />
              <span className="h-[0.7cqw] w-[0.7cqw] rounded-full bg-[#d0d0cd]" />
              <span className="h-[0.7cqw] w-[0.7cqw] rounded-full bg-[#d0d0cd]" />
              <span className="mx-auto flex h-[1.5cqw] w-[38%] items-center justify-center truncate rounded-[0.45cqw] bg-white px-[1cqw] text-[0.95cqw] leading-none text-faint shadow-[0_0_0_0.08cqw_rgba(0,0,0,0.07)]">
                {label}
              </span>
              <span className="w-[2.9cqw]" />
            </div>
            <div className="aspect-[1920/920] bg-white">
              <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} draggable={false} className="h-full w-full object-contain" />
            </div>
          </div>

          {/* Dock */}
          <div className="absolute bottom-[1.3cqw] left-1/2 flex -translate-x-1/2 items-center gap-[0.6cqw] rounded-[1.1cqw] border border-white/70 bg-white/45 p-[0.6cqw] shadow-[0_0.4cqw_1.2cqw_rgba(0,0,0,0.12)] backdrop-blur-sm">
            {DOCK_ICONS.map((c, i) => (
              <span key={i} className="h-[2.6cqw] w-[2.6cqw] rounded-[0.7cqw]" style={{ background: c }} />
            ))}
          </div>

          {/* Glass reflection */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_38%)]" />
        </div>
      </div>

      {/* Hinge */}
      <div className="mx-auto h-[0.55cqw] w-[88cqw] bg-[linear-gradient(to_bottom,#2a2a2a,#5b5c5e)]" />

      {/* Base */}
      <div className="relative mx-auto h-[2.3cqw] w-full rounded-b-[1.6cqw] rounded-t-[0.25cqw] bg-[linear-gradient(to_bottom,#eceded_0%,#cfd1d3_45%,#a8aaad_100%)] shadow-[inset_0_0.12cqw_0_rgba(255,255,255,0.8)]">
        <span className="absolute left-1/2 top-0 h-[0.85cqw] w-[15cqw] -translate-x-1/2 rounded-b-[0.9cqw] bg-[linear-gradient(to_bottom,#b4b6b9,#d6d8da)]" />
      </div>

      {/* Contact shadow */}
      <div aria-hidden className="pointer-events-none mx-auto -mt-[0.6cqw] h-[2.4cqw] w-[84cqw] rounded-[50%] bg-black/25 blur-[1.4cqw]" />
    </div>
  );
};
