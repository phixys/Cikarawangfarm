'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  CheckCircle2,
  Truck,
  Users,
  Minus,
  Plus,
  ShieldCheck,
  Package,
} from 'lucide-react';

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function PupukPage() {
  const router = useRouter();
  
  // 🟢 State Stok Diubah menjadi Dinamis
  const [stock, setStock] = useState(0); 
  const [qty, setQty] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // 🟢 Menarik Data Stok dari Database Supabase
  useEffect(() => {
    const fetchStokPupuk = async () => {
      try {
        const { data, error } = await supabase
          .from('stok_pupuk')
          .select('jumlah')
          .eq('id', 1)
          .single();
        
        if (error) throw error;
        if (data) setStock(data.jumlah);
      } catch (err) {
        console.error('Gagal menarik stok dari database:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStokPupuk();
  }, []);

  // 🟢 Logika validasi: Tidak bisa kurang dari 1, dan tidak bisa lebih dari stok
  const decrement = () => setQty((q) => Math.max(1, q - 1));
  const increment = () => setQty((q) => (q < stock ? q + 1 : q));

  const handlePesanSekarang = () => {
    if (qty > stock) {
      alert('Maaf, jumlah pesanan melebihi stok yang tersedia.');
      return;
    }
    router.push(`/pesan-pupuk?jumlah=${qty}`);
  };

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
    <div className="bg-[#F0FFF4] w-full">
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
                src="/Pupuk.png"
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
                    <CheckCircle2 size={18} className="text-[#2D6A4F] shrink-0" strokeWidth={2} />
                    <span className="text-[14px] text-gray-700">{f}</span>
                  </li>
                ))}
              </ul>

              {/* Weight */}
              <p className="text-gray-500 text-[13.5px] mb-3">
                Berat: 30 kg - 35 kg per Karung
              </p>

              {/* Price & 🟢 INDIKATOR STOK DINAMIS */}
              <div className="flex items-center gap-4 mb-6">
                <p className="text-[#2D6A4F] text-[2rem] font-bold leading-none">
                  Rp 10.000 <span className="text-lg font-normal text-gray-500">/ Karung</span>
                </p>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold ${
                  isLoading ? 'bg-gray-100 text-gray-500' : 
                  stock > 0 ? 'bg-green-100 text-[#2D6A4F]' : 'bg-red-100 text-red-600'
                }`}>
                  <Package size={16} />
                  {isLoading ? 'Mengecek Stok...' : stock > 0 ? `Sisa Stok: ${stock}` : 'Stok Habis'}
                </div>
              </div>

              {/* Quantity selector */}
              <div className="flex items-center gap-0 mb-6 w-fit">
                <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                  <button
                    onClick={decrement}
                    disabled={qty <= 1 || stock === 0 || isLoading}
                    className={`w-10 h-10 flex items-center justify-center transition-colors duration-150 ${qty <= 1 || stock === 0 || isLoading ? 'text-gray-300 cursor-not-allowed bg-gray-50' : 'text-gray-600 hover:bg-gray-100'}`}
                    aria-label="Kurangi"
                  >
                    <Minus size={15} strokeWidth={2.5} />
                  </button>
                  <span className="w-10 text-center text-[14px] font-semibold text-gray-900 border-x border-gray-300 h-10 flex items-center justify-center">
                    {stock === 0 || isLoading ? 0 : qty}
                  </span>
                  <button
                    onClick={increment}
                    disabled={qty >= stock || stock === 0 || isLoading}
                    className={`w-10 h-10 flex items-center justify-center transition-colors duration-150 ${qty >= stock || stock === 0 || isLoading ? 'text-gray-300 cursor-not-allowed bg-gray-50' : 'text-gray-600 hover:bg-gray-100'}`}
                    aria-label="Tambah"
                  >
                    <Plus size={15} strokeWidth={2.5} />
                  </button>
                </div>
                {qty >= stock && stock > 0 && !isLoading && (
                  <span className="ml-3 text-xs text-amber-600 font-medium">Batas maksimal stok</span>
                )}
              </div>

              {/* CTA Tombol */}
              <button 
                onClick={handlePesanSekarang}
                disabled={stock === 0 || isLoading}
                className={`w-full font-semibold text-[14.5px] py-3.5 rounded-full transition-colors duration-150 ${
                  isLoading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :
                  stock > 0 ? 'bg-[#2D6A4F] text-white hover:bg-[#1B4332]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? 'Menunggu Data...' : stock > 0 ? 'Pesan Sekarang' : 'Maaf, Stok Habis'}
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
    </div>
  );
}