'use client';

import React, { useState } from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Asterisk } from '@/components/ui/Glyphs';
import type { Profile } from '@/types';

const WHATSAPP_URL = 'https://wa.me/6281224290502';

/*
 * "05 / Contact" on black: a big closing line, the email, the other
 * channels, and a short form.
 */
export const ContactSection: React.FC<{ profile: Profile }> = ({ profile }) => {
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
      setError('Gagal terkirim. Coba lagi, atau kirim email langsung.');
    } finally {
      setLoading(false);
    }
  };

  const channels = [
    profile.phone ? { label: 'WhatsApp', href: WHATSAPP_URL } : null,
    profile.socialLinks?.linkedin ? { label: 'LinkedIn', href: profile.socialLinks.linkedin } : null,
    profile.socialLinks?.instagram ? { label: 'Instagram', href: profile.socialLinks.instagram } : null,
    profile.socialLinks?.github ? { label: 'GitHub', href: profile.socialLinks.github } : null,
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <section id="contact" className="bg-ink py-20 text-sheet sm:py-28">
      <div className="wrap grid grid-cols-12 gap-x-6 gap-y-12">
        <SectionTitle
          no="05"
          title={['Contact']}
          note="Open to full-time roles and freelance projects."
          className="col-span-12 lg:col-span-3"
        />

        <div className="col-span-12 lg:col-span-9">
          <p className="display wdth-125 text-[clamp(2.6rem,6.6vw,6.6rem)]">
            Let&apos;s work
            <br />
            <span className="inline-flex items-center gap-[0.2em]">
              together <Asterisk className="h-[0.7em] w-[0.7em] text-lime" />
            </span>
          </p>

          <a
            href={`mailto:${profile.email}`}
            className="mt-10 inline-block break-all text-[clamp(1.3rem,2.6vw,2.2rem)] font-medium underline decoration-lime decoration-2 underline-offset-[0.25em] transition-colors hover:text-lime"
          >
            {profile.email}
          </a>

          <div className="mt-14 grid grid-cols-12 gap-x-6 gap-y-12 lg:gap-x-8">
            <ul className="col-span-12 border-t border-sheet/20 md:col-span-5">
              {channels.map((c) => (
                <li key={c.label} className="border-b border-sheet/20">
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between py-4 text-[0.95rem] transition-colors hover:text-lime"
                  >
                    {c.label}
                    <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="col-span-12 md:col-span-7">
              {submitted ? (
                <div className="flex flex-col items-start gap-5 border-y border-sheet/20 py-10">
                  <div className="display wdth-112 text-[clamp(2rem,4vw,3rem)]">Terkirim ✓</div>
                  <p className="text-sheet/70">Makasih! Balasan menyusul secepatnya.</p>
                  <button onClick={() => setSubmitted(false)} className="btn-outline-ink hover:border-sheet hover:bg-sheet hover:text-ink">
                    Kirim lagi
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && <p className="bg-lime px-3 py-2 text-[0.85rem] text-ink">{error}</p>}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <label className="block">
                      <span className="label text-sheet/60">Nama</span>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="rule-field border-sheet/30 focus:border-lime"
                      />
                    </label>
                    <label className="block">
                      <span className="label text-sheet/60">Email</span>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="rule-field border-sheet/30 focus:border-lime"
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="label text-sheet/60">Pesan</span>
                    <textarea
                      required
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="rule-field resize-none border-sheet/30 focus:border-lime"
                    />
                  </label>
                  <button type="submit" disabled={loading} className="btn-ink bg-lime text-ink hover:bg-sheet">
                    {loading ? 'Mengirim…' : 'Kirim pesan'} <span aria-hidden>↗</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
