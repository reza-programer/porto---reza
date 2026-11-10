import React from 'react';
import Link from 'next/link';
import { FiLock } from 'react-icons/fi';
import type { Profile } from '@/types';

/** One line under a hairline: copyright, socials, and the way to get in touch. */
export const Footer: React.FC<{ profile: Profile }> = ({ profile }) => {
  const socials = [
    { label: 'GitHub', href: profile.socialLinks.github },
    { label: 'LinkedIn', href: profile.socialLinks.linkedin },
    { label: 'Instagram', href: profile.socialLinks.instagram },
    { label: 'Twitter', href: profile.socialLinks.twitter },
  ].filter((s) => !!s.href);

  return (
    <footer className="border-t border-ink/15 bg-sheet text-ink">
      <div className="wrap flex flex-col gap-5 py-7 text-[0.78rem] sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-4 text-ink/70">
          © {new Date().getFullYear()} KEZOT. All rights reserved.
          <Link href="/admin/login" aria-label="Admin" className="text-ink/30 transition-colors hover:text-ink">
            <FiLock className="h-3 w-3" />
          </Link>
        </span>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-ink/70">
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <a href={`mailto:${profile.email}`} className="group flex items-center gap-3 font-medium">
          Let&apos;s work together
          <span aria-hidden className="text-base transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>
    </footer>
  );
};
