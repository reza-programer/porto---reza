'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkle } from '@/components/ui/Glyphs';

const navItems = [
  { name: 'Work', href: 'projects' },
  { name: 'About', href: 'about' },
  { name: 'Stack', href: 'skills' },
  { name: 'Contact', href: 'contact' },
];

const sectionIds = ['home', ...navItems.map((i) => i.href)];

/** A plain bar under a hairline: wordmark left, links and a round button right. */
export const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!isHomePage) return;
    const handleScroll = () => {
      const pos = window.scrollY + window.innerHeight * 0.35;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section && section.offsetTop <= pos) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const hrefFor = (id: string) => (isHomePage ? `#${id}` : `/#${id}`);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/15 bg-sheet/90 backdrop-blur-md">
        <div className="wrap flex h-[72px] items-center justify-between gap-6">
          <Link href="/#home" onClick={() => setOpen(false)} className="display wdth-112 text-[1.55rem] leading-none tracking-[-0.04em]">
            Kezot.
          </Link>

          <div className="flex items-center gap-10">
            <nav className="hidden items-center gap-10 md:flex" aria-label="Primary">
              {navItems.map((item) => {
                const active = isHomePage && activeSection === item.href;
                return (
                  <a
                    key={item.href}
                    href={hrefFor(item.href)}
                    className={`relative text-[0.75rem] font-medium uppercase tracking-[0.06em] transition-opacity ${
                      active ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {item.name}
                    <span
                      aria-hidden
                      className={`absolute -bottom-1.5 left-0 h-px bg-ink transition-[width] duration-300 ${active ? 'w-full' : 'w-0'}`}
                    />
                  </a>
                );
              })}
            </nav>

            {/* Round button: the contact link on desktop, the menu on phones */}
            <a
              href={hrefFor('contact')}
              aria-label="Contact"
              className="hidden h-10 w-10 items-center justify-center rounded-full bg-ink text-sheet transition-colors hover:bg-lime hover:text-ink md:flex"
            >
              <Sparkle filled className="h-3.5 w-3.5" />
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors md:hidden ${
                open ? 'bg-lime text-ink' : 'bg-ink text-sheet'
              }`}
            >
              <Sparkle filled className={`h-3.5 w-3.5 transition-transform duration-500 ${open ? 'rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`fixed inset-x-0 bottom-0 top-[72px] z-40 flex flex-col justify-between bg-sheet px-5 pb-8 pt-6 transition-[opacity,visibility] duration-300 md:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <nav className="flex flex-col" aria-label="Mobile">
          {navItems.map((item, i) => (
            <a
              key={item.href}
              href={hrefFor(item.href)}
              onClick={() => setOpen(false)}
              className="flex items-baseline justify-between border-b border-ink/15 py-4"
              style={{
                transition: 'transform 600ms cubic-bezier(0.16,1,0.3,1), opacity 600ms',
                transitionDelay: open ? `${i * 45}ms` : '0ms',
                transform: open ? 'none' : 'translateY(12px)',
                opacity: open ? 1 : 0,
              }}
            >
              <span className="display wdth-112 text-[2.6rem]">{item.name}</span>
              <span className="numeral text-lg">0{i + 1}</span>
            </a>
          ))}
        </nav>
        <div className="label flex items-center justify-between text-ink/60">
          <span>Kuningan, Indonesia</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </>
  );
};
