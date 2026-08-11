'use client';

import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  centered = true,
  light = false,
}) => {
  return (
    <div className={`mb-14 ${centered ? 'text-center' : ''}`}>
      <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight ${light ? 'text-[#f8f6f0]' : 'text-[#20261e]'}`}>
        {title}
      </h2>
      <div className={`w-14 h-1.5 bg-gradient-to-r from-[#5c7254] to-[#3b4d35] rounded-full mt-4 ${centered ? 'mx-auto' : ''}`} />
      {subtitle && (
        <p className={`mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${light ? 'text-slate-300' : 'text-slate-500'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
