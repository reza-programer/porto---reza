'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError('Username atau Password yang Anda masukkan salah.');
    } else {
      router.push('/admin/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <div className="wrap flex h-16 items-center justify-between">
        <Link href="/" className="text-[17px] font-semibold tracking-[-0.03em]">
          Reza<span className="text-accent">.</span>
        </Link>
        <Link href="/" className="eyebrow group inline-flex items-center gap-2 transition-colors hover:text-ink">
          <FiArrowLeft className="h-3.5 w-3.5" /> Kembali ke portofolio
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-5 pb-16">
        <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-7 sm:p-8">
          <div className="eyebrow">Admin portal</div>
          <h1 className="t-h2 mt-3">Masuk ke admin</h1>
          <p className="t-body mt-2 text-muted">Masuk untuk mengelola proyek, pengalaman, dan sertifikat.</p>

          {error && (
            <div className="t-small mt-6 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-red-700">{error}</div>
          )}

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <label className="block">
              <span className="eyebrow">Username</span>
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="field"
              />
            </label>

            <label className="block">
              <span className="eyebrow">Password</span>
              <span className="relative block">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer p-2 text-faint transition-colors hover:text-ink"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                </button>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary group w-full justify-between disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Masuk ke Admin'}
              <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
