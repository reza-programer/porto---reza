import React from 'react';

/**
 * Text set in the marker font, with each ampersand swapped for the
 * handwritten one: the marker font's own "&" reads like a plus sign.
 */
export const MarkerText: React.FC<{ children: string }> = ({ children }) => (
  <>
    {children.split('&').map((part, i) => (
      <React.Fragment key={i}>
        {i > 0 && <span className="font-hand normal-case">&amp;</span>}
        {part}
      </React.Fragment>
    ))}
  </>
);
