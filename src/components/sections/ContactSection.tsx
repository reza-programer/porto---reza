'use client';

import React, { useState } from 'react';
import { FiArrowRight, FiArrowUpRight, FiCheck } from 'react-icons/fi';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';
import type { Profile } from '@/types';

interface ContactSectionProps {
  profile: Profile;
}

const WHATSAPP_URL = 'https://wa.me/6281224290502';

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to send message');

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi atau kirim email langsung.');
    } finally {
      setLoading(false);
    }
  };

  const channels = [
    { label: 'Email', handle: profile.email, href: `mailto:${profile.email}` },
    profile.phone ? { label: 'WhatsApp', handle: profile.phone, href: WHATSAPP_URL } : null,
    profile.socialLinks?.linkedin
      ? { label: 'LinkedIn', handle: 'Mohamad Reza Nurpadilah', href: profile.socialLinks.linkedin }
      : null,
    profile.socialLinks?.instagram ? { label: 'Instagram', handle: '@kezottt_', href: profile.socialLinks.instagram } : null,
    profile.socialLinks?.github ? { label: 'GitHub', handle: 'reza-programer', href: profile.socialLinks.github } : null,
  ].filter(Boolean) as { label: string; handle: string; href: string }[];

  return (
    <section id="contact" className="py-20 sm:py-28">
      <div className="wrap">
        <SectionHeader
          index="06"
          label="Contact"
          title="Get in touch"
          intro="Punya ide proyek atau ingin berdiskusi? Silakan hubungi saya melalui jalur di bawah atau kirim pesan langsung!"
        />

        <div className="grid grid-cols-12 gap-x-8 gap-y-14">
          {/* Channels */}
          <Reveal className="col-span-12 lg:col-span-5">
            <ul className="border-t border-line">
              {channels.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 border-b border-line py-4"
                  >
                    <span className="eyebrow w-24 shrink-0">{c.label}</span>
                    <span className="t-body min-w-0 flex-1 truncate text-ink transition-colors group-hover:text-accent">
                      {c.handle}
                    </span>
                    <FiArrowUpRight className="h-4 w-4 shrink-0 text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="t-small mt-5 text-muted">Based in {profile.location}</p>
          </Reveal>

          {/* Form */}
          <Reveal className="col-span-12 lg:col-span-6 lg:col-start-7" delay={0.08}>
            <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
              {submitted ? (
                <div className="py-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white">
                    <FiCheck className="h-5 w-5" />
                  </span>
                  <h3 className="t-h3 mt-5">Pesan Terkirim!</h3>
                  <p className="t-body mt-2 max-w-md text-muted">
                    Terima kasih telah menghubungi saya. Saya akan segera membalas pesan Anda.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn btn-outline mt-6">
                    Kirim Pesan Lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="t-h3">Kirim pesan</h3>
                  {error && (
                    <div className="t-small border-l-2 border-red-600 bg-red-50 px-4 py-3 text-red-700">{error}</div>
                  )}

                  <div className="grid gap-6 sm:grid-cols-2">
                    <label className="block">
                      <span className="eyebrow">Nama Anda</span>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Masukkan nama Anda"
                        className="field"
                      />
                    </label>
                    <label className="block">
                      <span className="eyebrow">Email Anda</span>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@contoh.com"
                        className="field"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="eyebrow">Pesan</span>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Halo Reza, saya ingin mendiskusikan proyek..."
                      className="field resize-none"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary group disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? 'Mengirim...' : 'Kirim Pesan'}
                    <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
