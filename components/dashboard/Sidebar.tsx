'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Beef,
  ShoppingBag,
  ArrowLeftRight,
  BarChart2,
  Settings,
  Users,
  ChevronDown,
} from 'lucide-react';

const mainNavItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Manajemen Ternak', href: '/dashboard/ternak', icon: Beef },
  { label: 'Pesanan', href: '/dashboard/pesanan', icon: ShoppingBag },
  { label: 'Transaksi', href: '/dashboard/transaksi', icon: ArrowLeftRight },
  { label: 'Laporan', href: '/dashboard/laporan', icon: BarChart2 },
];

const secondaryNavItems = [
  { label: 'Manajemen Akun', href: '/dashboard/akun', icon: Users },
  { label: 'Pengaturan', href: '/dashboard/pengaturan', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] min-h-screen bg-primary-dark flex flex-col shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/10">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <Image
            src="/logo.png"
            alt="Logo"
            width={28}
            height={28}
            className="rounded-full object-contain"
          />
        </div>
        <div>
          <p className="text-white font-semibold text-[13px] leading-tight">Cikarawang Farm</p>
          <p className="text-white/50 text-[10px]">Sistem Manajemen</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {mainNavItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150
                ${isActive
                  ? 'bg-white/20 text-white'
                  : 'text-white/65 hover:text-white hover:bg-white/10'}
              `}
            >
              <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}

        {/* Divider + secondary */}
        <div className="mt-4 mb-2 px-3">
          <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest">
            Pengaturan
          </p>
        </div>

        {secondaryNavItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150
                ${isActive
                  ? 'bg-white/20 text-white'
                  : 'text-white/65 hover:text-white hover:bg-white/10'}
              `}
            >
              <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Badge */}
      <div className="px-3 pb-4">
        <div className="flex items-center gap-2.5 bg-white/10 rounded-xl px-3 py-2.5 cursor-pointer hover:bg-white/15 transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-[12px]">BH</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[12px] font-semibold truncate">Bapak Hendra</p>
            <p className="text-white/50 text-[10px]">Owner · Administrator</p>
          </div>
          <ChevronDown size={13} className="text-white/40 shrink-0" />
        </div>
      </div>
    </aside>
  );
}
