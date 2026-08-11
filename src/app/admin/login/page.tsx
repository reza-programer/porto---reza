'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FiLock, FiUser, FiArrowLeft, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import Link from 'next/link';

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
    <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center p-4 selection:bg-[#edf1eb]">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5c7254] hover:text-[#3b4d35] mb-6 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" /> Kembali ke Portofolio
        </Link>

        {/* Login Card */}
        <Card className="shadow-lg border-[#dce4db] bg-white p-8 rounded-3xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#edf1eb] border border-[#dce4db] text-[#3b4d35] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
              <FiShield className="w-7 h-7 text-[#5c7254]" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#20261e] tracking-tight">Admin Portal</h1>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Masuk untuk mengelola proyek, pengalaman, dan sertifikat
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#dce4db] bg-slate-50/50 focus:ring-2 focus:ring-[#5c7254] focus:border-[#5c7254] outline-none text-slate-900 text-sm transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-[#dce4db] bg-slate-50/50 focus:ring-2 focus:ring-[#5c7254] focus:border-[#5c7254] outline-none text-slate-900 text-sm transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full mt-3 bg-[#3b4d35] hover:bg-[#2d3a28] py-3 text-sm font-bold shadow-xs rounded-xl transition-all"
            >
              {loading ? 'Memproses...' : 'Masuk ke Admin'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
