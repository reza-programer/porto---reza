'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiLock, FiArrowUpRight } from 'react-icons/fi';

const navItems = [
  { name: 'Home', href: 'home' },
  { name: 'Projects', href: 'projects' },
  { name: 'About', href: 'about' },
  { name: 'Skills', href: 'skills' },
  { name: 'Experience', href: 'experience' },
  { name: 'Certificates', href: 'certificates' },
];

export const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (!isHomePage) return;

      const sections = ['home', 'projects', 'about', 'skills', 'experience', 'certificates', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const getLinkHref = (sectionId: string) => {
    return isHomePage ? `#${sectionId}` : `/#${sectionId}`;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? 'py-3 bg-[#faf9f5]/95 border-b border-[#dce4db] shadow-xs' : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo - Personal Avatar Mark */}
        <Link href="/#home" className="flex items-center gap-3 group">
          <div className="relative shrink-0">
            <img
              src="/images/profile.png"
              alt="Mohamad Reza Nurpadilah"
              className="w-10 h-10 rounded-full object-cover object-top border border-[#DCE4DB] ring-2 ring-white shadow-xs group-hover:scale-105 transition-transform"
            />
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"
              title="Available for projects"
            />
          </div>
          <div>
            <span className="font-extrabold text-[#20261e] tracking-tight text-base group-hover:text-[#5c7254] transition-colors">
              Reza<span className="text-[#5c7254]">.</span>
            </span>
            <span className="block text-[10px] font-semibold text-slate-500 -mt-0.5 tracking-wider uppercase">
              Fullstack & QA
            </span>
          </div>
        </Link>

        {/* Nav Items */}
        <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-2xl bg-[#edf1eb] border border-[#dce4db]">
          {navItems.map((item) => {
            const isActive = isHomePage && activeSection === item.href;
            const linkHref = getLinkHref(item.href);

            return (
              <a
                key={item.name}
                href={linkHref}
                className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-[#3b4d35] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {item.name}
              </a>
            );
          })}
        </nav>

        {/* Action */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={getLinkHref('contact')}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#3b4d35] hover:bg-[#2d3a28] text-white text-xs font-bold rounded-full shadow-xs transition-all"
          >
            Let's Talk <FiArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <Link
            href="/admin/login"
            className="p-2 opacity-0 hover:opacity-100 text-slate-400 hover:text-slate-700 hover:bg-[#edf1eb] rounded-xl transition-all"
            title="Admin Panel"
            aria-hidden="true"
          >
            <FiLock className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 text-slate-700 bg-[#edf1eb] hover:bg-[#3b4d35] hover:text-white rounded-xl transition-colors duration-150 shadow-xs cursor-pointer"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? (
            <FiX className="w-6 h-6" />
          ) : (
            <FiMenu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Nav - Full Screen Smooth Minimal Overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden bg-[#FAF9F5] flex flex-col justify-between p-6 sm:p-8 transition-opacity duration-200 ease-in-out ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-5 border-b border-[#E8E5DC]">
          <Link
            href="/#home"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="relative shrink-0">
              <img
                src="/images/profile.png"
                alt="Reza"
                className="w-10 h-10 rounded-full object-cover object-top border border-[#DCE4DB] ring-2 ring-white shadow-xs"
              />
              <span
                className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"
                title="Available"
              />
            </div>
            <div>
              <span className="font-extrabold text-[#20261e] tracking-tight text-lg">
                Reza<span className="text-[#5c7254]">.</span>
              </span>
              <span className="block text-[11px] font-semibold text-slate-500 -mt-0.5 tracking-wider uppercase">
                Fullstack & QA
              </span>
            </div>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2.5 bg-white hover:bg-[#EEF3EC] text-slate-700 rounded-full border border-[#DCE4DB] transition-colors cursor-pointer shadow-xs"
            aria-label="Close menu"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links - Clean Minimal Typography */}
        <div className="flex flex-col justify-center flex-1 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = isHomePage && activeSection === item.href;
            const linkHref = getLinkHref(item.href);

            return (
              <a
                key={item.name}
                href={linkHref}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between py-4 px-2 border-b border-[#F0ECE1] transition-colors ${
                  isActive
                    ? 'text-[#3B4D35] font-bold'
                    : 'text-[#1E241C] hover:text-[#5C7254] font-semibold'
                }`}
              >
                <span className="text-2xl tracking-tight">
                  {item.name}
                </span>
                {isActive ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3B4D35]" />
                ) : (
                  <FiArrowUpRight className="w-5 h-5 text-slate-300" />
                )}
              </a>
            );
          })}
        </div>

        {/* Bottom Footer Section */}
        <div className="pt-5 border-t border-[#E8E5DC] space-y-4">
          <a
            href={getLinkHref('contact')}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#3B4D35] hover:bg-[#2D3A28] text-white text-base font-semibold rounded-full shadow-xs transition-colors"
          >
            <span>Let's Talk</span>
            <FiArrowUpRight className="w-4 h-4" />
          </a>

          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>📍 Kuningan, Indonesia</span>
            <span className="text-[#5C7254] font-semibold">● Open for Work</span>
          </div>
        </div>
      </div>
    </header>
  );
};
