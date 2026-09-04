'use client';

import React, { useState } from 'react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  FiMail,
  FiMapPin,
  FiPhone,
  FiSend,
  FiCheckCircle,
  FiArrowUpRight,
} from 'react-icons/fi';
import { FaLinkedin, FaInstagram } from 'react-icons/fa6';
import type { Profile } from '@/types';

interface ContactSectionProps {
  profile: Profile;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
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

  return (
    <AnimatedSection id="contact" className="py-20 section-cream mesh-blob-2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <SectionHeading
          title="Get In Touch"
          subtitle="Punya ide proyek atau ingin berdiskusi? Silakan hubungi saya melalui jalur di bawah atau kirim pesan langsung!"
        />

        {/* Official Social Channels Cards */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Real LinkedIn Official Card */}
            {profile.socialLinks?.linkedin && (
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white border border-[#E2DFD6] rounded-2xl shadow-xs hover:shadow-md hover:border-[#0A66C2] transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  {/* Official LinkedIn Blue Square Icon */}
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FaLinkedin className="w-6 h-6 text-[#0A66C2]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#0A66C2] transition-colors">
                      LinkedIn
                    </h4>
                    <p className="text-xs text-slate-500 font-mono truncate max-w-[170px]">
                      Mohamad Reza Nurpadilah
                    </p>
                  </div>
                </div>
                <FiArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#0A66C2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            )}

            {/* Official Gmail Card */}
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center justify-between p-4 bg-white border border-[#E2DFD6] rounded-2xl shadow-xs hover:shadow-md hover:border-[#EA4335] transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22 6c0-.6-.2-1.1-.6-1.5L12 12 2.6 4.5C2.2 4.9 2 5.4 2 6v12c0 1.1.9 2 2 2h2V9.8l6 4.7 6-4.7V20h2c1.1 0 2-.9 2-2V6z"/>
                    <path fill="#34A853" d="M20 20h-2V9.8l4-3.1V18c0 1.1-.9 2-2 2z"/>
                    <path fill="#EA4335" d="M4 20h2V9.8L2 6.7V18c0 1.1.9 2 2 2z"/>
                    <path fill="#FBBC05" d="M12 14.5l6-4.7V4.5L12 9 6 4.5v5.3l6 4.7z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#EA4335] transition-colors">
                    Gmail
                  </h4>
                  <p className="text-xs text-slate-500 font-mono truncate max-w-[170px]">
                    {profile.email}
                  </p>
                </div>
              </div>
              <FiArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#EA4335] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Official Instagram Card */}
            {profile.socialLinks?.instagram && (
              <a
                href={profile.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white border border-[#E2DFD6] rounded-2xl shadow-xs hover:shadow-md hover:border-[#E4405F] transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FaInstagram className="w-5 h-5 text-[#E4405F]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#E4405F] transition-colors">
                      Instagram
                    </h4>
                    <p className="text-xs text-slate-500 font-mono truncate max-w-[170px]">
                      @kezottt_
                    </p>
                  </div>
                </div>
                <FiArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#E4405F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Direct Details Info */}
          <div className="space-y-4">
            <Card className="flex items-start gap-4 bg-white border-[#E2DFD6] shadow-xs">
              <div className="p-3 rounded-xl bg-[#EEF3EC] text-[#3B4D35] shrink-0 mt-0.5">
                <FiMail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Direct Email</h4>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-sm text-slate-600 hover:text-[#5C7254] transition-colors break-all"
                >
                  {profile.email}
                </a>
              </div>
            </Card>

            {profile.phone && (
              <Card className="flex items-start gap-4 bg-white border-[#E2DFD6] shadow-xs">
                <div className="p-3 rounded-xl bg-[#EEF3EC] text-[#3B4D35] shrink-0 mt-0.5">
                  <FiPhone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">WhatsApp / Phone</h4>
                  <a
                    href="https://wa.me/6281224290502"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-600 hover:text-[#5C7254] transition-colors"
                  >
                    +62 812-2429-0502
                  </a>
                </div>
              </Card>
            )}

            <Card className="flex items-start gap-4 bg-white border-[#E2DFD6] shadow-xs">
              <div className="p-3 rounded-xl bg-[#EEF3EC] text-[#3B4D35] shrink-0 mt-0.5">
                <FiMapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Location</h4>
                <p className="text-sm text-slate-600">{profile.location}</p>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-[#E2DFD6] shadow-xs p-6 sm:p-8">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <FiCheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
                  <h3 className="text-2xl font-bold text-slate-900">Pesan Terkirim!</h3>
                  <p className="text-slate-600 max-w-md mx-auto">
                    Terima kasih telah menghubungi saya. Saya akan segera membalas pesan Anda.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSubmitted(false)}
                    className="mt-4"
                  >
                    Kirim Pesan Lain
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                        Nama Anda
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Masukkan nama Anda"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#DCE4DB] bg-[#FAF9F5] focus:ring-2 focus:ring-[#5C7254] focus:border-[#5C7254] outline-none text-slate-900 text-sm transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                        Email Anda
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@contoh.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#DCE4DB] bg-[#FAF9F5] focus:ring-2 focus:ring-[#5C7254] focus:border-[#5C7254] outline-none text-slate-900 text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Pesan
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Halo Reza, saya ingin mendiskusikan proyek..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DCE4DB] bg-[#FAF9F5] focus:ring-2 focus:ring-[#5C7254] focus:border-[#5C7254] outline-none text-slate-900 text-sm transition-all resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="w-full sm:w-auto font-semibold px-6 py-3 rounded-full cursor-pointer"
                    icon={<FiSend className="w-4 h-4" />}
                  >
                    {loading ? 'Mengirim...' : 'Kirim Pesan'}
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};
