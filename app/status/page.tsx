'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  Search, Loader2, FileSearch, Check, ChefHat, Truck,
  MessageCircle, Package, AlertCircle, XCircle, Clock, 
  Store, ClipboardCheck 
} from 'lucide-react';

/* ─────────────────────────────────────────
   STEPPER DINAMIS & OTOMATIS (3 JALUR)
───────────────────────────────────────── */
type StepStatus = 'done' | 'current' | 'pending';

interface Step {
  label: string;
  status: StepStatus;
  icon: React.ReactNode;
}

function Stepper({ 
  jenisPesanan, 
  isCancelled, 
  penerimaan, 
  currentDbStatus 
}: { 
  jenisPesanan: string, 
  isCancelled: boolean, 
  penerimaan: string, 
  currentDbStatus: string 
}) {
  
  const isAmbilSendiri = penerimaan?.toLowerCase().includes('ambil');
  let rawSteps: { label: string, icon: React.ReactNode }[] = [];
  let judulLacak = '';

  // 🟢 LOGIKA JALUR DINAMIS (PUPUK, TERNAK, AQIQAH)
  if (jenisPesanan === 'pupuk') {
    judulLacak = 'Pesanan Pupuk';
    rawSteps = [
      { label: 'Menunggu Konfirmasi', icon: <Clock size={16} strokeWidth={2} /> },
      { label: 'Diproses', icon: <Package size={16} strokeWidth={2} /> },
      { label: isAmbilSendiri ? 'Siap Diambil' : 'Sedang Dikirim', icon: isAmbilSendiri ? <Store size={16} strokeWidth={2} /> : <Truck size={16} strokeWidth={2} /> },
      { label: 'Selesai', icon: <Check size={16} strokeWidth={3} /> },
    ];
  } else if (jenisPesanan === 'ternak') {
    judulLacak = 'Pesanan Ternak Domba';
    rawSteps = [
      { label: 'Menunggu Konfirmasi', icon: <Clock size={16} strokeWidth={2} /> },
      { label: 'Pemeriksaan Kesehatan', icon: <ClipboardCheck size={16} strokeWidth={2} /> }, 
      { label: isAmbilSendiri ? 'Siap Diambil' : 'Sedang Dikirim', icon: isAmbilSendiri ? <Store size={16} strokeWidth={2} /> : <Truck size={16} strokeWidth={2} /> },
      { label: 'Selesai', icon: <Check size={16} strokeWidth={3} /> },
    ];
  } else {
    // Default / Aqiqah
    judulLacak = 'Pesanan Aqiqah';
    rawSteps = [
      { label: 'Menunggu Konfirmasi', icon: <Clock size={16} strokeWidth={2} /> },
      { label: 'Disembelih', icon: <Check size={16} strokeWidth={3} /> },
      { label: 'Dimasak', icon: <ChefHat size={16} strokeWidth={2} /> },
      { label: isAmbilSendiri ? 'Siap Diambil' : 'Dikirim', icon: isAmbilSendiri ? <Store size={16} strokeWidth={2} /> : <Truck size={16} strokeWidth={2} /> },
    ];
  }

  // PENCARI POSISI OTOMATIS
  let activeIndex = 0;
  const exactIndex = rawSteps.findIndex(step => step.label === currentDbStatus);
  
  if (exactIndex !== -1) {
    activeIndex = exactIndex; 
  } else {
    // Fallback pencocokan status kasar
    if (['Disembelih', 'Dikemas', 'Diproses', 'Pemeriksaan Kesehatan'].includes(currentDbStatus)) activeIndex = 1;
    else if (['Dimasak', 'Siap Kirim', 'Sedang Dikirim', 'Siap Diambil'].includes(currentDbStatus)) activeIndex = 2;
    else if (['Dikirim', 'Selesai'].includes(currentDbStatus)) activeIndex = 3;
  }

  const steps: Step[] = rawSteps.map((step, index) => {
    let status: StepStatus = 'pending';
    if (index < activeIndex) status = 'done';
    if (index === activeIndex) status = 'current';
    return { ...step, status };
  });

  return (
    <div className={`bg-[#FAFAFA] px-8 py-10 border-b border-gray-100 overflow-x-auto transition-opacity ${isCancelled ? 'opacity-40 grayscale' : ''}`}>
      <p className="text-center text-[14px] font-semibold text-gray-700 mb-8">
        {isCancelled ? 'Pesanan Telah Dibatalkan' : `Lacak Proses ${judulLacak}`}
      </p>

      <div className="flex items-center justify-center min-w-max px-4">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              {step.status === 'done' && (
                <div className="w-10 h-10 rounded-full bg-[#40916C] flex items-center justify-center text-white shadow-sm">
                  {step.icon}
                </div>
              )}
              {step.status === 'current' && (
                <div className="w-10 h-10 rounded-full border-4 border-[#40916C] bg-white flex items-center justify-center shadow-sm">
                  {!isCancelled && <div className="w-3 h-3 rounded-full bg-[#40916C] animate-pulse" />}
                </div>
              )}
              {step.status === 'pending' && (
                <div className="w-10 h-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center text-gray-400">
                  {step.icon}
                </div>
              )}

              <span className={`text-[11.5px] font-medium whitespace-nowrap ${step.status === 'pending' ? 'text-gray-400' : 'text-[#2D6A4F]'}`}>
                {step.label}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div className={`h-0.5 w-12 md:w-20 mx-2 mb-5 ${steps[i + 1].status === 'pending' && step.status !== 'current' ? 'bg-gray-200' : step.status === 'done' ? 'bg-[#40916C]' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   RECEIPT CARD
───────────────────────────────────────── */
function ReceiptCard({ data, onUpdateStatus }: { data: any, onUpdateStatus: (status: string) => void }) {
  const [isCancelling, setIsCancelling] = useState(false);
  const isCancelled = data.status === 'Dibatalkan';

  const formatRp = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka || 0);
  };

  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm('Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini tidak dapat diurungkan.');
    if (!confirmCancel) return;

    setIsCancelling(true);
    try {
      // 1. Ubah status pesanan jadi dibatalkan
      const { error } = await supabase.from('pesanan').update({ status: 'Dibatalkan' }).eq('kode_pesanan', data.kode);
      if (error) throw error;

      // 2. 🟢 RESTORE STOK PUPUK JIKA DIBATALKAN
      if (data.jenis === 'pupuk') {
        const { data: currentStock } = await supabase.from('stok_pupuk').select('jumlah, terjual').eq('id', 1).single();
        if (currentStock) {
          await supabase.from('stok_pupuk')
            .update({ 
              jumlah: currentStock.jumlah + data.jumlah, // Kembalikan stok sisa
              terjual: Math.max(0, currentStock.terjual - data.jumlah) // Kurangi angka total terjual
            })
            .eq('id', 1);
        }
      }

      alert('Pesanan berhasil dibatalkan.');
      onUpdateStatus('Dibatalkan');
    } catch (error) {
      console.error('Gagal membatalkan pesanan:', error);
      alert('Terjadi kesalahan saat membatalkan pesanan. Silakan coba lagi atau hubungi CS.');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className={`${isCancelled ? 'bg-gray-700' : 'bg-[#2D6A4F]'} text-white px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-colors`}>
        <div>
          <p className="text-white/70 text-[12px] font-medium mb-1 uppercase tracking-wide">Nomor Invoice</p>
          <p className="text-3xl font-bold tracking-tight">#{data.kode}</p>
        </div>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full w-fit shadow-sm border ${
          isCancelled ? 'bg-red-500/20 border-red-400/40 text-red-200' 
          : data.status === 'Menunggu Konfirmasi' ? 'bg-yellow-400/20 border-yellow-400/40 text-yellow-300'
          : 'bg-green-400/20 border-green-400/40 text-green-100'
        }`}>
          {data.status === 'Menunggu Konfirmasi' && <Loader2 size={14} className="animate-spin" />}
          {isCancelled && <XCircle size={14} />}
          {!isCancelled && data.status !== 'Menunggu Konfirmasi' && <Check size={14} />}
          <span className="text-[13px] font-semibold">{data.status}</span>
        </div>
      </div>

      <Stepper jenisPesanan={data.jenis} isCancelled={isCancelled} penerimaan={data.penerimaan} currentDbStatus={data.status} />

      <div className="bg-white px-8 py-8">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-[15px] font-semibold text-gray-800">Rincian Pesanan</h3>
          <span className="text-xs text-gray-400">{data.tanggal}</span>
        </div>

        <div className="space-y-3 mb-5">
          <div className="flex justify-between items-center">
            <span className={`text-[14px] ${isCancelled ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
              {data.produk}
            </span>
            <span className={`text-[14px] font-medium ${isCancelled ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
              {formatRp(data.subtotal)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-[14px] ${isCancelled ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
              Biaya Pengiriman {data.penerimaan === 'diantar' ? '(Diantar)' : '(Ambil Sendiri)'}
            </span>
            <span className={`text-[14px] font-medium ${isCancelled ? 'text-gray-400 line-through' : 'text-green-600'}`}>
              {data.ongkir === 0 ? 'Rp 0' : formatRp(data.ongkir)}
            </span>
          </div>
        </div>

        <div className="border-t border-dashed border-gray-200 my-5" />

        <div className="space-y-2.5 mb-5">
          <div className="flex justify-between items-center">
            <span className={`text-[14px] font-semibold ${isCancelled ? 'text-gray-400' : 'text-gray-800'}`}>Total Tagihan</span>
            <span className={`text-[14px] font-semibold ${isCancelled ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
              {formatRp(data.total)}
            </span>
          </div>
        </div>

        <div className={`flex justify-between items-center p-5 rounded-xl w-full border ${isCancelled ? 'bg-gray-50 border-gray-200' : 'bg-[#F0FFF4] border-[#A7F3D0]'}`}>
          <div>
            <p className={`text-[13px] mb-0.5 ${isCancelled ? 'text-gray-400' : 'text-gray-500'}`}>
              {data.pembayaran === 'cod' ? 'Metode (Tunai/COD)' : 'Metode (QRIS)'}
            </p>
            <p className={`text-[11px] uppercase font-medium ${isCancelled ? 'text-red-400' : 'text-gray-400'}`}>
              {isCancelled ? 'DIBATALKAN' : data.pembayaran}
            </p>
          </div>
          <span className={`text-[20px] font-bold ${isCancelled ? 'text-gray-400 line-through' : 'text-[#2D6A4F]'}`}>
            {formatRp(data.total)}
          </span>
        </div>
      </div>

      {!isCancelled && (
        <div className="bg-gray-50 px-8 py-5 flex justify-end items-center gap-3 border-t border-gray-100">
          {data.status === 'Menunggu Konfirmasi' && (
            <button 
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className="flex items-center gap-2 text-[13px] font-medium text-red-600 border border-red-200 bg-white rounded-full px-5 py-2.5 hover:bg-red-50 hover:border-red-300 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCancelling ? <Loader2 size={15} className="animate-spin" /> : <XCircle size={15} strokeWidth={2.5} />}
              {isCancelling ? 'Membatalkan...' : 'Batalkan Pesanan'}
            </button>
          )}
          
          <a 
            href={`https://wa.me/62895397180895?text=Halo%20Admin%20Cikarawang%20Farm,%20saya%20ingin%20bertanya%20mengenai%20pesanan%20saya%20dengan%20nomor%20Invoice%20${data.kode}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[13px] font-semibold text-white bg-[#40916C] rounded-full px-5 py-2.5 hover:bg-[#2D6A4F] transition-colors duration-150"
          >
            <MessageCircle size={15} strokeWidth={2.5} />
            Hubungi CS
          </a>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-16 flex flex-col items-center justify-center text-center border border-green-50">
      <div className="w-24 h-24 bg-[#F0FFF4] rounded-full flex items-center justify-center mb-6">
        <FileSearch size={40} className="text-[#2D6A4F]" strokeWidth={1.5} />
      </div>
      <h2 className="text-[#2D6A4F] text-2xl font-bold mb-3">Cek Status Pesanan</h2>
      <p className="text-gray-500 text-[14.5px] leading-relaxed max-w-md">
        Masukkan nomor invoice pesanan Anda untuk melacak proses secara real-time.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   KONTEN HALAMAN UTAMA
───────────────────────────────────────── */
function KontenStatusPesanan() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const kodeUrl = searchParams.get('kode') || '';

  const [searchInput, setSearchInput] = useState(kodeUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [pesananData, setPesananData] = useState<any>(null);

  useEffect(() => {
    const fetchPesanan = async () => {
      if (!kodeUrl) {
        setSearchInput('');
        setHasSearched(false);
        setPesananData(null);
        return;
      }

      const cleanKode = kodeUrl.trim().toUpperCase().replace('#', '');
      setSearchInput(cleanKode);
      setIsLoading(true);

      try {
        const { data, error } = await supabase
          .from('pesanan')
          .select('*')
          .eq('kode_pesanan', cleanKode)
          .single();

        if (error || !data) {
          setPesananData(null);
        } else {
          setPesananData({
            kode: data.kode_pesanan,
            jenis: data.jenis_pesanan, 
            produk: data.produk,
            jumlah: data.jumlah,
            penerimaan: data.penerimaan,
            pembayaran: data.pembayaran,
            subtotal: data.subtotal,
            ongkir: data.ongkir,
            total: data.total,
            status: data.status,
            tanggal: new Date(data.created_at).toLocaleDateString('id-ID', {
              day: 'numeric', month: 'long', year: 'numeric'
            })
          });
        }
      } catch (err) {
        console.error('Terjadi kesalahan saat fetch database:', err);
        setPesananData(null);
      } finally {
        setIsLoading(false);
        setHasSearched(true);
      }
    };

    fetchPesanan();
  }, [kodeUrl]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    router.push(`/status?kode=${searchInput.trim()}`);
  };

  const handleUpdateStatus = (newStatus: string) => {
    if (pesananData) setPesananData({ ...pesananData, status: newStatus });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-[#2D6A4F] text-3xl font-bold mb-2">Status Pesanan Anda</h1>
        <p className="text-gray-500 text-[14.5px]">
          Pantau proses pesanan aqiqah, ternak domba, atau pembelian pupuk secara real-time.
        </p>
      </div>

      <form onSubmit={handleSearch}>
        <div className="bg-white p-3 rounded-2xl shadow-sm mb-8 flex flex-col sm:flex-row gap-2 border border-green-50">
          <div className="flex items-center gap-3 flex-1 px-3">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="CONTOH: CF-TRN-123456"
              className="flex-1 text-[14px] text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none py-2 font-semibold uppercase tracking-wide"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-[#2D6A4F] text-white text-[14px] font-semibold px-8 py-3 rounded-xl hover:bg-[#1B4332] transition-colors duration-150 disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
          >
            {isLoading ? <><Loader2 size={16} className="animate-spin" />Mencari...</> : 'Cari Pesanan'}
          </button>
        </div>
      </form>

      {isLoading ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-green-100 shadow-sm animate-pulse">
          <div className="w-16 h-16 border-4 border-green-100 border-t-[#2D6A4F] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#2D6A4F] font-medium">Memverifikasi database...</p>
        </div>
      ) : !hasSearched ? (
        <EmptyState />
      ) : pesananData ? (
        <ReceiptCard data={pesananData} onUpdateStatus={handleUpdateStatus} />
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-red-100 shadow-sm">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Kode Pesanan Tidak Ditemukan</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Kode <b>{searchInput}</b> tidak terdaftar di sistem. Pastikan format penulisan sudah benar.
          </p>
        </div>
      )}
    </div>
  );
}

export default function StatusPesananPage() {
  return (
    <div className="bg-[#F0FFF4] w-full min-h-screen">
      <div className="py-12 px-4 sm:px-6">
        <Suspense fallback={<div className="max-w-4xl mx-auto py-20 text-center text-[#2D6A4F] font-semibold flex flex-col items-center gap-4"><Loader2 size={32} className="animate-spin" />Memuat sistem pelacakan...</div>}>
          <KontenStatusPesanan />
        </Suspense>
      </div>
    </div>
  );
}