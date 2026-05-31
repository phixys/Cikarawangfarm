'use client';

import { useState, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getSiteUrl } from '@/lib/siteUrl';

/* ─── Google SVG Logo ─── */
function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.5 26.8 36.5 24 36.5c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.9 2.5-2.5 4.6-4.7 6l6.2 5.2C42.1 36.2 44 30.5 44 24c0-1.2-.1-2.4-.4-3.5z"/>
    </svg>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function MasukPage() {
  const router = useRouter(); // 🟢 Menggunakan router dari Next.js agar perpindahan mulus
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState('');

  // 1. PENJAGA HALAMAN: Jika sudah login, cek role dan arahkan otomatis
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Cek rolenya apa jika sudah login
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        // Jika query gagal atau data kosong, jangan redirect ke '/'
        if (profileError || !profileData) {
          console.warn('Tidak bisa membaca role profile:', profileError?.message);
          return; // Biarkan user tetap di halaman masuk, tidak redirect ke mana-mana
        }

        if (profileData.role === 'owner') {
          router.push('/owner');
        } else {
          router.push('/admin/pesanan');
        }
      }
    };
    checkSession();
  }, [router]);

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setInfo('');

    if (!email.trim() || !password.trim()) {
      setError('Email dan kata sandi harus diisi');
      return;
    }

    try {
      setLoading(true);
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (!authData?.session) {
        setError('Login berhasil, tetapi sesi tidak terbentuk. Coba muat ulang halaman.');
        return;
      }

      setInfo('Login berhasil. Memeriksa hak akses...');

      // 2. Ambil Role pengguna dari tabel profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Gagal mengambil role:', profileError);
        router.push('/');
        return;
      }

      // 3. Catat waktu login terakhir ke tabel profil_karyawan
      await supabase
        .from('profil_karyawan')
        .update({ terakhir_login: new Date().toISOString() })
        .eq('id', authData.user.id);
      // Jika tabel/kolom belum ada, error diabaikan agar redirect tetap berjalan

      // 4. Arahkan (Redirect) sesuai Role secara mulus
      const userRole = profileData?.role;

      setTimeout(() => {
        if (userRole === 'owner') {
          router.push('/owner'); // Arahkan ke dashboard owner
        } else {
          router.push('/admin/pesanan'); // Arahkan ke menu kelola pesanan admin
        }
      }, 500);

    } catch (err: any) {
      console.error('Login error', err);
      setError(err?.message ?? 'Terjadi kesalahan saat masuk');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${getSiteUrl()}/masuk`, // Balik ke /masuk agar useEffect bisa cek role
        }
      });

      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      setError('Terjadi kesalahan saat menghubungkan ke Google.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-[#F0FFF4] font-poppins">
      <div className="max-w-[900px] w-full">

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm text-gray-700 hover:text-[#2D6A4F] text-[13.5px] font-medium mb-6 transition-colors duration-150"
        >
          <ArrowLeft size={15} strokeWidth={2.5} />
          Kembali ke Beranda
        </Link>

        <div className="w-full bg-white rounded-[2rem] shadow-xl flex flex-col md:flex-row overflow-hidden min-h-[660px]">
          {/* ── LEFT PANEL ── */}
          <div className="w-full md:w-5/12 bg-[#2D6A4F] p-10 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-3 mb-12">
                <img
                  src="/logo.png"
                  alt="Cikarawang Farm Logo"
                  className="w-10 h-10 rounded-full object-cover bg-white p-0.5 shrink-0"
                />
                <span className="text-white font-bold text-[16px]">Cikarawang Farm</span>
              </div>
              <h2 className="text-white text-[2rem] font-bold leading-snug mb-4">
                Solusi Aqiqah &amp;<br />Peternakan Terpadu
              </h2>
              <p className="text-white/75 text-[13.5px] leading-relaxed">
                Masuk untuk mengelola pesanan aqiqah, melacak status pengiriman, dan mendapatkan
                penawaran eksklusif dari peternakan kami.
              </p>
            </div>
            <div className="mt-12 bg-white/10 p-4 rounded-xl flex items-center gap-4">
              <div className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center shrink-0">
                <ShieldCheck size={20} className="text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="text-white font-semibold text-[14px] leading-tight">Transaksi Aman</p>
                <p className="text-white/65 text-[12.5px] mt-0.5">Dilindungi enkripsi berlapis</p>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="w-full md:w-7/12 bg-white p-8 md:p-14 flex flex-col justify-center">
            <h1 className="text-[#2D6A4F] text-3xl font-bold mb-2">Selamat Datang!</h1>
            <p className="text-gray-500 text-[13.5px] mb-8">
              Silakan masukkan detail akun Anda untuk melanjutkan.
            </p>

            <form onSubmit={handleSignIn} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {info && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {info}
                </div>
              )}

              <div>
                <label className="block text-[13.5px] font-medium text-gray-700 mb-1.5">Alamat Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contoh@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-[14px] text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] outline-none transition-all duration-150"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13.5px] font-medium text-gray-700 mb-1.5">Kata Sandi</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-[14px] text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] outline-none transition-all duration-150"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-150"
                  >
                    {showPassword ? <Eye size={16} strokeWidth={2} /> : <EyeOff size={16} strokeWidth={2} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-150 cursor-pointer ${
                      rememberMe ? 'bg-[#2D6A4F] border-[#2D6A4F]' : 'border-gray-300 bg-white'
                    }`}
                  >
                    {rememberMe && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3L3.5 5.5L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[13.5px] text-gray-600 select-none">Ingat saya</span>
                </label>
                <Link href="/lupa-sandi" className="text-[13.5px] font-semibold text-[#2D6A4F] hover:text-[#40916C] transition-colors duration-150">
                  Lupa sandi?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2D6A4F] text-white py-3.5 rounded-xl font-semibold text-[14.5px] mt-2 flex items-center justify-center gap-2 hover:bg-[#1B4332] transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Sedang masuk...' : 'Masuk ke Akun'}
                {!loading && <ArrowRight size={17} strokeWidth={2.5} />}
              </button>
            </form>

            <div className="flex items-center my-7">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="mx-4 text-[11.5px] text-gray-400 font-semibold tracking-widest uppercase">Atau Masuk Dengan</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full border border-gray-200 py-3 rounded-xl flex items-center justify-center gap-3 text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GoogleLogo />
              {loading ? 'Menghubungkan...' : 'Google'}
            </button>

            <p className="text-center text-[13.5px] text-gray-600 mt-8">
              Belum punya akun?{' '}
              <Link href="/daftar" className="text-[#2D6A4F] font-semibold hover:text-[#40916C] transition-colors duration-150">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}