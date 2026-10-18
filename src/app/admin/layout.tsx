'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { FiGrid, FiFolder, FiBriefcase, FiAward, FiLogOut, FiArrowUpRight } from 'react-icons/fi';

const sidebarNavItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: FiGrid },
  { name: 'Projects', href: '/admin/projects', icon: FiFolder },
  { name: 'Experience', href: '/admin/experience', icon: FiBriefcase },
  { name: 'Certificates', href: '/admin/certificates', icon: FiAward },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // If viewing login page, don't show admin sidebar/layout
  if (pathname === '/admin/login') {
    return <div className="admin-theme">{children}</div>;
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <span className="eyebrow animate-pulse">Loading session…</span>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper p-4">
        <div className="w-full max-w-sm border-t border-ink pt-6">
          <div className="eyebrow">401</div>
          <h2 className="mt-3 text-3xl font-medium tracking-[-0.03em]">Access denied</h2>
          <p className="mt-2 text-[15px] text-muted">Please log in to access the admin panel.</p>
          <Link
            href="/admin/login"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink-2"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-theme flex min-h-screen bg-paper">
      <aside className="flex w-64 shrink-0 flex-col border-r border-line bg-surface">
        <div className="flex h-16 items-center justify-between border-b border-line px-6">
          <span className="text-[17px] font-semibold tracking-[-0.03em]">
            Reza<span className="text-accent">.</span>
          </span>
          <span className="eyebrow">Admin</span>
        </div>

        <nav className="flex-1 space-y-0.5 p-3">
          {sidebarNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive ? 'bg-ink text-paper' : 'text-muted hover:bg-paper hover:text-ink'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-line p-3">
          <div className="eyebrow truncate px-3 py-2">{session?.user?.email || session?.user?.name || 'admin'}</div>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-paper hover:text-ink"
          >
            <FiArrowUpRight className="h-4 w-4 shrink-0" />
            View live site
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <FiLogOut className="h-4 w-4 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="max-h-screen flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
