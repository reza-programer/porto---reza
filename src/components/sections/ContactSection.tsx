'use client';

import React, { useState } from 'react';
import type { IconType } from 'react-icons';
import { FiGithub, FiInstagram, FiLinkedin, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { Reveal } from '@/components/ui/Reveal';
import type { Profile } from '@/types';

interface ContactSectionProps {
  profile: Profile;
}

const WHATSAPP_URL = 'https://wa.me/6281224290502';

/*
 * A café counter at closing time: channels on the left, and the message form
 * written up as an order slip on the right.
 */
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
    { label: 'Email', handle: profile.email, href: `mailto:${profile.email}`, icon: FiMail },
    profile.phone ? { label: 'WhatsApp', handle: profile.phone, href: WHATSAPP_URL, icon: FiPhone } : null,
    profile.socialLinks?.linkedin
      ? { label: 'LinkedIn', handle: 'Mohamad Reza Nurpadilah', href: profile.socialLinks.linkedin, icon: FiLinkedin }
      : null,
    profile.socialLinks?.instagram
      ? { label: 'Instagram', handle: '@kezottt_', href: profile.socialLinks.instagram, icon: FiInstagram }
      : null,
    profile.socialLinks?.github ? { label: 'GitHub', handle: 'reza-programer', href: profile.socialLinks.github, icon: FiGithub } : null,
  ].filter(Boolean) as { label: string; handle: string; href: string; icon: IconType }[];

  return (
    <section id="contact" className="relative overflow-hidden bg-navy text-white">
      <div className="wrap grid grid-cols-12 gap-x-8 gap-y-16 py-20 sm:py-24">
        {/* Channels */}
        <Reveal className="col-span-12 lg:col-span-6">
          <h2 className="t-marker">
            Let&apos;s grab
            <br />
            <span className="text-ice">coffee</span>
          </h2>
          <p className="mt-3 -rotate-2 font-hand text-[1.9rem] font-semibold leading-none text-sun">or just say hi, I&apos;m friendly</p>
          <p className="mt-7 max-w-md font-mono text-[0.82rem] leading-relaxed text-white/75">
            Punya ide proyek atau ingin berdiskusi? Silakan hubungi saya melalui jalur di bawah atau kirim pesan langsung!
          </p>

          <ul className="mt-10 border-t-2 border-white/15">
            {channels.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 border-b-2 border-white/15 py-3.5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-ocean transition-colors group-hover:bg-flame">
                    <c.icon className="h-4 w-4" />
                  </span>
                  <span className="w-20 shrink-0 font-mono text-[0.68rem] font-bold uppercase text-ice sm:w-24">{c.label}</span>
                  <span className="min-w-0 flex-1 truncate font-mono text-[0.85rem]">{c.handle}</span>
                  <span aria-hidden className="font-mono transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-5 flex items-center gap-2 font-mono text-[0.72rem] uppercase text-ice">
            <FiMapPin className="h-3.5 w-3.5" /> Based in {profile.location}
          </p>
        </Reveal>

        {/* Order slip */}
        <Reveal className="col-span-12 lg:col-span-5 lg:col-start-8" delay={0.08}>
          <div className="mx-auto max-w-md drop-shadow-[6px_6px_0_rgba(0,0,0,0.35)] sm:rotate-[1.5deg] sm:drop-shadow-[8px_8px_0_rgba(0,0,0,0.35)] lg:mt-4">
            <div className="bg-white px-6 pb-7 pt-6 text-navy sm:px-8">
              <div className="border-b-2 border-dashed border-navy/30 pb-4 text-center">
                <div className="font-marker text-3xl uppercase leading-none">Order slip</div>
                <div className="mt-2 font-mono text-[0.66rem] font-bold uppercase tracking-[0.12em] text-navy/60">
                  No. 0001 · Table: online · Kuningan
                </div>
              </div>

              {submitted ? (
                <div className="py-10 text-center">
                  <div className="mx-auto inline-block -rotate-6 rounded-md border-4 border-flame px-5 py-2 font-marker text-4xl uppercase text-flame">
                    Received!
                  </div>
                  <p className="mx-auto mt-6 max-w-xs font-mono text-[0.8rem] leading-relaxed text-navy/75">
                    Terima kasih telah menghubungi saya. Saya akan segera membalas pesan Anda.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-stamp btn-stamp-paper mt-7">
                    Kirim pesan lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                  {error && (
                    <div className="border-2 border-flame bg-[#fdecea] px-3 py-2.5 font-mono text-[0.75rem] text-flame">{error}</div>
                  )}

                  <label className="block">
                    <span className="font-mono text-[0.66rem] font-bold uppercase text-navy/60">Nama Anda</span>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Masukkan nama Anda"
                      className="slip-field"
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono text-[0.66rem] font-bold uppercase text-navy/60">Email Anda</span>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@contoh.com"
                      className="slip-field"
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono text-[0.66rem] font-bold uppercase text-navy/60">Pesan</span>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Halo Reza, saya ingin mendiskusikan proyek..."
                      className="slip-field resize-none"
                    />
                  </label>

                  <div className="flex items-baseline gap-2 border-t-2 border-dashed border-navy/30 pt-4 font-mono text-[0.78rem]">
                    <span>1× Ngobrol soal proyek</span>
                    <span className="flex-1 translate-y-[-0.2em] border-b-2 border-dotted border-navy/30" />
                    <span className="font-bold">GRATIS</span>
                  </div>

                  <button type="submit" disabled={loading} className="btn-stamp btn-stamp-flame w-full">
                    {loading ? 'Mengirim...' : 'Kirim pesan'} <span aria-hidden>→</span>
                  </button>
                </form>
              )}
            </div>
            <div className="receipt-edge" aria-hidden />
          </div>
        </Reveal>
      </div>
    </section>
  );
};
