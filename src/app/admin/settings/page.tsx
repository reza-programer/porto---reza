'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { FiArrowUpRight, FiEye, FiEyeOff, FiLock, FiUnlock } from 'react-icons/fi';
import { Field, PageHeader } from '@/components/admin/AdminUI';

interface PrivacyState {
  privateMode: boolean;
  hasPassword: boolean;
}

/** Privacy mode: lock the public site behind a visitor password while it's being built. */
export default function AdminPrivacyPage() {
  const [state, setState] = useState<PrivacyState | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);

  const load = useCallback(() => {
    fetch('/api/settings/privacy')
      .then((res) => res.json())
      .then(setState)
      .catch(() => setNotice({ tone: 'error', text: 'Gagal memuat pengaturan.' }));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (body: Partial<PrivacyState> & { password?: string }, done: string) => {
    setBusy(true);
    setNotice(null);
    try {
      const res = await fetch('/api/settings/privacy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      // An empty or non-JSON reply (e.g. the dev server reloading mid-request) shouldn't surface as a parser error.
      const data = await res.json().catch(() => null);
      if (!res.ok || !data) throw new Error(data?.error || 'Server tidak merespons dengan benar. Coba simpan lagi.');
      setState(data);
      setNotice({ tone: 'ok', text: done });
      return true;
    } catch (err) {
      setNotice({ tone: 'error', text: err instanceof Error ? err.message : 'Gagal menyimpan.' });
      // Show what was actually saved, whatever happened to this reply.
      load();
      return false;
    } finally {
      setBusy(false);
    }
  };

  const toggle = () => {
    if (!state) return;
    const next = !state.privateMode;
    save({ privateMode: next }, next ? 'Mode privasi aktif. Pengunjung sekarang perlu password.' : 'Mode privasi mati. Website terbuka untuk umum.');
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await save({ password }, 'Password pengunjung disimpan.')) setPassword('');
  };

  const on = !!state?.privateMode;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Privasi"
        description="Kunci website dengan password selama portofolio masih dalam pengembangan."
        action={
          <a href="/locked?preview" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            Pratinjau halaman kunci <FiArrowUpRight className="h-4 w-4" />
          </a>
        }
      />

      {notice && (
        <div
          role="status"
          className={`t-small rounded-xl border px-4 py-3 ${
            notice.tone === 'ok' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {notice.text}
        </div>
      )}

      {/* Switch */}
      <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex gap-4">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${on ? 'bg-ink text-paper' : 'bg-paper text-muted'}`}
            >
              {on ? <FiLock className="h-5 w-5" /> : <FiUnlock className="h-5 w-5" />}
            </span>
            <div>
              <h2 className="t-h3">Mode privasi</h2>
              <p className="t-body mt-1 text-muted">
                {!state
                  ? 'Memuat…'
                  : on
                    ? 'Aktif. Pengunjung melihat halaman "Kepo yaaa?" dan harus memasukkan password dulu.'
                    : 'Nonaktif. Website terbuka untuk semua orang.'}
              </p>
              {state && !state.hasPassword && (
                <p className="t-small mt-2 text-faint">Atur password pengunjung di bawah dulu untuk bisa menyalakannya.</p>
              )}
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={on}
            aria-label="Mode privasi"
            onClick={toggle}
            disabled={!state || busy || (!on && !state.hasPassword)}
            className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              on ? 'bg-ink' : 'bg-line-strong'
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-[left] duration-200 ${on ? 'left-6' : 'left-1'}`}
            />
          </button>
        </div>
      </section>

      {/* Password */}
      <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <h2 className="t-h3">Password pengunjung</h2>
        <p className="t-body mt-1 text-muted">
          {state?.hasPassword ? 'Password sudah diatur. Isi di bawah untuk menggantinya.' : 'Belum ada password.'}
        </p>

        <form onSubmit={savePassword} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
          <Field
            label={state?.hasPassword ? 'Password baru' : 'Password'}
            htmlFor="visitor-password"
            hint="Minimal 4 karakter. Mengganti password membuat semua pengunjung harus memasukkannya lagi."
            className="flex-1"
          >
            <div className="relative">
              <input
                id="visitor-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pr-11"
                placeholder="Password untuk pengunjung"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="icon-btn absolute right-1.5 top-1/2 -translate-y-1/2"
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
              </button>
            </div>
          </Field>
          <button type="submit" disabled={busy || password.trim().length < 4} className="btn btn-primary disabled:opacity-40 sm:mb-[1.85rem]">
            Simpan password
          </button>
        </form>
      </section>

      <p className="t-small text-muted">
        Saat mode privasi aktif, kamu juga akan melihat halaman kunci. Masukkan password pengunjung untuk membuka website.
      </p>
    </div>
  );
}
