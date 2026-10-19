'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';

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
      setError('Username atau password salah.');
    } else {
      router.push('/admin/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-5 py-12">
      <div className="w-full max-w-[380px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <img
            src="/images/profile.png"
            alt=""
            className="h-14 w-14 rounded-full border border-line object-cover object-[50%_15%]"
          />
          <h1 className="t-h3 mt-4">Masuk ke admin</h1>
          <p className="t-small mt-1 text-muted">Kelola proyek, pengalaman, dan sertifikat.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 rounded-2xl border border-line bg-surface p-6 sm:p-7">
          {error && <div className="t-small rounded-lg bg-red-50 px-3.5 py-2.5 text-red-700">{error}</div>}

          <div>
            <label htmlFor="username" className="t-small mb-1.5 block font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              autoFocus
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="password" className="t-small mb-1.5 block font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="icon-btn absolute right-1.5 top-1/2 -translate-y-1/2"
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Memproses…' : 'Masuk'}
          </button>
        </form>

        <Link
          href="/"
          className="t-small mx-auto mt-6 flex w-fit items-center gap-1.5 text-muted transition-colors hover:text-ink"
        >
          <FiArrowLeft className="h-3.5 w-3.5" /> Kembali ke portofolio
        </Link>
      </div>
    </div>
  );
}
