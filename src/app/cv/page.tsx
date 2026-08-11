import React from 'react';
import Link from 'next/link';
import { getProfile, getExperience, getCertificates, getProjects } from '@/lib/data';
import { PrintButton } from '@/components/ui/PrintButton';
import { FiArrowLeft, FiMail, FiPhone, FiMapPin, FiGlobe, FiCheckCircle } from 'react-icons/fi';

export const metadata = {
  title: 'Curriculum Vitae - Reza',
  description: 'Online Resume & Curriculum Vitae of Reza Musthofa',
};

export default function CVPage() {
  const profile = getProfile();
  const experiences = getExperience();
  const certificates = getCertificates();
  const projects = getProjects();

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 font-sans antialiased text-slate-800">
      {/* Print & Back Controls (hidden on print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 shadow-xs hover:bg-slate-50 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" /> Back to Portfolio
        </Link>

        <PrintButton />
      </div>

      {/* CV Paper Document */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-12 print:shadow-none print:border-none print:p-0">
        {/* Header */}
        <div className="border-b border-slate-200 pb-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {profile.name}
            </h1>
            <p className="text-lg font-semibold text-[#5c7254] mt-1">
              {profile.title}
            </p>
            <p className="text-slate-600 text-sm mt-3 max-w-xl leading-relaxed">
              {profile.bio}
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-2 text-sm text-slate-600 shrink-0 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2.5">
              <FiMail className="w-4 h-4 text-[#5c7254]" />
              <span>{profile.email}</span>
            </div>
            {profile.phone && (
              <div className="flex items-center gap-2.5">
                <FiPhone className="w-4 h-4 text-[#5c7254]" />
                <span>{profile.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2.5">
              <FiMapPin className="w-4 h-4 text-[#5c7254]" />
              <span>{profile.location}</span>
            </div>
            {profile.socialLinks?.github && (
              <div className="flex items-center gap-2.5">
                <FiGlobe className="w-4 h-4 text-[#5c7254]" />
                <span className="truncate max-w-[200px]">{profile.socialLinks.github}</span>
              </div>
            )}
          </div>
        </div>

        {/* Experience Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 border-b-2 border-[#5c7254] pb-1.5 mb-4 uppercase tracking-wider text-xs">
            Work Experience
          </h2>

          <div className="space-y-6">
            {experiences.map((exp) => (
              <div key={exp.id} className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="font-bold text-slate-900 text-base">{exp.title}</h3>
                  <span className="text-xs font-semibold text-[#5c7254] bg-[#edf1eb] px-2.5 py-0.5 rounded-md w-fit">
                    {exp.period}
                  </span>
                </div>
                <div className="text-sm font-semibold text-slate-700">
                  {exp.company} {exp.location ? `• ${exp.location}` : ''}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {exp.description}
                </p>
                {exp.skills && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.skills.map((s) => (
                      <span key={s} className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Featured Projects */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 border-b-2 border-[#5c7254] pb-1.5 mb-4 uppercase tracking-wider text-xs">
            Key Projects
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.slice(0, 4).map((p) => (
              <div key={p.id} className="p-3.5 border border-slate-200 rounded-xl bg-slate-50/60">
                <h3 className="font-bold text-slate-900 text-sm mb-1">{p.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {p.tags.map((t) => (
                    <span key={t} className="text-[10px] bg-white border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Skills */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 border-b-2 border-[#5c7254] pb-1.5 mb-4 uppercase tracking-wider text-xs">
            Technical Skills &amp; Tools
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {profile.skills?.map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <h3 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">
                  {cat.category}
                </h3>
                <ul className="space-y-1 text-sm text-slate-600">
                  {cat.skills.map((s) => (
                    <li key={s.name} className="flex items-center gap-1.5">
                      <FiCheckCircle className="w-3.5 h-3.5 text-[#5c7254] shrink-0" />
                      <span>{s.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 border-b-2 border-[#5c7254] pb-1.5 mb-4 uppercase tracking-wider text-xs">
            Certifications
          </h2>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
            {certificates.map((cert) => (
              <li key={cert.id} className="flex items-start gap-2">
                <span className="text-[#5c7254] font-bold">•</span>
                <div>
                  <span className="font-semibold text-slate-900">{cert.title}</span>
                  <div className="text-xs text-slate-500">{cert.issuer} ({cert.date})</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
