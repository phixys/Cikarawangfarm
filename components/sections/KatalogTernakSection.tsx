'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import CatalogCard from '@/components/catalog/CatalogCard';
import { Loader2 } from 'lucide-react';

export default function KatalogTernakSection() {
  const [ternakTerbaru, setTernakTerbaru] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchLatestAnimals = async () => {
      try {
        const { data, error } = await supabase
          .from('katalog_ternak')
          .select('*')
          .eq('status', 'Tersedia')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) throw error;

        const mappedData = (data || []).map((item) => ({
          ...item,
          totalPrice: item.total_price,
          imageUrl: item.image_url,
        }));

        setTernakTerbaru(mappedData);
      } catch (err) {
        console.error('Gagal memuat ternak beranda:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestAnimals();
  }, []);

  // 🟢 LOGIKA AUTO-SCROLL (GESER PER HALAMAN/LAYAR)
  useEffect(() => {
    if (ternakTerbaru.length === 0 || isHovered) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        
        // 🟢 Geser sejauh lebar container yang terlihat (langsung 3 card sekaligus)
        const scrollAmount = container.clientWidth; 

        // Cek apakah sudah mentok ujung kanan (dengan toleransi sedikit)
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
          // Balik ke awal
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Geser ke kanan 1 halaman (3 card)
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 4000); // 🟢 Diperlama jadi 4 detik (4000ms) agar pembeli sempat membaca 3 card

    return () => clearInterval(interval);
  }, [ternakTerbaru, isHovered]);

  return (
    <section className="bg-primary-tint py-14 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Header row */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-[1.6rem] font-bold text-gray-900">
              Katalog <span className="text-primary-medium">Ternak</span>
            </h2>
            <p className="text-gray-500 text-[13.5px] mt-1">
              Ternak segar langsung dari kandang kami
            </p>
          </div>
          <Link
            href="/katalog-ternak"
            className="text-[13px] font-medium text-primary-dark border border-primary-dark rounded-full px-4 py-1.5 hover:bg-primary-tint2 transition-colors duration-150 whitespace-nowrap self-start mt-1"
          >
            Lihat Semua →
          </Link>
        </div>

        {/* Area Card Carousel */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white/50 rounded-3xl border border-white">
            <Loader2 size={36} className="animate-spin text-primary-dark mb-3" />
            <p className="text-sm text-gray-500 font-medium">Memanggil domba dari kandang...</p>
          </div>
        ) : ternakTerbaru.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white/50 rounded-3xl border-2 border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">Belum ada ternak yang tersedia saat ini.</p>
          </div>
        ) : (
          <div 
            ref={scrollRef} 
            onMouseEnter={() => setIsHovered(true)}   
            onMouseLeave={() => setIsHovered(false)}  
            className="flex overflow-x-auto gap-5 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {ternakTerbaru.map((animal) => (
              <div 
                key={animal.id} 
                // 🟢 PERHITUNGAN CSS MATEMATIKA (Membagi lebar pas untuk 3 card di Laptop)
                // HP: 1 Card (w-full), Tablet: 2 Card (50% - gap), Laptop: 3 Card (33% - gap)
                className="shrink-0 w-full sm:w-[calc((100%-20px)/2)] md:w-[calc((100%-40px)/3)]"
              >
                <CatalogCard animal={animal} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}