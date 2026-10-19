'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { FiGrid, FiFolder, FiBriefcase, FiAward, FiLogOut, FiArrowUpRight } from 'react-icons/fi';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: FiGrid },
  { name: 'Proyek', href: '/admin/projects', icon: FiFolder },
  { name: 'Pengalaman', href: '/admin/experience', icon: FiBriefcase },
  { name: 'Sertifikat', href: '/admin/certificates', icon: FiAward },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // The login page renders without the admin chrome.
  if (pathname === '/admin/login') {
    return <div className="admin-theme">{children}</div>;
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <span className="t-small animate-pulse text-muted">Memuat sesi…</span>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper p-5">
        <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8 text-center">
          <h2 className="t-h3">Akses ditolak</h2>
          <p className="t-body mt-1 text-muted">Silakan masuk untuk membuka panel admin.</p>
          <Link href="/admin/login" className="btn btn-primary mt-6 w-full">
            Ke halaman masuk
          </Link>
        </div>
      </div>
    );
  }

  const email = session?.user?.email || session?.user?.name || 'admin';

  return (
    <div className="admin-theme min-h-screen bg-paper md:flex">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-surface md:flex">
        <div className="flex h-16 items-center gap-2 px-5">
          <Link href="/" className="text-[17px] font-semibold tracking-[-0.03em]">
            Reza<span className="text-faint">.</span>
          </Link>
          <span className="t-small rounded-md bg-paper px-1.5 py-0.5 font-medium text-muted">Admin</span>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`t-small flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition-colors ${
                  active ? 'bg-ink text-paper' : 'text-muted hover:bg-paper hover:text-ink'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-line p-3">
          <div className="flex items-center gap-3 px-3 py-2">
            <img src="/images/profile.png" alt="" className="h-8 w-8 rounded-full object-cover object-[50%_15%]" />
            <span className="t-small min-w-0 truncate text-muted">{email}</span>
          </div>
          <Link
            href="/"
            target="_blank"
            className="t-small flex items-center gap-3 rounded-lg px-3 py-2 text-muted transition-colors hover:bg-paper hover:text-ink"
          >
            <FiArrowUpRight className="h-4 w-4 shrink-0" />
            Lihat website
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="t-small flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-muted transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <FiLogOut className="h-4 w-4 shrink-0" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Top bar (mobile) */}
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur md:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/" className="text-[17px] font-semibold tracking-[-0.03em]">
            Reza<span className="text-faint">.</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="icon-btn"
            aria-label="Keluar"
          >
            <FiLogOut className="h-4 w-4" />
          </button>
        </div>
        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`t-small shrink-0 rounded-full px-3 py-1.5 font-medium ${
                  active ? 'bg-ink text-paper' : 'text-muted'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 md:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
