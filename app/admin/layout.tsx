'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ClipboardList, Library, LogOut, UserCircle, Package } from 'lucide-react'; // 🟢 Tambahan icon Package

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    // Fungsi untuk keluar/logout dari akun Admin
    const confirmLogout = window.confirm('Apakah Anda yakin ingin keluar dari Panel Admin?');
    if (!confirmLogout) return;

    await supabase.auth.signOut();
    router.push('/masuk'); 
  };

  // 🟢 INI DIA RAHASIANYA: Tinggal tambahin di daftar array ini!
  const navLinks = [
    { name: 'Kelola Pesanan', href: '/admin/pesanan', icon: ClipboardList },
    { name: 'Katalog Ternak', href: '/admin/katalog', icon: Library },
    { name: 'Stok Pupuk', href: '/admin/stok-pupuk', icon: Package }, // <-- TAMBAHAN BARU
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── TOP NAVBAR ── */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Kiri: Logo & Menu Utama */}
            <div className="flex items-center gap-8">
              {/* Logo Cikarawang Farm */}
              <div className="flex-shrink-0 flex items-center gap-2.5">
                <div className="w-9 h-9 bg-[#2D6A4F] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  CF
                </div>
                <span className="font-bold text-gray-900 text-lg hidden sm:block">Admin Panel</span>
              </div>

              {/* Menu Desktop */}
              <div className="hidden sm:flex sm:space-x-2">
                {navLinks.map((link) => {
                  // Mengecek apakah URL saat ini sedang aktif di menu tersebut
                  const isActive = pathname.startsWith(link.href);
                  
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

            {/* Kanan: Profil & Tombol Keluar */}
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <UserCircle size={20} className="text-[#2D6A4F]" />
                <span className="hidden sm:block">Halo, Admin</span>
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
        
        {/* Menu Mobile (Muncul khusus di layar HP) */}
        <div className="sm:hidden flex border-t border-gray-100 p-2 overflow-x-auto gap-2 bg-white">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
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

      {/* ── MAIN CONTENT (Halaman admin akan muncul di dalam sini) ── */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
        {children}
      </main>
    </div>
  );
}