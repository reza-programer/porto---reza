'use client';

import React from 'react';
import Link from 'next/link';
import { FiArrowRight, FiArrowUpRight, FiAward, FiBriefcase, FiFolder } from 'react-icons/fi';
import { PageHeader, useCollection } from '@/components/admin/AdminUI';
import type { Certificate, Experience, Project } from '@/types';

export default function AdminDashboardPage() {
  const projects = useCollection<Project>('/api/projects');
  const experience = useCollection<Experience>('/api/experience');
  const certificates = useCollection<Certificate>('/api/certificates');

  const stats = [
    { label: 'Proyek', count: projects.items.length, loading: projects.loading, href: '/admin/projects', icon: FiFolder },
    {
      label: 'Pengalaman',
      count: experience.items.length,
      loading: experience.loading,
      href: '/admin/experience',
      icon: FiBriefcase,
    },
    {
      label: 'Sertifikat',
      count: certificates.items.length,
      loading: certificates.loading,
      href: '/admin/certificates',
      icon: FiAward,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Kelola isi portofolio kamu."
        action={
          <Link href="/" target="_blank" className="btn btn-outline">
            Lihat website <FiArrowUpRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.href}
              href={s.href}
              className="group rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-line-strong"
            >
              <div className="flex items-center justify-between">
                <span className="t-small font-medium text-muted">{s.label}</span>
                <Icon className="h-4 w-4 text-faint" />
              </div>
              <div className="t-h1 mt-3 tabular-nums">{s.loading ? '–' : s.count}</div>
              <div className="t-small mt-3 flex items-center gap-1.5 text-muted transition-colors group-hover:text-ink">
                Kelola <FiArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <h2 className="t-h3">Cara mempublikasikan perubahan</h2>
        <ol className="t-body mt-3 list-decimal space-y-1.5 pl-5 text-muted">
          <li>Tambah atau ubah data di panel ini saat website dijalankan di komputer (localhost).</li>
          <li>Data tersimpan ke file di folder <code className="rounded bg-paper px-1 text-ink-2">src/data</code> dan gambar ke <code className="rounded bg-paper px-1 text-ink-2">public/uploads</code>.</li>
          <li>Commit &amp; push ke GitHub — rezatech.my.id akan ter-update otomatis dalam beberapa menit.</li>
        </ol>
      </div>
    </div>
  );
}
