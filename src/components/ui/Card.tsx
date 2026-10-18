'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverEffect = true, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-line bg-surface p-6 ${
        hoverEffect ? 'transition-colors duration-300 hover:border-line-strong' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
