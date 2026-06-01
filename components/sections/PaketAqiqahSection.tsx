'use client';

import { Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

/* ─────────────────────────────────────────
   DATA PAKET (Disinkronkan dengan Katalog)
───────────────────────────────────────── */
const packages = [
  {
    slug: 'barokah',
    imgSrc: '/aqiqah.jpeg', // Pastikan gambar ada di folder public/
    badge: 'Tersedia',
    badgeClass: 'bg-white text-[#40916C] shadow-sm',
    title: 'Paket Aqiqah Barokah',
    price: 'Rp 2.500.000',
    priceClass: 'text-[#2D6A4F]',
    features: [
      '50 Box Nasi Lengkap', 
      'Isi: Nasi, 3 Sate, Gulai, Acar, Sambal Kentang',
      'Gratis Sertifikat',
      'Bisa diantar (Area Bogor)'
    ],
    btnClass: 'bg-[#40916C] hover:bg-[#2D6A4F] text-white',
  },
  {
    slug: 'premium',
    imgSrc: '/aqiqah.jpeg',
    badge: 'Terpopuler',
    badgeClass: 'bg-yellow-100 text-yellow-800 shadow-sm',
    title: 'Paket Aqiqah Premium',
    price: 'Rp 3.800.000',
    priceClass: 'text-[#2D6A4F]',
    features: [
      '70 Box Nasi Lengkap', 
      'Isi: Nasi, 3 Sate, Gulai, Acar, Sambal Kentang',
      'Gratis Sertifikat',
      'Bisa diantar (Area Bogor)'
    ],
    btnClass: 'bg-[#40916C] hover:bg-[#2D6A4F] text-white',
  },
  {
    slug: 'eksklusif',
    imgSrc: '/aqiqah.jpeg',
    badge: 'Baru',
    badgeClass: 'bg-white text-[#2D6A4F] shadow-sm',
    title: 'Paket Aqiqah Eksklusif',
    price: 'Rp 5.200.000',
    priceClass: 'text-[#2D6A4F]',
    features: [
      '100 Box Nasi Lengkap', 
      'Isi: Nasi, 3 Sate, Gulai, Acar, Sambal Kentang',
      'Gratis Sertifikat',
      'Bisa diantar (Area Bogor)'
    ],
    btnClass: 'bg-[#40916C] hover:bg-[#2D6A4F] text-white',
  },
];

export default function PaketAqiqahSection() {
  return (
    <section className="bg-white py-14 px-6">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header Section */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-[1.6rem] font-bold text-gray-900">
              Paket <span className="text-[#40916C]">Aqiqah</span>
            </h2>
            <p className="text-gray-500 text-[13.5px] mt-1">
              Pilih paket yang sesuai dengan kebutuhan Anda
            </p>
          </div>
          <Link
            href="/paket-aqiqah"
            className="text-[13px] font-medium text-[#2D6A4F] border border-[#2D6A4F] rounded-full px-4 py-1.5 hover:bg-[#F0FFF4] transition-colors duration-150 whitespace-nowrap self-start mt-1"
          >
            Lihat Semua →
          </Link>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.slug}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 flex flex-col hover:shadow-md transition-shadow duration-300"
            >
              {/* Area Gambar */}
              <div className="h-48 w-full relative bg-gray-100">
                <Image 
                  src={pkg.imgSrc} 
                  alt={pkg.title}
                  fill
                  className="object-cover"
                />
                {/* Overlay gradasi tipis agar tulisan badge selalu jelas */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
                
                <span
                  className={`absolute top-4 right-4 z-10 text-xs font-semibold px-3 py-1 rounded-full ${pkg.badgeClass}`}
                >
                  {pkg.badge}
                </span>
              </div>

              {/* Konten Text */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-[17px] text-gray-900">{pkg.title}</h3>
                <p className={`text-2xl font-bold mt-1.5 mb-5 ${pkg.priceClass}`}>{pkg.price}</p>

                {/* Features */}
                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check size={16} className="text-[#40916C] shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span className="text-[13px] text-gray-600 leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Tombol CTA */}
                <Link
                  href={`/pesan-aqiqah?paket=${pkg.slug}`}
                  className={`w-full block text-center rounded-full py-2.5 font-semibold text-[14px] transition-colors duration-150 mt-auto ${pkg.btnClass}`}
                >
                  Pesan Sekarang
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}