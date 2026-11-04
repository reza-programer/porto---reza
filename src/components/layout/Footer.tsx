import React from 'react';
import Link from 'next/link';
import { FiArrowUp, FiLock } from 'react-icons/fi';
import type { Profile } from '@/types';

interface FooterProps {
  profile: Profile;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  const socials = [
    { label: 'GitHub', href: profile.socialLinks.github },
    { label: 'LinkedIn', href: profile.socialLinks.linkedin },
    { label: 'Instagram', href: profile.socialLinks.instagram },
    { label: 'Twitter', href: profile.socialLinks.twitter },
  ].filter((s) => !!s.href);

  return (
    <footer className="bg-[#081a31] text-white">
      <div className="wrap flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="font-marker text-3xl leading-none">
            Reza<span className="text-flame">.</span>
          </div>
          <p className="mt-2 font-mono text-[0.75rem] uppercase text-ice">{profile.title}</p>
          <a href={`mailto:${profile.email}`} className="link-draw mt-3 inline-block font-mono text-sm">
            {profile.email}
          </a>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.78rem] font-bold uppercase">
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-draw">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="wrap">
        <div className="flex flex-col-reverse items-start justify-between gap-3 border-t-2 border-white/15 py-6 font-mono text-[0.72rem] uppercase text-white/60 sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span className="flex items-center gap-5">
            <Link href="/admin/login" aria-label="Admin" className="text-white/30 transition-colors hover:text-white">
              <FiLock className="h-3 w-3" />
            </Link>
            <a href="#" className="flex items-center gap-1.5 transition-colors hover:text-white">
              Back to top <FiArrowUp className="h-3 w-3" />
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};
