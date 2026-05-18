'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Loader2, Eye, CheckCircle2, Clock, XCircle, 
  Search, Filter, Receipt, MapPin, Phone, User,
  Truck, ChefHat, Package, Store, ClipboardCheck
} from 'lucide-react';

export default function AdminPesananPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Ambil data dari Supabase
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pesanan')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Gagal memuat pesanan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatRp = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  // Fungsi untuk mendapatkan link gambar bukti transfer
  const getImageUrl = (path: string) => {
    if (!path) return '';
    const { data } = supabase.storage.from('bukti_transfer').getPublicUrl(path);
    return data.publicUrl;
  };

  const openModal = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || newStatus === selectedOrder.status) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('pesanan')
        .update({ status: newStatus })
        .eq('id', selectedOrder.id);

      if (error) throw error;

      // Update state lokal biar gak perlu refresh halaman
      setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
      alert('Status pesanan berhasil diperbarui!');
      closeModal();
    } catch (error) {
      console.error('Gagal update status:', error);
      alert('Terjadi kesalahan saat memperbarui status.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter & Search Logic
  const filteredOrders = orders.filter(order => {
    const matchFilter = filter === 'Semua' || order.status === filter;
    const matchSearch = order.kode_pesanan.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        order.nama.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  // Pilihan Status Berdasarkan Jenis Pesanan (Biar Admin gak salah pilih)
  const getStatusOptions = (jenis: string, penerimaan: string) => {
    const isAmbil = penerimaan?.toLowerCase().includes('ambil');
    const ujungPengiriman = isAmbil ? 'Siap Diambil' : (jenis === 'aqiqah' ? 'Dikirim' : 'Sedang Dikirim');

    if (jenis === 'pupuk') return ['Menunggu Konfirmasi', 'Diproses', ujungPengiriman, 'Selesai', 'Dibatalkan'];
    if (jenis === 'ternak') return ['Menunggu Konfirmasi', 'Pemeriksaan Kesehatan', ujungPengiriman, 'Selesai', 'Dibatalkan'];
    return ['Menunggu Konfirmasi', 'Disembelih', 'Dimasak', ujungPengiriman, 'Selesai', 'Dibatalkan']; // Default Aqiqah
  };

  // Komponen Badge Warna Warni
  const StatusBadge = ({ status }: { status: string }) => {
    let color = 'bg-gray-100 text-gray-700 border-gray-200';
    if (status === 'Menunggu Konfirmasi') color = 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (status === 'Selesai') color = 'bg-green-100 text-green-800 border-green-200';
    if (status === 'Dibatalkan') color = 'bg-red-100 text-red-800 border-red-200';
    if (['Diproses', 'Pemeriksaan Kesehatan', 'Disembelih', 'Dimasak', 'Sedang Dikirim', 'Dikirim', 'Siap Diambil'].includes(status)) {
      color = 'bg-blue-100 text-blue-800 border-blue-200';
    }
    return <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${color}`}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      
      {/* ── HEADER & FILTER ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-6">
        <h1 className="text-2xl font-black text-gray-900 mb-6">Kelola Pesanan Masuk</h1>
        
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex w-full md:w-auto overflow-x-auto pb-2 md:pb-0 gap-2">
            {['Semua', 'Menunggu Konfirmasi', 'Dibatalkan'].map((f) => (
              <button 
                key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors border ${filter === f ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Cari kode / nama..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* ── TABEL PESANAN ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-[13px] uppercase tracking-wider">
                <th className="p-4 font-semibold">Invoice & Waktu</th>
                <th className="p-4 font-semibold">Pelanggan</th>
                <th className="p-4 font-semibold">Jenis</th>
                <th className="p-4 font-semibold">Total Tagihan</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={6} className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-[#2D6A4F] mb-2" />Memuat data pesanan...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={6} className="p-10 text-center text-gray-500">Belum ada pesanan ditemukan.</td></tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900 text-sm">{order.kode_pesanan}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{formatDate(order.created_at)}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-800 text-sm">{order.nama}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{order.whatsapp}</div>
                    </td>
                    <td className="p-4">
                      <span className="capitalize text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-md">{order.jenis_pesanan}</span>
                    </td>
                    <td className="p-4 font-bold text-[#2D6A4F] text-sm">
                      {formatRp(order.total)}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => openModal(order)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F0FFF4] text-[#2D6A4F] hover:bg-[#D1EAD8] rounded-lg text-xs font-bold transition-colors">
                        <Eye size={14} /> Kelola
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL DETAIL PESANAN ── */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row">
            
            {/* KIRI: Informasi Detail */}
            <div className="w-full md:w-1/2 p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-black text-gray-900">Detail Pesanan</h2>
                  <p className="text-sm text-gray-500">{selectedOrder.kode_pesanan}</p>
                </div>
                <button onClick={closeModal} className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full md:hidden"><XCircle size={20} /></button>
              </div>

              <div className="space-y-6">
                {/* Info Pelanggan */}
                <div>
                  <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Data Pelanggan</h3>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-3"><User size={16} className="text-gray-400 mt-0.5" /><div><p className="text-sm font-semibold text-gray-900">{selectedOrder.nama}</p></div></div>
                    <div className="flex items-start gap-3"><Phone size={16} className="text-gray-400 mt-0.5" /><div><p className="text-sm text-gray-600">{selectedOrder.whatsapp}</p></div></div>
                    <div className="flex items-start gap-3"><MapPin size={16} className="text-gray-400 mt-0.5" /><div><p className="text-sm text-gray-600 leading-relaxed">{selectedOrder.alamat} {selectedOrder.patokan && `(${selectedOrder.patokan})`}</p></div></div>
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                {/* Info Produk */}
                <div>
                  <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Detail Belanjaan</h3>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-sm font-bold text-gray-800 leading-relaxed mb-2">{selectedOrder.produk}</p>
                    <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Subtotal:</span><span className="font-semibold text-gray-700">{formatRp(selectedOrder.subtotal)}</span></div>
                    <div className="flex justify-between text-xs text-gray-500 mb-3"><span>Ongkos Kirim:</span><span className="font-semibold text-gray-700">{selectedOrder.ongkir === 0 ? 'Gratis' : formatRp(selectedOrder.ongkir)}</span></div>
                    <div className="flex justify-between text-sm items-center border-t border-gray-200 pt-2"><span className="font-bold text-gray-800">Total Tagihan:</span><span className="font-black text-[#2D6A4F] text-lg">{formatRp(selectedOrder.total)}</span></div>
                  </div>
                </div>

                {/* Update Status */}
                <div className="bg-[#F0FFF4] rounded-xl p-4 border border-[#bbf7d0]">
                  <h3 className="text-[12px] font-bold text-[#2D6A4F] mb-2">Update Status Pesanan</h3>
                  <div className="flex gap-2">
                    <select 
                      value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                      className="flex-1 bg-white border border-[#a7f3d0] rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 font-medium"
                    >
                      {getStatusOptions(selectedOrder.jenis_pesanan, selectedOrder.penerimaan).map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <button 
                      onClick={handleUpdateStatus} disabled={isUpdating || newStatus === selectedOrder.status}
                      className="bg-[#2D6A4F] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#1B4332] disabled:opacity-50 transition-colors flex items-center justify-center min-w-[100px]"
                    >
                      {isUpdating ? <Loader2 size={16} className="animate-spin" /> : 'Simpan'}
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* KANAN: Bukti Transfer */}
            <div className="w-full md:w-1/2 bg-gray-50 p-6 md:p-8 flex flex-col items-center justify-center relative">
              <button onClick={closeModal} className="absolute top-6 right-6 p-2 bg-white hover:bg-gray-100 text-gray-600 rounded-full shadow-sm hidden md:block"><XCircle size={24} /></button>
              
              <div className="w-full max-w-sm flex flex-col items-center text-center">
                <Receipt size={40} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">Bukti Pembayaran QRIS</h3>
                <p className="text-xs text-gray-500 mb-6">Silakan cek kecocokan nominal dengan mutasi rekening sebelum memproses pesanan.</p>

                <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-3 overflow-hidden">
                  {selectedOrder.bukti_transfer ? (
                    <a href={getImageUrl(selectedOrder.bukti_transfer)} target="_blank" rel="noopener noreferrer" className="block relative aspect-[3/4] w-full group overflow-hidden rounded-xl bg-gray-100">
                      <img src={getImageUrl(selectedOrder.bukti_transfer)} alt="Bukti Transfer" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-bold backdrop-blur-sm">
                        Klik untuk Perbesar
                      </div>
                    </a>
                  ) : (
                    <div className="aspect-[3/4] w-full flex flex-col items-center justify-center bg-gray-100 rounded-xl border border-dashed border-gray-300 text-gray-400">
                      <XCircle size={32} className="mb-2" />
                      <p className="text-xs">Tidak ada bukti transfer</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}