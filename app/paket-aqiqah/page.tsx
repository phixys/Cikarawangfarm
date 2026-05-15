'use client';

import { Check, Star } from 'lucide-react';

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const packages = [
  {
    key: 'barokah',
    topBg: 'bg-gradient-to-br from-[#40916C] to-[#2D6A4F]',
    badge: 'Tersedia',
    badgeClass: 'bg-white text-[#40916C]',
    title: 'Paket Aqiqah Barokah',
    price: 'Rp 2.500.000',
    priceClass: 'text-[#2D6A4F]',
    features: ['40–50 porsi nasi', 'Berat domba 25–30 kg', 'Bisa diantar (Sekitar Bogor)'],
    btnClass: 'bg-[#40916C] hover:bg-[#2D6A4F] text-white',
  },
  {
    key: 'premium',
    topBg: 'bg-gradient-to-br from-[#1B4332] to-[#144125]',
    badge: 'Terpopuler',
    badgeClass: 'bg-yellow-100 text-yellow-800',
    title: 'Paket Aqiqah Premium',
    price: 'Rp 3.800.000',
    priceClass: 'text-[#40916C]',
    features: ['60–70 porsi nasi', 'Berat domba 35–40 kg', 'Bisa diantar (Sekitar Bogor)'],
    btnClass: 'bg-[#2D6A4F] hover:bg-[#1B4332] text-white',
  },
  {
    key: 'eksklusif',
    topBg: 'bg-gradient-to-br from-[#74C69D] to-[#4C9A78]',
    badge: 'Baru',
    badgeClass: 'bg-white text-[#2D6A4F]',
    title: 'Paket Aqiqah Eksklusif',
    price: 'Rp 5.200.000',
    priceClass: 'text-[#2D6A4F]',
    features: ['90–100 porsi nasi', 'Berat domba 45–50 kg', 'Bisa diantar (Sekitar Bogor)'],
    btnClass: 'bg-[#40916C] hover:bg-[#2D6A4F] text-white',
  },
];

const testimonials = [
  {
    name: 'Bpk. Ahmad',
    badge: 'Pembeli Paket Premium',
    quote:
      '"Alhamdulillah, proses aqiqah anak saya sangat lancar. Dagingnya empuk dan tidak bau prengus sama sekali. Pelayanan admin sangat ramah."',
  },
  {
    name: 'Ibu Siti',
    badge: 'Pembeli Paket Eksklusif',
    quote:
      '"Sangat praktis! Dokumentasi penyembelihannya dikirim lengkap. Sangat membantu untuk kami yang sibuk. Berkah terus Cikarawang Farm."',
  },
  {
    name: 'Bpk. Rizky',
    badge: 'Pembeli Paket Barokah',
    quote:
      '"Harga terjangkau tapi kualitas bintang lima. Pengiriman tepat waktu dan packing nasinya sangat rapi. Recommended!"',
  },
];

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function PaketAqiqahPage() {
  return (
    // Saya hapus min-h-screen flex flex-col karena sudah diurus layout.tsx
    // Tinggal sisakan warna background khususnya saja
    <div className="bg-[#F0FFF4] w-full">
      {/* ── Hero ── */}
      <section className="bg-[#F0FFF4] pt-20 pb-14 px-6 text-center">
        <div className="max-w-[720px] mx-auto">
          <h1 className="text-[#2D6A4F] text-4xl md:text-5xl font-bold leading-tight mb-5">
            Layanan Aqiqah Terbaik &amp; Sesuai Syariat
          </h1>
          <p className="text-gray-600 text-[15.5px] leading-relaxed">
            Kami menyediakan paket aqiqah lengkap, higienis, dan terpercaya dengan pilihan ternak
            berkualitas langsung dari peternakan kami.
          </p>
        </div>
      </section>

      {/* ── Pricing Cards ── */}
      <section className="px-6 pb-16">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.key}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 flex flex-col"
            >
              {/* Top colored block */}
              <div className={`h-40 w-full relative ${pkg.topBg}`}>
                <span
                  className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full ${pkg.badgeClass}`}
                >
                  {pkg.badge}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <h3 className="font-bold text-[17px] text-gray-900">{pkg.title}</h3>
                <p className={`text-3xl font-bold mt-2 mb-6 ${pkg.priceClass}`}>{pkg.price}</p>

                {/* Features */}
                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <Check size={15} className="text-[#40916C] shrink-0" strokeWidth={2.5} />
                      <span className="text-[13.5px] text-gray-600">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className={`w-full rounded-full py-3 font-semibold text-[14px] transition-colors duration-150 mt-auto ${pkg.btnClass}`}
                >
                  Pesan Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[#2D6A4F] text-3xl font-bold text-center mb-10">
            Apa Kata Mereka?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full"
              >
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="italic text-gray-600 text-[15px] leading-relaxed my-4 flex-1">
                  {t.quote}
                </p>

                {/* Name */}
                <p className="text-[#2D6A4F] font-bold text-[15px]">{t.name}</p>

                {/* Package badge */}
                <span className="bg-[#E8F5E9] text-[#2D6A4F] text-xs font-medium px-3 py-1 rounded-full w-fit mt-2">
                  {t.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}