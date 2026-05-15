'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const navLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Katalog Ternak', href: '/katalog-ternak' },
  { label: 'Paket Aqiqah', href: '/paket-aqiqah' },
  { label: 'Pupuk', href: '/pupuk' },
  { label: 'Status Pesanan', href: '/status-pesanan' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          // Fetch profile untuk full_name
          const { data } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', session.user.id)
            .single();

          if (data?.full_name) {
            setFullName(data.full_name);
          }
        } else {
          // Jika tidak ada session, pastikan state kosong
          setUser(null);
          setFullName('');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Listener otomatis: Memantau jika user Login atau Logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setFullName('');
        router.refresh();
      } else if (event === 'SIGNED_IN') {
        fetchUser();
      }
    });

    // Bersihkan listener saat komponen dilepas
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // Fungsi Logout yang diperbarui
  const handleLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      
      // Kosongkan state secara manual
      setUser(null);
      setFullName('');
      
      // Segarkan cache dan arahkan ke beranda
      router.refresh();
      router.push('/');
    } catch (error) {
      console.error('Error saat logout:', error);
    } finally {
      setLoading(false);
    }
  };

  // Extract first name from full name
  const getFirstName = (name: string) => {
    return name.split(' ')[0];
  };

  // Get initial from first name
  const getInitial = (name: string) => {
    const firstName = getFirstName(name);
    return firstName.charAt(0).toUpperCase() || 'U';
  };

  const firstName = fullName ? getFirstName(fullName) : '';
  const initial = fullName ? getInitial(fullName) : 'U';

  return (
    <nav className="bg-[#2D6A4F] sticky top-0 z-50 w-full">
      <div className="max-w-[1200px] mx-auto px-6 h-[64px] flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/logo.png"
            alt="Cikarawang Farm Logo"
            width={36}
            height={36}
            className="rounded-full object-contain bg-white"
          />
          <span className="text-white font-semibold text-[15px] leading-tight whitespace-nowrap">
            Cikarawang Farm
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
            <Link
              key={link.label}
              href={link.href}
              className={`
                text-[13px] font-medium px-4 py-1.5 rounded-full transition-colors duration-150
                ${isActive
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:text-white hover:bg-white/10'}
              `}
            >
              {link.label}
            </Link>
          );
          })}
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-3 shrink-0">
          {!loading && user ? (
            // User sudah login
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                {initial}
              </div>
              <span className="text-white text-[13px] font-medium max-w-[120px] truncate">
                {firstName || 'User'}
              </span>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="text-[13px] font-medium text-white border border-white/80 rounded-full px-3 py-1.5 hover:bg-white/10 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Logout
              </button>
            </div>
          ) : !loading && !user ? (
            // Belum login
            <div className="flex items-center gap-2">
              <Link
                href="/masuk"
                className="text-[13px] font-medium text-white border border-white/80 rounded-full px-4 py-1.5 hover:bg-white/10 transition-colors duration-150"
              >
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="text-[13px] font-semibold text-[#2D6A4F] bg-[#E8F5E9] rounded-full px-4 py-1.5 hover:bg-white transition-colors duration-150"
              >
                Daftar
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}