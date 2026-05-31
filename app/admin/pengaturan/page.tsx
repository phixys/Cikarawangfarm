'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Settings, Save, Loader2, CheckCircle2, AlertCircle,
  Truck, QrCode, RefreshCw, Upload, MapPin, ImagePlus, X
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────
type Pengaturan = { kunci: string; nilai: string };

// ─── Toast Notification ──────────────────────────────────
function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold animate-in slide-in-from-bottom-4 duration-300 max-w-sm ${
        type === 'success' ? 'bg-[#2D6A4F]' : 'bg-red-500'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle2 size={18} className="shrink-0" />
      ) : (
        <AlertCircle size={18} className="shrink-0" />
      )}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
        <X size={15} />
      </button>
    </div>
  );
}

// ─── Helper: format Rupiah preview ───────────────────────
function toRpDisplay(val: string) {
  const num = parseInt(val || '0', 10);
  return isNaN(num) ? '-' : `Rp ${num.toLocaleString('id-ID')}`;
}

// ─── Main Page ───────────────────────────────────────────
export default function PengaturanPage() {
  // Form state
  const [ongkir1, setOngkir1] = useState('');
  const [ongkir2, setOngkir2] = useState('');
  const [ongkir3, setOngkir3] = useState('');
  const [currentQrisUrl, setCurrentQrisUrl] = useState('');

  // Upload state
  const [qrisFile, setQrisFile]           = useState<File | null>(null);
  const [qrisPreview, setQrisPreview]     = useState(''); // local blob preview
  const [isUploading, setIsUploading]     = useState(false);

  // UI state
  const [isLoading, setIsLoading]   = useState(true);
  const [isSaving, setIsSaving]     = useState(false);
  const [toast, setToast]           = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Fetch existing settings ───────────────────────────
  const fetchPengaturan = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pengaturan_sistem')
        .select('kunci, nilai');
      if (error) throw error;

      const map: Record<string, string> = {};
      (data as Pengaturan[]).forEach((r) => { map[r.kunci] = r.nilai; });

      setOngkir1(map['ongkir_zona_1'] ?? '');
      setOngkir2(map['ongkir_zona_2'] ?? '');
      setOngkir3(map['ongkir_zona_3'] ?? '');
      setCurrentQrisUrl(map['qris_url'] ?? '');
    } catch (err: any) {
      setToast({ message: 'Gagal memuat pengaturan: ' + (err?.message ?? ''), type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchPengaturan(); }, [fetchPengaturan]);

  // ── Handle file selection → local preview ────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      setToast({ message: 'File harus berupa gambar (JPG, PNG, WEBP, dll).', type: 'error' });
      return;
    }
    // Validasi ukuran maks 2 MB
    if (file.size > 2 * 1024 * 1024) {
      setToast({ message: 'Ukuran gambar maksimal 2 MB.', type: 'error' });
      return;
    }

    setQrisFile(file);
    setQrisPreview(URL.createObjectURL(file));
  };

  // ── Upload QRIS ke Supabase Storage → return public URL ──
  const uploadQris = async (): Promise<string> => {
    if (!qrisFile) return currentQrisUrl; // tidak ada file baru → pakai URL lama

    setIsUploading(true);
    try {
      const ext  = qrisFile.name.split('.').pop() ?? 'png';
      const path = `qris/qris_merchant.${ext}`; // selalu timpa file lama

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(path, qrisFile, { upsert: true, contentType: qrisFile.type });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('assets')
        .getPublicUrl(path);

      // Tambahkan cache-buster agar browser reload gambar terbaru
      return `${urlData.publicUrl}?t=${Date.now()}`;
    } finally {
      setIsUploading(false);
    }
  };

  // ── Upsert satu baris ─────────────────────────────────
  const upsertRow = async (kunci: string, nilai: string) => {
    const { error } = await supabase
      .from('pengaturan_sistem')
      .upsert({ kunci, nilai }, { onConflict: 'kunci' });
    if (error) throw error;
  };

  // ── Simpan semua perubahan ────────────────────────────
  const handleSave = async () => {
    // Validasi ongkir
    for (const [label, val] of [['Zona 1', ongkir1], ['Zona 2', ongkir2], ['Zona 3', ongkir3]]) {
      if (val !== '' && isNaN(Number(val))) {
        setToast({ message: `Ongkir ${label} harus berupa angka.`, type: 'error' });
        return;
      }
    }

    setIsSaving(true);
    try {
      // 1. Upload QRIS (jika ada file baru)
      const finalQrisUrl = await uploadQris();

      // 2. Simpan semua ke tabel
      await Promise.all([
        upsertRow('ongkir_zona_1', ongkir1),
        upsertRow('ongkir_zona_2', ongkir2),
        upsertRow('ongkir_zona_3', ongkir3),
        upsertRow('qris_url', finalQrisUrl),
      ]);

      // 3. Update state & bersihkan file preview
      setCurrentQrisUrl(finalQrisUrl);
      setQrisFile(null);
      setQrisPreview('');
      if (fileInputRef.current) fileInputRef.current.value = '';

      setToast({ message: 'Pengaturan berhasil disimpan!', type: 'success' });
    } catch (err: any) {
      console.error(err);
      setToast({ message: 'Gagal menyimpan: ' + (err?.message ?? 'Kesalahan tidak diketahui'), type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const isProcessing = isSaving || isUploading;

  // ── Komponen input ongkir ─────────────────────────────
  const OngkirInput = ({
    label, desc, value, onChange,
  }: { label: string; desc: string; value: string; onChange: (v: string) => void }) => (
    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-[#2D6A4F]/30 transition-colors group">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 bg-[#2D6A4F]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#2D6A4F]/15 transition-colors">
          <MapPin size={16} className="text-[#2D6A4F]" />
        </div>
        <div>
          <p className="font-bold text-gray-800 text-sm">{label}</p>
          <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
        </div>
      </div>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400 select-none">
          Rp
        </span>
        <input
          type="number"
          min={0}
          step={1000}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/15 transition-all appearance-none"
        />
      </div>
      {value && !isNaN(Number(value)) && Number(value) >= 0 && (
        <p className="text-xs text-[#2D6A4F] font-semibold mt-2 ml-1">
          = {toRpDisplay(value)}
        </p>
      )}
    </div>
  );

  // ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={36} className="animate-spin text-[#2D6A4F]" />
      </div>
    );
  }

  // Gambar yang ditampilkan: preview lokal (jika ada) atau URL dari DB
  const displayQris = qrisPreview || currentQrisUrl;

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="max-w-4xl mx-auto space-y-8">

        {/* ── HEADER ────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-[#2D6A4F] rounded-xl flex items-center justify-center shadow-sm shadow-green-900/20">
                <Settings size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-black text-gray-900">Pengaturan Sistem</h1>
            </div>
            <p className="text-gray-500 text-sm ml-[52px]">
              Kelola ongkos kirim per zona dan gambar QRIS pembayaran.
            </p>
          </div>
          <button
            onClick={fetchPengaturan}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors self-start sm:self-auto"
          >
            <RefreshCw size={15} />
            Muat Ulang
          </button>
        </div>

        {/* ── ONGKOS KIRIM ──────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <Truck size={18} className="text-blue-500" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-[15px]">Ongkos Kirim per Zona</h2>
              <p className="text-xs text-gray-500">Nilai dalam Rupiah. Isi 0 untuk gratis ongkir.</p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <OngkirInput
              label="Zona 1 — Terdekat"
              desc="Dalam kota / radius &lt;10 km"
              value={ongkir1}
              onChange={setOngkir1}
            />
            <OngkirInput
              label="Zona 2 — Menengah"
              desc="Kecamatan sekitar / 10–30 km"
              value={ongkir2}
              onChange={setOngkir2}
            />
            <OngkirInput
              label="Zona 3 — Jauh"
              desc="Luar kota / &gt;30 km"
              value={ongkir3}
              onChange={setOngkir3}
            />
          </div>
        </div>

        {/* ── QRIS UPLOAD ───────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
              <QrCode size={18} className="text-purple-500" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-[15px]">Gambar QRIS Merchant</h2>
              <p className="text-xs text-gray-500">
                Unggah gambar QRIS yang akan ditampilkan saat pelanggan checkout. Maks. 2 MB.
              </p>
            </div>
          </div>

          <div className="p-6 flex flex-col lg:flex-row gap-8 items-start">

            {/* Kiri: Area Upload */}
            <div className="flex-1 w-full space-y-4">
              {/* Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                  qrisFile
                    ? 'border-[#2D6A4F] bg-[#F0FFF4]'
                    : 'border-gray-200 bg-gray-50 hover:border-[#2D6A4F]/50 hover:bg-gray-100'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  qrisFile ? 'bg-[#2D6A4F]/10' : 'bg-gray-100'
                }`}>
                  {qrisFile
                    ? <CheckCircle2 size={28} className="text-[#2D6A4F]" />
                    : <ImagePlus size={28} className="text-gray-400" />
                  }
                </div>
                {qrisFile ? (
                  <>
                    <p className="font-bold text-[#2D6A4F] text-sm text-center">{qrisFile.name}</p>
                    <p className="text-xs text-gray-400">
                      {(qrisFile.size / 1024).toFixed(1)} KB · Klik untuk ganti
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-gray-700 text-sm text-center">
                      Klik untuk pilih gambar QRIS
                    </p>
                    <p className="text-xs text-gray-400 text-center">
                      PNG, JPG, WEBP — Maks. 2 MB
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Tombol hapus pilihan */}
              {qrisFile && (
                <button
                  onClick={() => {
                    setQrisFile(null);
                    setQrisPreview('');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                >
                  <X size={13} />
                  Batalkan pilihan gambar
                </button>
              )}

              {/* Upload hint */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 text-xs text-blue-700 leading-relaxed">
                <strong>Catatan:</strong> Gambar akan diunggah ke Supabase Storage bucket{' '}
                <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">assets/qris/</code> dan
                menimpa file lama secara otomatis. Pastikan bucket sudah dibuat dan bersifat <strong>Public</strong>.
              </div>
            </div>

            {/* Kanan: Preview */}
            <div className="w-full lg:w-64 shrink-0">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                {qrisPreview ? '✦ Preview Baru' : 'QRIS Aktif Saat Ini'}
              </p>
              <div className={`rounded-2xl border-2 overflow-hidden bg-gray-50 flex items-center justify-center min-h-[220px] transition-all ${
                qrisPreview ? 'border-[#2D6A4F] shadow-md shadow-green-900/10' : 'border-gray-200'
              }`}>
                {displayQris ? (
                  <img
                    src={displayQris}
                    alt="Preview QRIS"
                    className="max-w-full max-h-[280px] object-contain p-3"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '';
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-300 p-8">
                    <QrCode size={48} />
                    <p className="text-xs text-center">Belum ada gambar QRIS</p>
                  </div>
                )}
              </div>
              {qrisPreview && (
                <p className="text-[11px] text-[#2D6A4F] font-semibold mt-2 text-center">
                  ✓ Gambar baru siap di-upload
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── TOMBOL SIMPAN ─────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-700">Siap menyimpan perubahan?</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Ongkir dan QRIS akan langsung diperbarui di seluruh sistem.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isProcessing}
            className="inline-flex items-center gap-2.5 bg-[#2D6A4F] hover:bg-[#1B4332] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-sm shadow-green-900/20 text-sm shrink-0"
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {isUploading ? 'Mengupload...' : 'Menyimpan...'}
              </>
            ) : (
              <>
                <Save size={16} />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>

      </div>
    </>
  );
}
