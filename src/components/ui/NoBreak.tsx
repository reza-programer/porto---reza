import React from 'react';

/**
 * Keeps hyphenated words ("E-Commerce") on one line when a headline wraps.
 * Wraps them in nowrap spans rather than using U+2011, which the display
 * face doesn't have (it falls back to a thinner dash).
 */
export function NoBreak({ text }: { text: string }) {
  const parts = text.trim().replace(/‑/g, '-').split(/(\S+-\S+)/);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 ? (
          <span key={i} className="whitespace-nowrap">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}
