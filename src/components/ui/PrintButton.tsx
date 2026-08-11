'use client';

import React from 'react';
import { FiPrinter } from 'react-icons/fi';

export const PrintButton: React.FC = () => {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-5 py-2 bg-[#3b4d35] text-white font-bold text-sm rounded-xl shadow-sm hover:bg-[#2d3a28] transition-colors"
    >
      <FiPrinter className="w-4 h-4" /> Print / Save as PDF
    </button>
  );
};
