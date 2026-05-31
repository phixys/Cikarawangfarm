'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  TrendingUp, DollarSign, Package, Clock, 
  Activity, ShoppingBag, Baby, Leaf, Loader2 
} from 'lucide-react';
import Link from 'next/link';

function formatRp(angka: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
}

export default function OwnerDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    pendapatan: 0,
    totalPesanan: 0,
    menunggu: 0,
    selesai: 0,
  });
  
  const [kategori, setKategori] = useState({ ternak: 0, aqiqah: 0, pupuk: 0 });
  const [pesananTerbaru, setPesananTerbaru] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Ambil semua data pesanan
        const { data: pesanan, error } = await supabase
          .from('pesanan')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (!pesanan) return;

        // Kalkulasi Statistik
        let totalPendapatan = 0;
        let totalMenunggu = 0;
        let totalSelesai = 0;
        
        let countTernak = 0;
        let countAqiqah = 0;
        let countPupuk = 0;

        pesanan.forEach((p) => {
          // Hitung pendapatan hanya dari pesanan yang "Selesai" atau "Sedang Dikirim"
          if (p.status === 'Selesai' || p.status.includes('Dikirim') || p.status.includes('Diambil')) {
            totalPendapatan += p.total;
            totalSelesai++;
          }
          
          if (p.status === 'Menunggu Konfirmasi') totalMenunggu++;

          // Hitung Kategori
          if (p.jenis_pesanan === 'ternak') countTernak++;
          else if (p.jenis_pesanan === 'aqiqah') countAqiqah++;
          else if (p.jenis_pesanan === 'pupuk') countPupuk++;
        });

        setStats({
          pendapatan: totalPendapatan,
          totalPesanan: pesanan.length,
          menunggu: totalMenunggu,
          selesai: totalSelesai,
        });

        setKategori({ ternak: countTernak, aqiqah: countAqiqah, pupuk: countPupuk });
        setPesananTerbaru(pesanan.slice(0, 5)); // Ambil 5 pesanan terakhir

      } catch (err) {
        console.error('Gagal mengambil data dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 size={40} className="animate-spin text-[#2D6A4F]" /></div>;
  }

  // Hitung persentase untuk progress bar
  const totalKategori = kategori.ternak + kategori.aqiqah + kategori.pupuk || 1; 

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Executive Dashboard</h1>
            <p className="text-gray-500 mt-1">Ringkasan performa bisnis Cikarawang Farm secara Real-Time.</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm text-sm font-semibold text-gray-700">
            <Activity size={18} className="text-[#2D6A4F]" /> Status Sistem: <span className="text-green-600">Online</span>
          </div>
        </div>

        {/* ── STATISTIC CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Pendapatan */}
          <div className="bg-[#2D6A4F] rounded-3xl p-6 text-white shadow-lg shadow-green-900/10 relative overflow-hidden">
            <DollarSign size={100} className="absolute -right-6 -bottom-4 text-white/10" />
            <p className="text-green-100 font-medium text-sm mb-2 uppercase tracking-wider">Total Pendapatan</p>
            <h2 className="text-3xl font-black">{formatRp(stats.pendapatan)}</h2>
          </div>

          {/* Card 2: Total Pesanan */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <Package size={100} className="absolute -right-6 -bottom-4 text-gray-50" />
            <p className="text-gray-500 font-medium text-sm mb-2 uppercase tracking-wider">Total Pesanan</p>
            <h2 className="text-3xl font-black text-gray-900">{stats.totalPesanan} <span className="text-lg text-gray-400 font-semibold">Transaksi</span></h2>
          </div>

          {/* Card 3: Menunggu Konfirmasi */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <Clock size={100} className="absolute -right-6 -bottom-4 text-gray-50" />
            <p className="text-yellow-600 font-medium text-sm mb-2 uppercase tracking-wider">Menunggu Diproses</p>
            <h2 className="text-3xl font-black text-gray-900">{stats.menunggu} <span className="text-lg text-gray-400 font-semibold">Antrean</span></h2>
          </div>

          {/* Card 4: Pesanan Selesai */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <TrendingUp size={100} className="absolute -right-6 -bottom-4 text-gray-50" />
            <p className="text-blue-600 font-medium text-sm mb-2 uppercase tracking-wider">Pesanan Sukses</p>
            <h2 className="text-3xl font-black text-gray-900">{stats.selesai} <span className="text-lg text-gray-400 font-semibold">Selesai</span></h2>
          </div>
        </div>

        {/* ── BAWAH: GRAFIK KATEGORI & PESANAN TERBARU ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KIRI: Distribusi Produk */}
          <div className="lg:col-span-1 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Distribusi Penjualan</h3>
            
            <div className="space-y-6">
              {/* Ternak */}
              <div>
                <div className="flex justify-between text-sm mb-2 font-semibold">
                  <span className="flex items-center gap-2 text-gray-700"><ShoppingBag size={16} className="text-[#2D6A4F]"/> Ternak Domba</span>
                  <span>{kategori.ternak}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-[#2D6A4F] h-2.5 rounded-full transition-all duration-1000" style={{ width: `${(kategori.ternak / totalKategori) * 100}%` }}></div>
                </div>
              </div>

              {/* Aqiqah */}
              <div>
                <div className="flex justify-between text-sm mb-2 font-semibold">
                  <span className="flex items-center gap-2 text-gray-700"><Baby size={16} className="text-blue-500"/> Paket Aqiqah</span>
                  <span>{kategori.aqiqah}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${(kategori.aqiqah / totalKategori) * 100}%` }}></div>
                </div>
              </div>

              {/* Pupuk */}
              <div>
                <div className="flex justify-between text-sm mb-2 font-semibold">
                  <span className="flex items-center gap-2 text-gray-700"><Leaf size={16} className="text-green-500"/> Pupuk Organik</span>
                  <span>{kategori.pupuk}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${(kategori.pupuk / totalKategori) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* KANAN: Pesanan Terbaru */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">5 Pesanan Masuk Terakhir</h3>
              <Link href="/admin/pesanan" className="text-sm font-semibold text-[#2D6A4F] hover:underline">Lihat Semua</Link>
            </div>

            <div className="space-y-4">
              {pesananTerbaru.length === 0 ? (
                <p className="text-gray-500 text-sm">Belum ada data pesanan.</p>
              ) : (
                pesananTerbaru.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm ${
                        order.jenis_pesanan === 'ternak' ? 'bg-[#2D6A4F]' : order.jenis_pesanan === 'aqiqah' ? 'bg-blue-500' : 'bg-green-500'
                      }`}>
                        {order.jenis_pesanan === 'ternak' ? <ShoppingBag size={20} /> : order.jenis_pesanan === 'aqiqah' ? <Baby size={20} /> : <Leaf size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{order.nama}</p>
                        <p className="text-xs text-gray-500">{order.kode_pesanan} • {new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-[#2D6A4F]">{formatRp(order.total)}</p>
                      <p className="text-[11px] font-bold text-gray-500 uppercase">{order.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}