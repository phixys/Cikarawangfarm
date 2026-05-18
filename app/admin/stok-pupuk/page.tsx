'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Package, Plus, Minus, Save, Loader2, RefreshCw, ShoppingBag } from 'lucide-react';

export default function AdminStokPupuk() {
  const [stok, setStok] = useState(0);
  const [terjual, setTerjual] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // State untuk input penambahan/pengurangan manual
  const [ubahStok, setUbahStok] = useState<number | ''>('');

  const fetchStok = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('stok_pupuk')
        .select('*')
        .eq('id', 1)
        .single();
        
      if (error) throw error;
      if (data) {
        setStok(data.jumlah);
        setTerjual(data.terjual);
      }
    } catch (err) {
      console.error('Gagal mengambil data stok:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStok();
  }, []);

  const handleSimpanStok = async (tipe: 'tambah' | 'kurang' | 'set') => {
    if (ubahStok === '' || isNaN(Number(ubahStok))) return;
    
    let stokBaru = stok;
    const nilaiInput = Number(ubahStok);

    if (tipe === 'tambah') stokBaru = stok + nilaiInput;
    if (tipe === 'kurang') stokBaru = Math.max(0, stok - nilaiInput); // Tidak boleh minus
    if (tipe === 'set') stokBaru = Math.max(0, nilaiInput);

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('stok_pupuk')
        .update({ jumlah: stokBaru, updated_at: new Date().toISOString() })
        .eq('id', 1);

      if (error) throw error;
      
      setStok(stokBaru);
      setUbahStok('');
      alert('✅ Stok pupuk berhasil diperbarui!');
    } catch (err) {
      console.error('Gagal update stok:', err);
      alert('Gagal menyimpan stok. Cek koneksi Anda.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#2D6A4F]" size={40} /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Manajemen Stok Pupuk</h1>
          <p className="text-gray-500 text-sm mt-1">Atur ketersediaan karung pupuk organik untuk katalog pembeli.</p>
        </div>
        <button onClick={fetchStok} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors shadow-sm">
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Card Stok Tersedia */}
        <div className="bg-[#2D6A4F] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-green-900/20">
          <Package size={120} className="absolute -right-6 -bottom-6 text-white/10" />
          <p className="text-green-100 font-semibold mb-2 flex items-center gap-2"><Package size={18} /> Sisa Stok Tersedia</p>
          <div className="flex items-end gap-3">
            <h2 className="text-6xl font-black">{stok}</h2>
            <span className="text-green-200 font-medium pb-2">Karung</span>
          </div>
        </div>

        {/* Card Terjual */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 relative overflow-hidden shadow-sm">
          <ShoppingBag size={120} className="absolute -right-6 -bottom-6 text-gray-50" />
          <p className="text-gray-500 font-semibold mb-2 flex items-center gap-2"><ShoppingBag size={18} /> Total Terjual</p>
          <div className="flex items-end gap-3">
            <h2 className="text-6xl font-black text-gray-900">{terjual}</h2>
            <span className="text-gray-400 font-medium pb-2">Karung</span>
          </div>
        </div>
      </div>

      {/* Kontrol Update Stok */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Ubah Jumlah Stok</h3>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input 
            type="number" 
            value={ubahStok}
            onChange={(e) => setUbahStok(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="Masukkan angka..."
            className="w-full sm:w-48 text-center text-xl font-bold py-4 bg-gray-50 border border-gray-300 rounded-2xl outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 transition-all"
          />
          
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <button 
              onClick={() => handleSimpanStok('tambah')} disabled={isSaving || !ubahStok}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#E6F4EA] hover:bg-[#D1EAD8] text-[#2D6A4F] font-bold px-6 py-4 rounded-2xl transition-colors disabled:opacity-50"
            >
              <Plus size={20} /> Tambah
            </button>
            <button 
              onClick={() => handleSimpanStok('kurang')} disabled={isSaving || !ubahStok}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold px-6 py-4 rounded-2xl transition-colors disabled:opacity-50"
            >
              <Minus size={20} /> Kurangi
            </button>
            <button 
              onClick={() => handleSimpanStok('set')} disabled={isSaving || !ubahStok}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-4 rounded-2xl transition-colors disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Set Tepat
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">Gunakan tombol "Set Tepat" jika Anda ingin menimpa angka stok secara langsung (contoh: restock besar-besaran).</p>
      </div>
    </div>
  );
}