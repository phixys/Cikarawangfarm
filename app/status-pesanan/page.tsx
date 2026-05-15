'use client';

import { useState } from 'react';
import {
  Search,
  Loader2,
  FileSearch,
  Check,
  ChefHat,
  Truck,
  Download,
  MessageCircle,
} from 'lucide-react';

/* ─────────────────────────────────────────
   STEPPER
───────────────────────────────────────── */
type StepStatus = 'done' | 'current' | 'pending';

interface Step {
  label: string;
  status: StepStatus;
  icon: React.ReactNode;
}

function Stepper() {
  const steps: Step[] = [
    { label: 'DP Diterima',  status: 'done',    icon: <Check size={16} strokeWidth={3} /> },
    { label: 'Pilih Domba',  status: 'done',    icon: <Check size={16} strokeWidth={3} /> },
    { label: 'Disembelih',   status: 'current', icon: null },
    { label: 'Dimasak',      status: 'pending', icon: <ChefHat size={16} strokeWidth={2} /> },
    { label: 'Dikirim',      status: 'pending', icon: <Truck size={16} strokeWidth={2} /> },
  ];

  return (
    <div className="bg-[#FAFAFA] px-8 py-10 border-b border-gray-100">
      <p className="text-center text-[14px] font-semibold text-gray-700 mb-8">Lacak Proses Aqiqah</p>

      <div className="flex items-center justify-center">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center">
            {/* Step node */}
            <div className="flex flex-col items-center gap-2">
              {/* Circle */}
              {step.status === 'done' && (
                <div className="w-10 h-10 rounded-full bg-[#40916C] flex items-center justify-center text-white">
                  {step.icon}
                </div>
              )}
              {step.status === 'current' && (
                <div className="w-10 h-10 rounded-full border-4 border-[#40916C] bg-white flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#40916C] animate-pulse" />
                </div>
              )}
              {step.status === 'pending' && (
                <div className="w-10 h-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center text-gray-400">
                  {step.icon}
                </div>
              )}

              {/* Label */}
              <span
                className={`text-[11.5px] font-medium whitespace-nowrap ${
                  step.status === 'pending' ? 'text-gray-400' : 'text-[#2D6A4F]'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 w-14 md:w-20 mx-1 mb-5 ${
                  steps[i + 1].status === 'pending' && step.status !== 'current'
                    ? 'bg-gray-200'
                    : step.status === 'done'
                    ? 'bg-[#40916C]'
                    : 'bg-gray-200'
                }`}
              />
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
function ReceiptCard({ invoiceNumber }: { invoiceNumber: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden">
      {/* Header */}
      <div className="bg-[#2D6A4F] text-white px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-white/70 text-[12px] font-medium mb-1 uppercase tracking-wide">Nomor Invoice</p>
          <p className="text-3xl font-bold tracking-tight">{invoiceNumber}</p>
        </div>
        <div className="flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 px-4 py-2 rounded-full w-fit">
          <Loader2 size={14} className="animate-spin" />
          <span className="text-[13px] font-semibold">Sedang Diproses</span>
        </div>
      </div>

      {/* Stepper */}
      <Stepper />

      {/* Order details */}
      <div className="bg-white px-8 py-8">
        <h3 className="text-[15px] font-semibold text-gray-800 mb-5">Rincian Pesanan</h3>

        {/* Items */}
        <div className="space-y-3 mb-5">
          <div className="flex justify-between items-center">
            <span className="text-[14px] text-gray-600">Paket Aqiqah Premium</span>
            <span className="text-[14px] font-medium text-gray-800">Rp 3.800.000</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[14px] text-gray-600">Biaya Pengiriman</span>
            <span className="text-[14px] font-medium text-green-600">Rp 0</span>
          </div>
        </div>

        {/* Dashed divider */}
        <div className="border-t border-dashed border-gray-200 my-5" />

        {/* Total & DP */}
        <div className="space-y-2.5 mb-5">
          <div className="flex justify-between items-center">
            <span className="text-[14px] font-semibold text-gray-800">Total</span>
            <span className="text-[14px] font-semibold text-gray-800">Rp 3.800.000</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[14px] text-gray-500">DP Dibayar (50%)</span>
            <span className="text-[14px] font-medium text-green-600">- Rp 1.900.000</span>
          </div>
        </div>

        {/* COD box */}
        <div className="flex justify-between items-center bg-[#F0FFF4] border border-[#A7F3D0] p-5 rounded-xl w-full">
          <div>
            <p className="text-[13px] text-gray-500 mb-0.5">Sisa Pembayaran (COD)</p>
            <p className="text-[11px] text-gray-400">Dibayar saat diterima</p>
          </div>
          <span className="text-[20px] font-bold text-[#2D6A4F]">Rp 1.900.000</span>
        </div>
      </div>

      {/* Action footer */}
      <div className="bg-gray-50 px-8 py-5 flex justify-end items-center gap-3 border-t border-gray-100">
        <button className="flex items-center gap-2 text-[13px] font-medium text-[#2D6A4F] border border-[#2D6A4F] rounded-full px-5 py-2.5 hover:bg-[#F0FFF4] transition-colors duration-150">
          <Download size={15} strokeWidth={2.5} />
          Unduh Invoice
        </button>
        <button className="flex items-center gap-2 text-[13px] font-semibold text-white bg-[#40916C] rounded-full px-5 py-2.5 hover:bg-[#2D6A4F] transition-colors duration-150">
          <MessageCircle size={15} strokeWidth={2.5} />
          Hubungi CS
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-16 flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-[#F0FFF4] rounded-full flex items-center justify-center mb-6">
        <FileSearch size={40} className="text-[#2D6A4F]" strokeWidth={1.5} />
      </div>
      <h2 className="text-[#2D6A4F] text-2xl font-bold mb-3">Cek Status Pesanan</h2>
      <p className="text-gray-500 text-[14.5px] leading-relaxed max-w-md">
        Masukkan nomor invoice yang Anda dapatkan melalui WhatsApp atau Email untuk melihat proses
        pesanan Anda saat ini.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function StatusPesananPage() {
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setIsLoading(true);

    setTimeout(() => {
      const raw = searchInput.trim().toUpperCase();
      const formatted = raw.startsWith('#') ? raw : `#${raw}`;
      setInvoiceNumber(formatted);
      setIsLoading(false);
      setHasSearched(true);
    }, 1000);
  };

  return (
    <div className="bg-[#F0FFF4] w-full min-h-screen">
      <div className="py-12 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-[#2D6A4F] text-3xl font-bold mb-2">Status Pesanan Anda</h1>
            <p className="text-gray-500 text-[14.5px]">
              Pantau proses pesanan aqiqah atau pembelian produk Anda secara real-time.
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch}>
            <div className="bg-white p-3 rounded-2xl shadow-sm mb-8 flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-3 flex-1 px-3">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Masukkan Nomor Pesanan (Contoh: INV-CKR-2405-089)"
                  className="flex-1 text-[14px] text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none py-2"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center gap-2 bg-[#2D6A4F] text-white text-[14px] font-semibold px-8 py-3 rounded-xl hover:bg-[#40916C] transition-colors duration-150 disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Mencari...
                  </>
                ) : (
                  'Cari Pesanan'
                )}
              </button>
            </div>
          </form>

          {/* Conditional content */}
          {!hasSearched ? (
            <EmptyState />
          ) : (
            <ReceiptCard invoiceNumber={invoiceNumber} />
          )}
        </div>
      </div>
    </div>
  );
}