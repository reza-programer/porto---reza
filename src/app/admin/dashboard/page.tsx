'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { FiFolder, FiBriefcase, FiAward, FiMessageSquare, FiArrowRight } from 'react-icons/fi';
import type { Project, Experience, Certificate, ContactMessage } from '@/types';

export default function AdminDashboardPage() {
  const [projectsCount, setProjectsCount] = useState(0);
  const [experienceCount, setExperienceCount] = useState(0);
  const [certificatesCount, setCertificatesCount] = useState(0);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, expRes, certRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/experience'),
          fetch('/api/certificates'),
        ]);

        const projData: Project[] = await projRes.json();
        const expData: Experience[] = await expRes.json();
        const certData: Certificate[] = await certRes.json();

        setProjectsCount(projData.length);
        setExperienceCount(expData.length);
        setCertificatesCount(certData.length);
      } catch (err) {
        console.error('Failed to load dashboard counts', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-1">
          Welcome to your portfolio management console.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Projects
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-2">
              {loading ? '...' : projectsCount}
            </div>
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline mt-4"
            >
              Manage Projects <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 text-blue-600">
            <FiFolder className="w-8 h-8" />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Experience
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-2">
              {loading ? '...' : experienceCount}
            </div>
            <Link
              href="/admin/experience"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline mt-4"
            >
              Manage Experience <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-4 rounded-xl bg-indigo-50 text-indigo-600">
            <FiBriefcase className="w-8 h-8" />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Certificates
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-2">
              {loading ? '...' : certificatesCount}
            </div>
            <Link
              href="/admin/certificates"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline mt-4"
            >
              Manage Certificates <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600">
            <FiAward className="w-8 h-8" />
          </div>
        </Card>
      </div>

      {/* Quick Action Panels */}
      <Card>
        <h3 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/projects"
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-center gap-3 text-slate-700 font-medium text-sm"
          >
            <FiFolder className="w-5 h-5 text-blue-600" /> Add New Project
          </Link>

          <Link
            href="/admin/experience"
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-center gap-3 text-slate-700 font-medium text-sm"
          >
            <FiBriefcase className="w-5 h-5 text-indigo-600" /> Add Work Experience
          </Link>

          <Link
            href="/admin/certificates"
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-center gap-3 text-slate-700 font-medium text-sm"
          >
            <FiAward className="w-5 h-5 text-emerald-600" /> Add Certificate
          </Link>
        </div>
      </Card>
    </div>
  );
}
