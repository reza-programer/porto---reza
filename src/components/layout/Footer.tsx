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
    <footer className="border-t border-line">
      <div className="wrap flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-[17px] font-semibold tracking-[-0.03em]">
            Reza<span className="text-accent">.</span>
          </div>
          <p className="t-small mt-1 text-muted">{profile.title}</p>
          <a href={`mailto:${profile.email}`} className="t-small link-draw mt-3 inline-block text-ink">
            {profile.email}
          </a>
        </div>
        <ul className="t-small flex flex-wrap gap-x-6 gap-y-2">
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-draw text-ink">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="wrap">
        <div className="t-small flex flex-col-reverse items-start justify-between gap-3 border-t border-line py-6 text-muted sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span className="flex items-center gap-5">
            <Link href="/admin/login" aria-label="Admin" className="text-line-strong transition-colors hover:text-ink">
              <FiLock className="h-3 w-3" />
            </Link>
            <a href="#" className="flex items-center gap-1.5 transition-colors hover:text-ink">
              Back to top <FiArrowUp className="h-3 w-3" />
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};
