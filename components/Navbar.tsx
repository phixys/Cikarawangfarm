import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  { label: 'Beranda', href: '/', active: true },
  { label: 'Katalog Ternak', href: '/katalog-ternak' },
  { label: 'Paket Aqiqah', href: '/paket-aqiqah' },
  { label: 'Pupuk', href: '/pupuk' },
  { label: 'Status Pesanan', href: '/status-pesanan' },
];

export default function Navbar() {
  return (
    <nav className="bg-primary-dark sticky top-0 z-50 w-full">
      <div className="max-w-[1200px] mx-auto px-6 h-[64px] flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/Logo.png"
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
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`
                text-[13px] font-medium px-4 py-1.5 rounded-full transition-colors duration-150
                ${link.active
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:text-white hover:bg-white/10'}
              `}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/masuk"
            className="text-[13px] font-medium text-white border border-white/80 rounded-full px-4 py-1.5 hover:bg-white/10 transition-colors duration-150"
          >
            Masuk
          </Link>
          <Link
            href="/daftar"
            className="text-[13px] font-semibold text-primary-dark bg-primary-tint rounded-full px-4 py-1.5 hover:bg-white transition-colors duration-150"
          >
            Daftar
          </Link>
        </div>
      </div>
    </nav>
  );
}
