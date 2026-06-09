'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Plus, Loader2, Trash2, RefreshCw, Image as ImageIcon } from 'lucide-react';

export default function AdminKatalogPage() {
  const [ternakData, setTernakData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk mengambil data dari Supabase
  const fetchKatalog = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('katalog_ternak')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTernakData(data || []);
    } catch (error) {
      console.error('Gagal mengambil data katalog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKatalog();
  }, []);

  const formatRp = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
  };

  // Fungsi untuk mengubah status (Tersedia <-> Terjual)
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Tersedia' ? 'Terjual' : 'Tersedia';
    try {
      const { error } = await supabase
        .from('katalog_ternak')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Update state lokal agar tidak perlu refresh halaman
      setTernakData(ternakData.map(t => t.id === id ? { ...t, status: newStatus } : t));
    } catch (error) {
      alert('Gagal mengubah status');
      console.error(error);
    }
  };

  // Fungsi untuk menghapus data ternak
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(`Yakin ingin menghapus ternak dengan ID ${id}?`);
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('katalog_ternak')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTernakData(ternakData.filter(t => t.id !== id));
    } catch (error) {
      alert('Gagal menghapus data');
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[80vh]">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#2D6A4F] mb-1">Katalog Ternak</h1>
          <p className="text-gray-500 text-sm">
            Kelola ketersediaan, harga, dan data domba yang tampil di halaman pembeli.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={fetchKatalog}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
          >
            <RefreshCw size={16} /> Segarkan
          </button>
          
          <Link 
            href="/admin/tambah-ternak"
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#2D6A4F] hover:bg-[#1B4332] rounded-xl transition-colors shadow-sm"
          >
            <Plus size={18} strokeWidth={2.5} /> Tambah Ternak
          </Link>
        </div>
      </div>

      {/* Tabel Data */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400">
          <Loader2 size={40} className="animate-spin mb-4 text-[#2D6A4F]" />
          <p>Memuat data katalog...</p>
        </div>
      ) : ternakData.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
          <ImageIcon size={48} className="text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Belum ada data ternak di katalog.</p>
          <p className="text-gray-400 text-sm mt-1">Klik tombol "Tambah Ternak" di atas untuk mulai berjualan.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-[13px] uppercase tracking-wider">
                <th className="pb-4 font-semibold pl-4">Foto & ID</th>
                <th className="pb-4 font-semibold">Spesifikasi</th>
                <th className="pb-4 font-semibold">Harga Jual</th>
                <th className="pb-4 font-semibold">Status</th>
                <th className="pb-4 font-semibold text-right pr-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[14px]">
              {ternakData.map((ternak) => (
                <tr key={ternak.id} className="hover:bg-gray-50 transition-colors">
                  
                  {/* Kolom Foto & ID */}
                  <td className="py-4 pl-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {ternak.image_url ? (
                        <img src={ternak.image_url} alt={ternak.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={20} className="text-gray-300" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{ternak.id}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{ternak.name}</p>
                    </div>
                  </td>

                  {/* Kolom Spesifikasi */}
<td className="py-4">
  <div className="flex flex-col gap-1.5">
    {/* Barisan Badge */}
    <div className="flex flex-wrap gap-2">
      <span className="inline-block bg-[#F0FFF4] text-[#2D6A4F] text-[11px] px-2 py-0.5 rounded-md font-bold w-fit">
        {ternak.breed}
      </span>
      {/* 🟢 Badge Vaksin (Mendeteksi "Vaksin") */}
      <span className={`inline-block text-[11px] px-2 py-0.5 rounded-md font-bold w-fit ${
        (ternak.vaksin || 'Vaksin') === 'Vaksin' 
          ? 'bg-blue-50 text-blue-600' 
          : 'bg-orange-50 text-orange-600'
      }`}>
        {ternak.vaksin || 'Vaksin'}
      </span>
    </div>
    {/* Berat & Gender */}
    <span className="text-gray-600 text-[13px] font-medium">
      {ternak.gender} • {ternak.weight} Kg
    </span>
  </div>
</td>

                  {/* Kolom Harga */}
                  <td className="py-4 font-bold text-gray-800">
                    {formatRp(ternak.total_price)}
                  </td>

                  {/* Kolom Status */}
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      ternak.status === 'Tersedia' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {ternak.status}
                    </span>
                  </td>

                  {/* Kolom Aksi */}
                  <td className="py-4 pr-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {ternak.status === 'Tersedia' && (
                        <button
                          onClick={() => handleToggleStatus(ternak.id, ternak.status)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
                        >
                          Tandai Terjual
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(ternak.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Data"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}