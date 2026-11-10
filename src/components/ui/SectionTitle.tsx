import React from 'react';

interface SectionTitleProps {
  no: string;
  /** Lines of the headline. */
  title: string[];
  note?: string;
  children?: React.ReactNode;
  className?: string;
}

/** "01 / SELECTED WORKS": italic numeral, a heavy headline, a short note and a rule. */
export function SectionTitle({ no, title, note, children, className = '' }: SectionTitleProps) {
  return (
    <div className={className}>
      <div className="numeral text-[clamp(2rem,3vw,2.6rem)] leading-none">{no} /</div>
      <h2 className="display wdth-100 mt-2 text-[clamp(2.4rem,4vw,3.6rem)]">
        {title.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>
      {note && <p className="mt-6 max-w-[15rem] text-[0.95rem] leading-relaxed opacity-70">{note}</p>}
      <span aria-hidden className="mt-8 block h-px w-12 bg-current opacity-50" />
      {children}
    </div>
  );
}
