import React from 'react';
import { Reveal } from '@/components/ui/Reveal';

interface SectionHeaderProps {
  index: string;
  label: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  aside?: React.ReactNode;
}

/** Section opener: hairline, numbered label, title and an optional intro. */
export const SectionHeader: React.FC<SectionHeaderProps> = ({ index, label, title, intro, aside }) => {
  return (
    <div className="mb-12 flex flex-col gap-6 border-t border-line pt-6 sm:mb-14 md:flex-row md:items-end md:justify-between">
      <Reveal>
        <div className="eyebrow">
          <span className="text-ink">{index}</span> — {label}
        </div>
        <h2 className="t-h2 mt-3 max-w-3xl">{title}</h2>
        {intro && <p className="t-lead mt-3 max-w-xl text-muted">{intro}</p>}
      </Reveal>
      {aside && <Reveal delay={0.05}>{aside}</Reveal>}
    </div>
  );
};
