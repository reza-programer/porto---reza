'use client';

import React from 'react';
import { FiPrinter } from 'react-icons/fi';

export const PrintButton: React.FC = () => {
  return (
    <button
      onClick={() => window.print()}
      className="btn btn-primary py-2.5"
    >
      <FiPrinter className="h-3.5 w-3.5" /> Print / Save as PDF
    </button>
  );
};
