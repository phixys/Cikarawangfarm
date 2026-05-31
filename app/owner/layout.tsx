'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LogOut, TrendingUp, Settings, Crown, AlertTriangle, Users } from 'lucide-react';

const navLinks = [
  { name: 'Dashboard Owner', href: '/owner', icon: TrendingUp },
  { name: 'Kelola Karyawan', href: '/owner/karyawan', icon: Users },
  { name: 'Pengaturan', href: '/owner/pengaturan', icon: Settings },
];

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    await supabase.auth.signOut();
    router.push('/masuk');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Kiri: Logo + Judul + Desktop Nav */}
            <div className="flex items-center gap-8">
              <div className="flex-shrink-0 flex items-center gap-2.5">
                <div className="w-9 h-9 bg-[#2D6A4F] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  CF
                </div>
                <span className="font-bold text-gray-900 text-lg hidden sm:block">
                  Owner Panel
                </span>
              </div>

              {/* Desktop Nav */}
              <div className="hidden sm:flex sm:space-x-1">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === '/owner'
                      ? pathname === '/owner'
                      : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold rounded-xl transition-colors ${
                        isActive
                          ? 'bg-[#F0FFF4] text-[#2D6A4F]'
                          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <link.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Kanan: Profil Owner + Logout */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full border text-amber-700 bg-amber-50 border-amber-200">
                <Crown size={16} className="text-amber-500" />
                <span className="hidden sm:block">Halo, Owner</span>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 p-2 text-[14px] font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Keluar"
              >
                <LogOut size={18} strokeWidth={2.5} />
                <span className="hidden sm:block">Keluar</span>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Nav */}
        <div className="sm:hidden flex border-t border-gray-100 p-2 overflow-x-auto gap-2 bg-white">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/owner'
                ? pathname === '/owner'
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`inline-flex items-center gap-2 px-4 py-2 text-[13px] font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#F0FFF4] text-[#2D6A4F]'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <link.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                {link.name}
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
        {children}
      </main>
      {/* ── Custom Logout Modal ── */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 flex flex-col items-center gap-5 animate-in zoom-in-95 duration-200">
            {/* Ikon Peringatan */}
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle size={32} className="text-red-500" />
            </div>

            {/* Teks */}
            <div className="text-center">
              <h2 className="text-lg font-black text-gray-900 mb-1">Konfirmasi Keluar</h2>
              <p className="text-sm text-gray-500">Apakah Anda yakin ingin keluar dari sistem?</p>
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-3 w-full mt-1">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm shadow-red-200"
              >
                <LogOut size={15} />
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
