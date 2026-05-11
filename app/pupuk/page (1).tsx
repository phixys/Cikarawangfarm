'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle2,
  Truck,
  Users,
  Minus,
  Plus,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';

/* ─────────────────────────────────────────
   NAVBAR
───────────────────────────────────────── */
function Navbar() {
  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Katalog Ternak', href: '/katalog-ternak' },
    { label: 'Paket Aqiqah', href: '/paket-aqiqah' },
    { label: 'Pupuk', href: '/pupuk', active: true },
    { label: 'Status Pesanan', href: '/status-pesanan' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#2D6A4F] w-full">
      <div className="max-w-[1200px] mx-auto px-6 h-[64px] flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
            <Image src="/logo.png" alt="Cikarawang Farm" width={32} height={32} className="object-contain" />
          </div>
          <span className="text-white font-bold text-[15px] whitespace-nowrap">Cikarawang Farm</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[13px] font-medium px-4 py-1.5 rounded-full transition-colors duration-150 ${
                link.active
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/masuk"
            className="text-[13px] font-medium text-white border border-white/80 rounded-full px-5 py-1.5 hover:bg-white/10 transition-colors duration-150"
          >
            Masuk
          </Link>
          <Link
            href="/daftar"
            className="text-[13px] font-semibold text-[#2D6A4F] bg-white rounded-full px-5 py-1.5 hover:bg-[#F0FFF4] transition-colors duration-150"
          >
            Daftar
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────
   FOOTER
───────────────────────────────────────── */
function Footer() {
  const navLinks = ['Beranda', 'Katalog Ternak', 'Paket Aqiqah', 'Status Pesanan'];
  const navHrefs = ['/', '/katalog-ternak', '/paket-aqiqah', '/status-pesanan'];

  return (
    <footer className="bg-[#2D6A4F] text-white pt-14 pb-8 px-8">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        {/* Col 1 — Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              <Image src="/logo.png" alt="Logo" width={30} height={30} className="object-contain" />
            </div>
            <span className="text-white font-semibold text-[15px]">Cikarawang Farm</span>
          </div>
          <p className="text-white/65 text-[13px] leading-relaxed">
            Peternakan terpadu yang menyediakan hewan ternak berkualitas, paket aqiqah terpercaya,
            dan pupuk organik premium untuk mendukung pertanian berkelanjutan.
          </p>
        </div>

        {/* Col 2 — Navigasi */}
        <div>
          <h4 className="text-white font-semibold text-[14px] mb-4">Navigasi</h4>
          <ul className="space-y-2.5">
            {navLinks.map((label, i) => (
              <li key={label}>
                <Link href={navHrefs[i]} className="text-white/65 text-[13px] hover:text-white transition-colors duration-150">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Kontak (NO icons) */}
        <div>
          <h4 className="text-white font-semibold text-[14px] mb-4">Kontak</h4>
          <ul className="space-y-2.5">
            <li className="text-white/65 text-[13px]">Cikarawang, Bogor</li>
            <li className="text-white/65 text-[13px]">0812-3456-789</li>
            <li className="text-white/65 text-[13px]">info@cikarawangfarm.id</li>
          </ul>
        </div>

        {/* Col 4 — Sosial Media */}
        <div>
          <h4 className="text-white font-semibold text-[14px] mb-4">Sosial Media</h4>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/35 transition-colors duration-150">
              <MessageCircle size={18} />
            </a>
            <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/35 transition-colors duration-150">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/35 transition-colors duration-150">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-[1200px] mx-auto border-t border-white/15 pt-6 text-center">
        <p className="text-white/45 text-[12px]">© 2024 Cikarawang Farm. Semua hak dilindungi.</p>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function PupukPage() {
  const [qty, setQty] = useState(1);

  const decrement = () => setQty((q) => Math.max(1, q - 1));
  const increment = () => setQty((q) => q + 1);

  const features = [
    '100% Organik & Alami',
    'Kaya Nutrisi Essensial (N, P, K)',
    'Memperbaiki Struktur Tanah',
  ];

  const benefits = [
    {
      icon: <ShieldCheck size={26} />,
      title: 'Kualitas Terjamin',
      desc: 'Diproses dengan standar tinggi untuk memastikan nutrisi terbaik.',
    },
    {
      icon: <Truck size={26} />,
      title: 'Proses Cepat',
      desc: 'Pesanan Anda segera diproses dan siap untuk digunakan.',
    },
    {
      icon: <Users size={26} />,
      title: 'Mendukung Petani Lokal',
      desc: 'Produksi langsung dari peternakan Cikarawang Farm.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0FFF4] font-poppins flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero Text ── */}
        <section className="py-16 px-6 text-center">
          <div className="max-w-[780px] mx-auto">
            <h1 className="text-[#2D6A4F] font-bold text-[2rem] md:text-[2.4rem] leading-snug mb-5">
              Pupuk Organik Premium Cikarawang Farm – Nutrisi Alami Terbaik untuk Tanaman Anda
            </h1>
            <p className="text-gray-600 text-[15px] leading-relaxed">
              Tingkatkan hasil panen dan suburkan tanah Anda dengan pupuk organik berkualitas tinggi
              yang ramah lingkungan. Dibuat dari bahan alami pilihan untuk pertumbuhan tanaman yang optimal.
            </p>
          </div>
        </section>

        {/* ── Product Card ── */}
        <section className="px-6 pb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-7 md:p-10 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

              {/* Left — Image */}
              <div className="w-full rounded-xl overflow-hidden bg-[#6B8E73] aspect-[4/5] relative flex items-center justify-center">
                <Image
                  src="/pupuk.png"
                  alt="Pupuk Organik Kotoran Domba"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Right — Details */}
              <div className="flex flex-col">
                <h2 className="text-[#2D6A4F] font-bold text-[1.55rem] leading-snug mb-5">
                  Pupuk Organik Kotoran Domba (Per Karung)
                </h2>

                {/* Feature checklist */}
                <ul className="flex flex-col gap-3 mb-5">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <CheckCircle2 size={18} className="text-gray-700 shrink-0" strokeWidth={2} />
                      <span className="text-[14px] text-gray-700">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Weight */}
                <p className="text-gray-500 text-[13.5px] mb-3">
                  Berat: 30 kg - 35 kg per Karung
                </p>

                {/* Price */}
                <p className="text-[#2D6A4F] text-[2rem] font-bold leading-none mb-6">
                  Rp 10.000 / Karung
                </p>

                {/* Quantity selector */}
                <div className="flex items-center gap-0 mb-6 w-fit">
                  <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                    <button
                      onClick={decrement}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors duration-150"
                      aria-label="Kurangi"
                    >
                      <Minus size={15} strokeWidth={2.5} />
                    </button>
                    <span className="w-10 text-center text-[14px] font-semibold text-gray-900 border-x border-gray-300 h-10 flex items-center justify-center">
                      {qty}
                    </span>
                    <button
                      onClick={increment}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors duration-150"
                      aria-label="Tambah"
                    >
                      <Plus size={15} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                {/* CTA */}
                <button className="w-full bg-[#40916C] text-white font-semibold text-[14.5px] py-3.5 rounded-full hover:bg-[#2D6A4F] transition-colors duration-150">
                  Pesan Sekarang
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Benefits ── */}
        <section className="px-6 py-16">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((b) => (
              <div key={b.title} className="flex flex-col items-center text-center">
                <div className="bg-[#74C69D] text-white p-4 rounded-full inline-flex items-center justify-center mb-5">
                  {b.icon}
                </div>
                <h3 className="text-[#2D6A4F] font-bold text-[16px] mb-2">{b.title}</h3>
                <p className="text-gray-600 text-[13.5px] leading-relaxed max-w-[220px]">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
