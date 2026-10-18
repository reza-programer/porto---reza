'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiArrowUpRight } from 'react-icons/fi';

const navItems = [
  { no: '01', name: 'Work', href: 'projects' },
  { no: '02', name: 'About', href: 'about' },
  { no: '03', name: 'Skills', href: 'skills' },
  { no: '04', name: 'Experience', href: 'experience' },
  { no: '05', name: 'Certificates', href: 'certificates' },
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
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled || open ? 'border-b border-line bg-paper/85 backdrop-blur-md' : 'border-b border-transparent'
        }`}
      >
        <div className="wrap flex h-16 items-center justify-between gap-6">
          <Link href="/#home" className="group flex items-baseline gap-3" onClick={() => setOpen(false)}>
            <span className="text-[17px] font-semibold tracking-[-0.03em]">
              Reza<span className="text-accent">.</span>
            </span>
            <span className="eyebrow hidden lg:inline">Fullstack &amp; QA</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            {navItems.map((item) => {
              const active = isHomePage && activeSection === item.href;
              return (
                <a
                  key={item.href}
                  href={hrefFor(item.href)}
                  className={`t-small group relative font-medium transition-colors ${
                    active ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-ink transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          <div className="hidden items-center gap-5 md:flex">
            <a
              href={hrefFor('contact')}
              className="btn btn-primary group py-2.5"
            >
              Contact
              <FiArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="eyebrow -mr-2 cursor-pointer p-2 text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      {/* Mobile menu — kept outside <header>: the header's backdrop-filter would
          otherwise become the containing block for this fixed panel and clip it. */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col justify-between bg-paper px-5 pb-8 pt-6 transition-[opacity,visibility] duration-300 md:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <nav className="flex flex-col" aria-label="Mobile">
          {[...navItems, { no: '06', name: 'Contact', href: 'contact' }].map((item, i) => (
            <a
              key={item.href}
              href={hrefFor(item.href)}
              onClick={() => setOpen(false)}
              className="flex items-baseline justify-between border-b border-line py-4"
              style={{
                transition: 'transform 600ms cubic-bezier(0.16,1,0.3,1), opacity 600ms',
                transitionDelay: open ? `${i * 40}ms` : '0ms',
                transform: open ? 'none' : 'translateY(12px)',
                opacity: open ? 1 : 0,
              }}
            >
              <span className="t-h2">{item.name}</span>
              <span className="t-small tabular-nums text-faint">{item.no}</span>
            </a>
          ))}
        </nav>
        <div className="eyebrow">Kuningan, Indonesia</div>
      </div>
    </>
  );
};
