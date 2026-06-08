'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Settings,
  Truck,
  QrCode,
  Save,
  Upload,
  CheckCircle2,
  X,
  Loader2,
  ImagePlus,
} from 'lucide-react';

// ── Helper format Rupiah ─────────────────────────────────────────────────────
function formatRp(val: number | string) {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
}

// ── Halaman Utama ────────────────────────────────────────────────────────────
export default function PengaturanSistemPage() {
  // — State Ongkir —
  const [ongkir, setOngkir] = useState({ zona1: '', zona2: '', zona3: '' });
  const [loadingOngkir, setLoadingOngkir] = useState(false);

  // — State QRIS —
  const [qrisUrl, setQrisUrl] = useState('');
  const [qrisFile, setQrisFile] = useState<File | null>(null);
  const [qrisPreview, setQrisPreview] = useState('');
  const [loadingQris, setLoadingQris] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // — Alert Banner —
  const [alert, setAlert] = useState<{ show: boolean; msg: string; type: 'success' | 'error' }>(
    { show: false, msg: '', type: 'success' }
  );

  const showAlert = (msg: string, type: 'success' | 'error' = 'success') => {
    setAlert({ show: true, msg, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
  };

  // — Loading awal —
  const [isFetching, setIsFetching] = useState(true);

  // ── Ambil data awal dari Supabase ─────────────────────────────────────────
  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('pengaturan_sistem')
        .select('kunci, nilai')
        .in('kunci', ['ongkir_zona_1', 'ongkir_zona_2', 'ongkir_zona_3', 'qris_url']);

      if (error) {
        showAlert('Gagal memuat pengaturan sistem.', 'error');
        setIsFetching(false);
        return;
      }

      const map: Record<string, string> = {};
      (data ?? []).forEach((row: { kunci: string; nilai: string }) => {
        map[row.kunci] = row.nilai;
      });

      setOngkir({
        zona1: map['ongkir_zona_1'] ?? '',
        zona2: map['ongkir_zona_2'] ?? '',
        zona3: map['ongkir_zona_3'] ?? '',
      });

      const savedUrl = map['qris_url'] ?? '';
      setQrisUrl(savedUrl);
      setQrisPreview(savedUrl);

      setIsFetching(false);
    };

    fetchSettings();
  }, []);

  // ── Simpan Ongkir ─────────────────────────────────────────────────────────
  const handleSimpanOngkir = async () => {
    setLoadingOngkir(true);
    try {
      const updates = [
        { kunci: 'ongkir_zona_1', nilai: String(ongkir.zona1) },
        { kunci: 'ongkir_zona_2', nilai: String(ongkir.zona2) },
        { kunci: 'ongkir_zona_3', nilai: String(ongkir.zona3) },
      ];

      for (const item of updates) {
        const { error } = await supabase
          .from('pengaturan_sistem')
          .upsert({ kunci: item.kunci, nilai: item.nilai }, { onConflict: 'kunci' });

        if (error) throw new Error(`Gagal update ${item.kunci}: ${error.message}`);
      }

      showAlert('Tarif ongkos kirim berhasil disimpan!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan.';
      showAlert(msg, 'error');
    } finally {
      setLoadingOngkir(false);
    }
  };

  // ── Pilih File QRIS ───────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setQrisFile(file);
    setQrisPreview(URL.createObjectURL(file));
  };

  // ── Upload QRIS ───────────────────────────────────────────────────────────
  const handleUploadQris = async () => {
    if (!qrisFile) {
      showAlert('Pilih file gambar QRIS terlebih dahulu.', 'error');
      return;
    }

    setLoadingQris(true);
    try {
      // 1. Buat nama file unik
      const ext = qrisFile.name.split('.').pop();
      const fileName = `qris_${Date.now()}.${ext}`;

      // 2. Upload ke Supabase Storage (bucket: assets)
      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(fileName, qrisFile, { upsert: true });

      if (uploadError) throw new Error(`Upload gagal: ${uploadError.message}`);

      // 3. Ambil Public URL
      const { data: urlData } = supabase.storage
        .from('assets')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // 4. Update tabel pengaturan_sistem
      const { error: dbError } = await supabase
        .from('pengaturan_sistem')
        .update({ nilai: publicUrl })
        .eq('kunci', 'qris_url');

      if (dbError) throw new Error(`Update DB gagal: ${dbError.message}`);

      setQrisUrl(publicUrl);
      setQrisFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      showAlert('Gambar QRIS berhasil diperbarui! 🎉');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat upload.';
      showAlert(msg, 'error');
    } finally {
      setLoadingQris(false);
    }
  };

  // ── Render Loading Awal ───────────────────────────────────────────────────
  if (isFetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 size={40} className="animate-spin text-[#2D6A4F]" />
          <p className="text-sm font-medium">Memuat pengaturan…</p>
        </div>
      </div>
    );
  }

  // ── Render Utama ──────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-2">

      {/* ── Alert Banner ── */}
      {alert.show && (
        <div
          className={`w-full max-w-2xl mx-auto p-4 rounded-xl shadow-sm border flex items-center justify-between transition-all duration-300 ${
            alert.type === 'success'
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <CheckCircle2
              size={18}
              className={alert.type === 'success' ? 'text-green-600 shrink-0' : 'text-red-500 shrink-0'}
            />
            <span
              className={`text-sm font-medium ${
                alert.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {alert.msg}
            </span>
          </div>
          <button
            onClick={() => setAlert({ show: false, msg: '', type: 'success' })}
            className={`p-1 rounded-lg transition-colors ${
              alert.type === 'success'
                ? 'text-green-500 hover:bg-green-100'
                : 'text-red-400 hover:bg-red-100'
            }`}
            aria-label="Tutup notifikasi"
          >
            <X size={16} />
          </button>
        </div>
      )}

        {/* ── HEADER ── */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center">
              <Settings size={22} className="text-amber-600" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Pengaturan Sistem
            </h1>
          </div>
          <p className="text-sm text-gray-500 ml-[52px]">
            Kelola tarif ongkos kirim dan data pembayaran QRIS merchant.
          </p>
        </div>

        {/* ── BAGIAN 1: ONGKOS KIRIM ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center gap-3 px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="w-9 h-9 rounded-xl bg-[#E8F5EE] flex items-center justify-center">
              <Truck size={18} className="text-[#2D6A4F]" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Tarif Ongkos Kirim</h2>
              <p className="text-xs text-gray-500">Digunakan saat pelanggan checkout</p>
            </div>
          </div>

          {/* Card Body */}
          <div className="px-8 py-6 space-y-5">
            {[
              {
                key: 'zona1' as const,
                label: 'Zona 1',
                desc: 'Dalam kota / terdekat',
                color: '#000000',
                bg: 'bg-green-50 border-green-200 focus:ring-green-300',
              },
              {
                key: 'zona2' as const,
                label: 'Zona 2',
                desc: 'Luar kota / sedang',
                color: '#000000',
                bg: 'bg-blue-50 border-blue-200 focus:ring-blue-300',
              },
              {
                key: 'zona3' as const,
                label: 'Zona 3',
                desc: 'Luar provinsi / jauh',
                color: '#000000',
                bg: 'bg-purple-50 border-purple-200 focus:ring-purple-300',
              },
            ].map(({ key, label, desc, color, bg }) => (
              <div key={key}>
                <div className="flex justify-between items-baseline mb-1.5">
                  <label className={`text-sm font-bold ${color}`}>{label}</label>
                  <span className="text-xs text-gray-400">{desc}</span>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 pointer-events-none">
                    Rp
                  </span>
                  <input
                    id={`ongkir-${key}`}
                    type="number"
                    min={0}
                    step={1000}
                    value={ongkir[key]}
                    onChange={(e) => setOngkir((prev) => ({ ...prev, [key]: e.target.value }))}
                    placeholder="0"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-semibold text-gray-800 outline-none focus:ring-2 transition-all ${bg}`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none font-medium">
                    {ongkir[key] ? formatRp(ongkir[key]) : '—'}
                  </span>
                </div>
              </div>
            ))}

            {/* Tombol Simpan Ongkir */}
            <button
              id="btn-simpan-ongkir"
              onClick={handleSimpanOngkir}
              disabled={loadingOngkir}
              className="mt-2 w-full flex items-center justify-center gap-2 bg-[#2D6A4F] hover:bg-[#245a42] disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-colors shadow-sm text-sm"
            >
              {loadingOngkir ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Menyimpan…
                </>
              ) : (
                <>
                  <Save size={16} />
                  Simpan Ongkir
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── BAGIAN 2: UPLOAD QRIS ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center gap-3 px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
              <QrCode size={18} className="text-amber-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Gambar QRIS Pembayaran</h2>
              <p className="text-xs text-gray-500">Ditampilkan kepada pelanggan saat checkout transfer</p>
            </div>
          </div>

          {/* Card Body */}
          <div className="px-8 py-6 space-y-6">

            {/* Preview QRIS */}
            <div className="flex flex-col items-center">
              {qrisPreview ? (
                <div className="relative group">
                  <img
                    src={qrisPreview}
                    alt="Preview QRIS"
                    className="w-56 h-56 object-contain rounded-2xl border-2 border-amber-200 shadow-md bg-amber-50 p-2"
                  />
                  {qrisFile && (
                    <div className="absolute inset-0 rounded-2xl bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs font-bold">Preview Baru</p>
                    </div>
                  )}
                  {!qrisFile && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      AKTIF
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-56 h-56 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-colors"
                >
                  <ImagePlus size={32} className="text-gray-300" />
                  <p className="text-xs text-gray-400 font-medium">Belum ada gambar QRIS</p>
                </div>
              )}
            </div>

            {/* Input File */}
            <div>
              <label
                htmlFor="qris-file-input"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Pilih File Gambar Baru
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-amber-400 hover:bg-amber-50 cursor-pointer transition-all group"
              >
                <ImagePlus size={18} className="text-gray-400 group-hover:text-amber-500 transition-colors shrink-0" />
                <span className="text-sm text-gray-500 group-hover:text-amber-600 truncate transition-colors">
                  {qrisFile ? qrisFile.name : 'Klik untuk memilih file (JPG, PNG, WEBP)'}
                </span>
                {qrisFile && (
                  <span className="ml-auto text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
                    Siap upload
                  </span>
                )}
              </div>
              <input
                id="qris-file-input"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {qrisFile && (
                <p className="text-xs text-gray-400 mt-1.5 ml-1">
                  Ukuran: {(qrisFile.size / 1024).toFixed(1)} KB
                </p>
              )}
            </div>

            {/* Tombol Upload QRIS */}
            <button
              id="btn-upload-qris"
              onClick={handleUploadQris}
              disabled={loadingQris || !qrisFile}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3 rounded-xl transition-colors shadow-sm text-sm"
            >
              {loadingQris ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Mengupload…
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload & Simpan QRIS
                </>
              )}
            </button>

            {/* Info URL aktif */}
            {qrisUrl && !qrisFile && (
              <p className="text-xs text-gray-400 text-center truncate">
                URL aktif:{' '}
                <a
                  href={qrisUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:underline font-medium"
                >
                  {qrisUrl}
                </a>
              </p>
            )}
          </div>
        </div>

    </div>
  );
}
