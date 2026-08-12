'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiLock, FiArrowUpRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

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
        {/* Brand Logo */}
        <Link href="/#home" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-[#3b4d35] flex items-center justify-center text-[#f8f6f0] font-black text-lg shadow-xs group-hover:scale-105 transition-transform">
            R
          </div>
          <div>
            <span className="font-extrabold text-[#20261e] tracking-tight text-lg group-hover:text-[#5c7254] transition-colors">
              Reza<span className="text-[#5c7254]">.</span>
            </span>
            <span className="block text-[10px] font-semibold text-slate-400 -mt-1 tracking-wider uppercase">
              Developer
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
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-[#edf1eb] rounded-xl transition-colors"
            title="Admin Panel"
          >
            <FiLock className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <motion.button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 text-slate-700 bg-[#edf1eb] hover:bg-[#3b4d35] hover:text-white rounded-xl transition-colors shadow-sm"
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {mobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FiX className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FiMenu className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden max-w-sm mx-auto px-4 mt-3"
          >
            <div className="border border-[#dce4db] rounded-2xl p-3 shadow-2xl space-y-1.5 bg-[#f8f6f0]/98 backdrop-blur-xl">
              {navItems.map((item, index) => {
                const isActive = isHomePage && activeSection === item.href;
                const linkHref = getLinkHref(item.href);

                return (
                  <motion.a
                    key={item.name}
                    href={linkHref}
                    onClick={() => setMobileMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    className={`block px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-[#3b4d35] text-white shadow-md'
                        : 'text-slate-700 hover:bg-white hover:text-[#3b4d35] hover:shadow-sm'
                    }`}
                  >
                    {item.name}
                  </motion.a>
                );
              })}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: navItems.length * 0.05, duration: 0.2 }}
                className="pt-3 border-t border-slate-200 mt-2"
              >
                <a
                  href={getLinkHref('contact')}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-3 text-xs font-bold text-white bg-gradient-to-r from-[#3b4d35] to-[#5c7254] rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                >
                  Let's Talk
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
