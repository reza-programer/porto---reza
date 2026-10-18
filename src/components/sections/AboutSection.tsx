import React from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';
import type { Profile } from '@/types';

interface AboutSectionProps {
  profile: Profile;
}

const WHATSAPP_URL = 'https://wa.me/6281224290502';

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const details = [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    profile.phone ? { label: 'WhatsApp', value: profile.phone, href: WHATSAPP_URL } : null,
    { label: 'Based in', value: profile.location },
    profile.socialLinks.github
      ? {
          label: 'GitHub',
          value: profile.socialLinks.github.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
          href: profile.socialLinks.github,
        }
      : null,
    profile.socialLinks.linkedin
      ? { label: 'LinkedIn', value: 'Mohamad Reza Nurpadilah', href: profile.socialLinks.linkedin }
      : null,
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  return (
    <section id="about" className="py-20 sm:py-28">
      <div className="wrap">
        <SectionHeader
          index="02"
          label="About"
          title="Building scalable web systems with rigorous quality standards."
        />

        <div className="grid grid-cols-12 gap-x-8 gap-y-12">
          <Reveal className="col-span-12 lg:col-span-7">
            <p className="t-h3 font-medium leading-[1.55] text-ink">{profile.bio}</p>
            <p className="t-lead mt-5 text-muted">
              I specialize in building scalable web applications with modern technologies like React, Next.js,
              Laravel, Vue.js, and MySQL. With a strong foundation in Quality Assurance, I bridge the gap between
              design, robust code, and thorough test verification.
            </p>
          </Reveal>

          <Reveal className="col-span-12 lg:col-span-5" delay={0.08}>
            <dl className="border-t border-line">
              {details.map((d) => (
                <div key={d.label} className="flex items-center justify-between gap-6 border-b border-line py-4">
                  <dt className="eyebrow shrink-0">{d.label}</dt>
                  <dd className="min-w-0 text-right">
                    {d.href ? (
                      <a
                        href={d.href}
                        target={d.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="t-body group inline-flex max-w-full items-center gap-1.5 text-ink hover:text-accent"
                      >
                        <span className="truncate">{d.value}</span>
                        <FiArrowUpRight className="h-3.5 w-3.5 shrink-0 text-faint transition-colors group-hover:text-accent" />
                      </a>
                    ) : (
                      <span className="t-body text-ink">{d.value}</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
