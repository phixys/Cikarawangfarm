'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getSiteUrl } from '@/lib/siteUrl';

export default function DaftarPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Penjaga halaman: jika sudah login, langsung ke beranda
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        router.push('/');
      }
    };
    checkSession();
  }, []);

  // 🟢 FUNGSI DAFTAR/MASUK DENGAN GOOGLE
  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setError('');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${getSiteUrl()}/`,
        }
      });

      if (error) setError(error.message);
    } catch (err: any) {
      setError('Terjadi kesalahan saat menghubungkan ke Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validasi input manual
    if (!fullName.trim()) { setError('Nama lengkap harus diisi'); return; }
    if (!email.trim()) { setError('Email harus diisi'); return; }
    if (!password.trim()) { setError('Kata sandi harus diisi'); return; }
    if (password.length < 6) { setError('Kata sandi minimal 6 karakter'); return; }
    if (!agreeTerms) { setError('Anda harus menyetujui Syarat & Ketentuan'); return; }

    try {
      setLoading(true);
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      setSuccess('Pendaftaran berhasil! Silakan cek email untuk verifikasi.');
      setFullName(''); setEmail(''); setPassword(''); setAgreeTerms(false);
      setTimeout(() => router.push('/masuk'), 2000);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mendaftar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:px-6 bg-[#F0FFF4] font-poppins">
      <div className="max-w-[1000px] w-full">

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm text-gray-700 hover:text-[#2D6A4F] text-[13.5px] font-medium mb-6 transition-colors duration-150"
        >
          <span>←</span> Kembali ke Beranda
        </Link>

        <section className="relative w-full bg-white rounded-[2rem] shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[660px]">
          {/* Panel Kiri (Hijau) */}
          <div className="w-full md:w-5/12 bg-[#2D6A4F] p-10 md:p-12 flex flex-col justify-between h-full">
          <div>
            <div className="inline-flex items-center gap-3 mb-10">
              <img
                src="/Logo.png"
                alt="Cikarawang Farm Logo"
                className="w-10 h-10 rounded-full object-cover bg-white p-0.5 shrink-0"
              />
              <span className="text-white font-bold text-[15px]">Cikarawang Farm</span>
            </div>
            <h1 className="text-white text-4xl font-bold leading-tight mb-6">
              Bergabung dengan Komunitas Peternak Modern
            </h1>
            <p className="text-white/80 text-base leading-relaxed">
              Daftar sekarang untuk mulai mengelola pesanan aqiqah Anda dan nikmati berbagai kemudahan layanan peternakan terpadu kami.
            </p>
          </div>
          <div className="mt-10">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-white text-sm">
              Pendaftaran Cepat & Gratis
            </span>
          </div>
        </div>

          {/* Panel Kanan (Form) */}
          <div className="w-full md:w-7/12 bg-white p-8 md:p-14 flex flex-col justify-center">
          <h2 className="text-[#2D6A4F] text-3xl font-bold mb-2">Daftar Akun Baru</h2>
          <p className="text-gray-500 text-sm mb-10">Lengkapi data di bawah ini untuk memulai perjalanan Anda.</p>

          <form className="space-y-5" onSubmit={handleSignUp}>
            {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm">{success}</div>}

            {/* Input Nama, Email, Password tetap sama... */}
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nama Lengkap Anda" className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl outline-none text-sm focus:border-[#2D6A4F]" disabled={loading} />
            </div>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contoh@email.com" className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl outline-none text-sm focus:border-[#2D6A4F]" disabled={loading} />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl outline-none text-sm focus:border-[#2D6A4F]" disabled={loading} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label className="flex items-center gap-3 text-sm text-gray-600">
              <input type="checkbox" checked={agreeTerms} onChange={() => setAgreeTerms(!agreeTerms)} className="w-4 h-4 rounded text-[#2D6A4F]" disabled={loading} />
              <span>Saya setuju dengan <span className="text-[#2D6A4F] font-semibold">Syarat & Ketentuan</span></span>
            </label>

            <button type="submit" disabled={loading} className="w-full bg-[#2D6A4F] text-white py-4 rounded-xl font-bold mt-8 flex items-center justify-center gap-2 hover:bg-[#1B4332] transition-colors disabled:opacity-50">
              {loading ? 'Sedang membuat akun...' : 'Buat Akun Sekarang'} <ArrowRight size={18} />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-8">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-semibold">Atau daftar dengan</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* 🟢 TOMBOL GOOGLE TERHUBUNG */}
          <button 
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full border border-gray-200 py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all font-medium text-gray-700"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.5 26.8 36.5 24 36.5c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.9 2.5-2.5 4.6-4.7 6l6.2 5.2C42.1 36.2 44 30.5 44 24c0-1.2-.1-2.4-.4-3.5z" />
            </svg>
            Google
          </button>

          <p className="text-center text-sm mt-10 text-gray-600">
            Sudah punya akun? <Link href="/masuk" className="text-[#2D6A4F] font-bold hover:underline">Masuk sekarang</Link>
          </p>
        </div>
        </section>
      </div>
    </div>
  );
}