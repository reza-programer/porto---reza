'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex cursor-pointer items-center justify-center rounded-full font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50';

  const variants = {
    primary: 'bg-ink text-paper hover:bg-ink-2',
    secondary: 'bg-paper text-ink border border-line hover:border-ink',
    outline: 'border border-line-strong text-ink hover:border-ink',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-ink-2 hover:bg-paper hover:text-ink',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-4.5 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-[15px] gap-2.5',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
