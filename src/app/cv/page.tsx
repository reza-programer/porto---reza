import React from 'react';
import Link from 'next/link';
import { getProfile, getExperience, getCertificates, getProjects } from '@/lib/data';
import { formatTags, formatTitle } from '@/lib/project-meta';
import { PrintButton } from '@/components/ui/PrintButton';
import { PrivacyGate } from '@/components/PrivacyGate';
import { Asterisk } from '@/components/ui/Glyphs';
import { isLocked, lockedMetadata } from '@/lib/privacy';

// Rendered per request: what a visitor sees depends on their privacy cookie.
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  if (await isLocked()) return lockedMetadata;
  return {
    title: 'Curriculum Vitae — Mohamad Reza Nurpadilah',
    description: 'Online Resume & Curriculum Vitae of Mohamad Reza Nurpadilah',
  };
}

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="label col-span-12 md:col-span-3 print:col-span-3">{children}</h2>;
}

/* The CV as a single trimmed sheet: crop marks on screen, plain A4 in print. */
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
    <PrivacyGate>
      <div className="site min-h-screen px-4 py-6 sm:px-6 sm:py-10 print:bg-white print:p-0">
        <div className="label mx-auto mb-10 flex max-w-4xl items-center justify-between print:hidden">
          <Link href="/" className="group flex items-center gap-2 hover:opacity-100">
            <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            Portfolio
          </Link>
          <PrintButton />
        </div>

        <article className="relative mx-auto max-w-4xl bg-white p-7 sm:p-12 print:max-w-none print:p-0">
          

          <header className="border-b border-ink pb-8">
            <div className="label flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Asterisk className="h-4 w-4 text-lime print:hidden" /> Curriculum Vitae
              </span>
              <span>{new Date().getFullYear()}</span>
            </div>
            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between print:flex-row print:items-end">
              <div className="flex items-end gap-5">
                <img
                  src={profile.avatar || '/images/profile.png'}
                  alt={profile.name}
                  className="h-24 w-20 shrink-0 object-cover object-[50%_18%] grayscale"
                />
                <div>
                  <h1 className="display wdth-112 text-[clamp(2rem,4.4vw,3rem)]">{profile.name}</h1>
                  <p className="label mt-2">{profile.title}</p>
                </div>
              </div>
              <ul className="label space-y-0.5 normal-case sm:text-right print:text-right">
                {contacts.map((c) => (
                  <li key={c} className="truncate">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </header>

          <p className="t-body border-b border-ink py-6 text-ink-2">{profile.bio}</p>

          <section className="grid grid-cols-12 gap-x-6 gap-y-4 border-b border-ink py-8">
            <Heading>Experience</Heading>
            <div className="col-span-12 space-y-7 md:col-span-9 print:col-span-9">
              {experiences.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                    <h3 className="text-[1.05rem] font-semibold leading-tight">{exp.title}</h3>
                    <span className="label text-muted">{exp.period}</span>
                  </div>
                  <div className="t-small mt-0.5 text-ink-2">
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ''}
                  </div>
                  <p className="t-small mt-2 text-muted">{exp.description}</p>
                  {exp.skills?.length > 0 && <p className="label mt-2 text-ink-2">{formatTags(exp.skills).join(' · ')}</p>}
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-12 gap-x-6 gap-y-4 border-b border-ink py-8">
            <Heading>Key projects</Heading>
            <div className="col-span-12 grid gap-x-6 gap-y-5 sm:grid-cols-2 md:col-span-9 print:col-span-9 print:grid-cols-2">
              {projects.slice(0, 4).map((p) => (
                <div key={p.id} className="break-inside-avoid">
                  <h3 className="text-[0.98rem] font-semibold leading-tight">{p.title.trim()}</h3>
                  <p className="t-small mt-1 line-clamp-2 text-muted">{p.description.replace(/\s+/g, ' ').trim()}</p>
                  <p className="label mt-1.5 text-ink-2">{formatTags(p.tags).join(' · ')}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-12 gap-x-6 gap-y-4 border-b border-ink py-8">
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

          <section className="grid grid-cols-12 gap-x-6 gap-y-4 pt-8">
            <Heading>Certifications</Heading>
            <ul className="col-span-12 grid gap-x-6 gap-y-3 sm:grid-cols-2 md:col-span-9 print:col-span-9 print:grid-cols-2">
              {certificates.map((cert) => (
                <li key={cert.id} className="break-inside-avoid">
                  <div className="t-small font-semibold text-ink">{formatTitle(cert.title)}</div>
                  <div className="label text-muted">
                    {cert.issuer} · {cert.date}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </div>
    </PrivacyGate>
  );
}
