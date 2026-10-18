import React from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { getProfile, getExperience, getCertificates, getProjects } from '@/lib/data';
import { formatTags, formatTitle } from '@/lib/project-meta';
import { PrintButton } from '@/components/ui/PrintButton';

export const metadata = {
  title: 'Curriculum Vitae — Mohamad Reza Nurpadilah',
  description: 'Online Resume & Curriculum Vitae of Mohamad Reza Nurpadilah',
};

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="eyebrow col-span-12 text-ink md:col-span-3 print:col-span-3">{children}</h2>;
}

export default function CVPage() {
  const profile = getProfile();
  const experiences = getExperience();
  const certificates = getCertificates();
  const projects = getProjects();

  const contacts = [
    profile.email,
    profile.phone,
    profile.location,
    profile.socialLinks?.github?.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-paper px-4 py-6 sm:px-6 sm:py-10 print:bg-white print:p-0">
      <div className="mx-auto mb-6 flex max-w-4xl items-center justify-between print:hidden">
        <Link href="/" className="eyebrow group inline-flex items-center gap-2 transition-colors hover:text-ink">
          <FiArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" /> Back to portfolio
        </Link>
        <PrintButton />
      </div>

      <article className="mx-auto max-w-4xl rounded-2xl border border-line bg-surface p-7 shadow-[0_40px_80px_-50px_rgba(0,0,0,0.25)] sm:p-12 print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none">
        {/* Header */}
        <header className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-5">
            <img
              src={profile.avatar || '/images/profile.png'}
              alt={profile.name}
              className="h-20 w-20 shrink-0 rounded-xl object-cover object-[50%_18%]"
            />
            <div>
              <h1 className="t-h2">{profile.name}</h1>
              <p className="t-body mt-1 text-muted">{profile.title}</p>
            </div>
          </div>
          <ul className="t-small space-y-0.5 text-ink-2 sm:text-right">
            {contacts.map((c) => (
              <li key={c} className="truncate">
                {c}
              </li>
            ))}
          </ul>
        </header>

        <p className="t-body border-b border-line py-6 text-ink-2">{profile.bio}</p>

        {/* Experience */}
        <section className="grid grid-cols-12 gap-x-6 gap-y-4 border-b border-line py-8">
          <Heading>Experience</Heading>
          <div className="col-span-12 space-y-7 md:col-span-9 print:col-span-9">
            {experiences.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                  <h3 className="t-h3">{exp.title}</h3>
                  <span className="t-small text-muted">{exp.period}</span>
                </div>
                <div className="t-small text-ink-2">
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ''}
                </div>
                <p className="t-small mt-2 text-muted">{exp.description}</p>
                {exp.skills?.length > 0 && (
                  <p className="t-small mt-2 text-ink-2">{formatTags(exp.skills).join(' · ')}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="grid grid-cols-12 gap-x-6 gap-y-4 border-b border-line py-8">
          <Heading>Key projects</Heading>
          <div className="col-span-12 grid gap-x-6 gap-y-5 sm:grid-cols-2 md:col-span-9 print:col-span-9 print:grid-cols-2">
            {projects.slice(0, 4).map((p) => (
              <div key={p.id} className="break-inside-avoid">
                <h3 className="t-body font-semibold">{p.title.trim()}</h3>
                <p className="t-small mt-1 line-clamp-2 text-muted">{p.description.replace(/\s+/g, ' ').trim()}</p>
                <p className="t-small mt-1 text-ink-2">{formatTags(p.tags).join(' · ')}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="grid grid-cols-12 gap-x-6 gap-y-4 border-b border-line py-8">
          <Heading>Skills &amp; tools</Heading>
          <div className="col-span-12 grid gap-6 sm:grid-cols-3 md:col-span-9 print:col-span-9 print:grid-cols-3">
            {profile.skills?.map((cat) => (
              <div key={cat.category}>
                <h3 className="t-small font-semibold text-ink">{cat.category}</h3>
                <ul className="t-small mt-2 space-y-1 text-muted">
                  {cat.skills.map((s) => (
                    <li key={s.name}>{s.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Certificates */}
        <section className="grid grid-cols-12 gap-x-6 gap-y-4 pt-8">
          <Heading>Certifications</Heading>
          <ul className="col-span-12 grid gap-x-6 gap-y-3 sm:grid-cols-2 md:col-span-9 print:col-span-9 print:grid-cols-2">
            {certificates.map((cert) => (
              <li key={cert.id} className="break-inside-avoid">
                <div className="t-small font-semibold text-ink">{formatTitle(cert.title)}</div>
                <div className="t-small text-muted">
                  {cert.issuer} · {cert.date}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </div>
  );
}
