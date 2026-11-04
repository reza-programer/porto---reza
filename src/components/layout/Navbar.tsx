'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { no: '01', name: 'Work', href: 'projects' },
  { no: '02', name: 'Skills', href: 'skills' },
  { no: '03', name: 'Experience', href: 'experience' },
  { no: '04', name: 'Certificates', href: 'certificates' },
];

const sectionIds = ['home', ...navItems.map((i) => i.href), 'contact'];

export const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
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
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
      if (!isHomePage) return;

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
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b-[3px] border-navy bg-navy text-white transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_6px_20px_-8px_rgba(12,35,64,0.6)]' : ''
        }`}
      >
        <div className="wrap flex h-[61px] items-center justify-between gap-6">
          <Link href="/#home" className="flex items-baseline gap-3" onClick={() => setOpen(false)}>
            <span className="font-marker text-[1.45rem] leading-none">
              Reza<span className="text-flame">.</span>
            </span>
            <span className="hidden font-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-ice lg:inline">
              Fullstack &amp; QA
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            {navItems.map((item) => {
              const active = isHomePage && activeSection === item.href;
              return (
                <a
                  key={item.href}
                  href={hrefFor(item.href)}
                  className={`group relative font-mono text-[0.75rem] font-bold uppercase tracking-[0.06em] transition-colors ${
                    active ? 'text-white' : 'text-white/65 hover:text-white'
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-[3px] rounded-full bg-flame transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          <a
            href={hrefFor('contact')}
            className="hidden items-center gap-2 rounded-full border-2 border-white bg-flame px-4 py-2 font-mono text-[0.72rem] font-bold uppercase tracking-[0.04em] transition-transform duration-200 hover:-translate-y-0.5 md:inline-flex"
          >
            Contact <span aria-hidden>↗</span>
          </a>

          <button
            onClick={() => setOpen((v) => !v)}
            className="-mr-2 cursor-pointer p-2 font-mono text-[0.75rem] font-bold uppercase md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      {/* Mobile menu — kept outside <header> so the fixed panel is positioned
          against the viewport rather than the header. */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col justify-between bg-navy px-5 pb-8 pt-6 text-white transition-[opacity,visibility] duration-300 md:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <nav className="flex flex-col" aria-label="Mobile">
          {[...navItems, { no: '05', name: 'Contact', href: 'contact' }].map((item, i) => (
            <a
              key={item.href}
              href={hrefFor(item.href)}
              onClick={() => setOpen(false)}
              className="flex items-baseline justify-between border-b-2 border-white/15 py-4"
              style={{
                transition: 'transform 600ms cubic-bezier(0.16,1,0.3,1), opacity 600ms',
                transitionDelay: open ? `${i * 40}ms` : '0ms',
                transform: open ? 'none' : 'translateY(12px)',
                opacity: open ? 1 : 0,
              }}
            >
              <span className="font-marker text-[2rem] uppercase leading-none">{item.name}</span>
              <span className="font-mono text-xs tabular-nums text-ice">{item.no}</span>
            </a>
          ))}
        </nav>
        <div className="font-hand text-2xl text-ice">Kuningan, Indonesia</div>
      </div>
    </>
  );
};
