'use client';

import React from 'react';

export const PrintButton: React.FC = () => {
  return (
    <button onClick={() => window.print()} className="btn-ink h-10">
      Print / PDF ↓
    </button>
  );
};
