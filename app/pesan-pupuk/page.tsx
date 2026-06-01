'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, ArrowLeft, Phone, User, MapPin, CheckCircle, Mail, QrCode, UploadCloud, Package, Copy } from 'lucide-react';
import Link from 'next/link';

function formatRupiah(n: number) {
  if (n === undefined || n === null || isNaN(n)) return 'Rp 0';
  return 'Rp ' + n.toLocaleString('id-ID');
}

function FormPesananPupukContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const jumlahStr = searchParams.get('jumlah') || '1';
  const qty = parseInt(jumlahStr, 10);
  const hargaPerKarung = 10000;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [invoiceCode, setInvoiceCode] = useState('');
  
  // 🟢 State untuk animasi tombol copy
  const [isCopied, setIsCopied] = useState(false);
  const [qrisImage, setQrisImage] = useState('');

  // Form State Indentitas
  const [userId, setUserId] = useState(''); 
  const [nama, setNama] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');

  // Form State Penerimaan
  const [metodePenerimaan, setMetodePenerimaan] = useState('ambil');
  const [tarifOngkir, setTarifOngkir] = useState({ zona1: 50000, zona2: 100000, zona3: 150000 });
  const [zona, setZona] = useState<number>(50000);
  const [alamat, setAlamat] = useState('');
  const [patokan, setPatokan] = useState('');

  // Form State Pembayaran (HANYA QRIS)
  const [buktiTf, setBuktiTf] = useState<File | null>(null);

  // Cek Login
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/masuk'); 
        return;
      }

      if (session.user.id) setUserId(session.user.id);
      if (session.user.email) setEmail(session.user.email);
      if (session.user.user_metadata?.full_name) setNama(session.user.user_metadata.full_name);

      const { data: pengaturan } = await supabase.from('pengaturan_sistem').select('*');
      if (pengaturan) {
        const qris = pengaturan.find(p => p.kunci === 'qris_url')?.nilai;
        if (qris) setQrisImage(qris);
        
        const z1 = pengaturan.find(p => p.kunci === 'ongkir_zona_1')?.nilai;
        const z2 = pengaturan.find(p => p.kunci === 'ongkir_zona_2')?.nilai;
        const z3 = pengaturan.find(p => p.kunci === 'ongkir_zona_3')?.nilai;
        
        const tarif = {
          zona1: z1 ? Number(z1) : 50000,
          zona2: z2 ? Number(z2) : 100000,
          zona3: z3 ? Number(z3) : 150000
        };
        setTarifOngkir(tarif);
        setZona(tarif.zona1);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Kalkulasi Harga
  const subtotal = qty * hargaPerKarung;
  const ongkir = metodePenerimaan === 'diantar' ? zona : 0;
  const grandTotal = subtotal + ongkir;

  // 🟢 FUNGSI YANG TADI HILANG KITA TARUH DI SINI
  const copyToClipboard = () => {
    navigator.clipboard.writeText(invoiceCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Tulisan "Disalin!" hilang dalam 2 detik
  };

  const handleKirimPesanan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!buktiTf) {
      alert('Mohon upload bukti transfer QRIS terlebih dahulu untuk melanjutkan!');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload Bukti Transfer
      const fileExt = buktiTf.name.split('.').pop();
      const filePath = `pupuk/TF-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('bukti_transfer')
        .upload(filePath, buktiTf);

      if (uploadError) {
        console.error("Storage Error Details:", uploadError);
        alert(`❌ ERROR UPLOAD GAMBAR:\n${uploadError.message}`);
        setIsSubmitting(false);
        return;
      }

      // 2. Simpan pesanan ke database
      const kodePesananBaru = `CF-PUP-${Math.floor(100000 + Math.random() * 900000)}`;
      
      const { error: insertError } = await supabase.from('pesanan').insert({
        user_id: userId, 
        kode_pesanan: kodePesananBaru,
        jenis_pesanan: 'pupuk',
        produk: 'Pupuk Organik Kotoran Domba',
        jumlah: qty,
        penerimaan: metodePenerimaan,
        pembayaran: 'QRIS',
        subtotal: subtotal,
        ongkir: ongkir,
        total: grandTotal,
        status: 'Menunggu Konfirmasi',
        nama: nama,
        whatsapp: whatsapp,
        email: email,
        alamat: metodePenerimaan === 'diantar' ? alamat : 'Ambil di peternakan',
        patokan: metodePenerimaan === 'diantar' ? patokan : '',
        bukti_transfer: filePath
      });

      if (insertError) throw insertError;

      // 3. 🟢 UPDATE OTOMATIS: Kurangi stok pupuk di database!
      const { data: currentStock } = await supabase.from('stok_pupuk').select('jumlah, terjual').eq('id', 1).single();
      if (currentStock) {
        await supabase.from('stok_pupuk')
          .update({ 
            jumlah: Math.max(0, currentStock.jumlah - qty), // Kurangi stok sisa
            terjual: currentStock.terjual + qty           // Tambah angka terjual
          })
          .eq('id', 1);
      }

      // 4. Tampilkan Halaman Sukses
      setInvoiceCode(kodePesananBaru);
      setIsSuccess(true);
      setIsSubmitting(false);
      window.scrollTo(0, 0);

    } catch (err: any) {
      console.error("Unknown Error Details:", err);
      alert(`❌ ERROR SISTEM LAINNYA:\n${err.message || 'Terjadi kesalahan sistem'}`);
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="min-h-[60vh] flex justify-center items-center"><Loader2 className="animate-spin text-[#2D6A4F]" /></div>;

  // ────────────────────────────────────────────────────────
  // TAMPILAN HALAMAN SUKSES
  // ────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-12 text-center relative overflow-hidden animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 bg-[#e6f4ea] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-[#2D6A4F]" size={32} strokeWidth={2.5} />
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">Pesanan Berhasil Dikirim!</h1>
          
          <p className="text-gray-600 text-[14.5px] leading-relaxed max-w-md mx-auto mb-8">
            Terima kasih telah memesan di Cikarawang Farm, <span className="font-bold text-gray-900">{nama}</span>. Status pesanan Anda saat ini adalah <span className="font-bold text-[#2D6A4F]">Menunggu Konfirmasi</span>.
          </p>

          <div className="bg-[#F0FFF4] border border-[#bbf7d0] rounded-2xl p-6 mb-8 relative">
            <p className="text-[#2D6A4F] text-[11px] font-bold uppercase tracking-widest mb-2">Kode Pesanan Anda</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">{invoiceCode}</span>
              <button onClick={copyToClipboard} className="p-2 hover:bg-[#dcfce7] rounded-lg transition-colors text-[#2D6A4F]">
                {isCopied ? <span className="text-xs font-bold text-[#2D6A4F]">Disalin!</span> : <Copy size={22} />}
              </button>
            </div>
            <p className="text-[#2D6A4F] text-[12.5px] mt-4 max-w-xs mx-auto">
              Gunakan kode ini untuk mengecek progres pesanan Anda di halaman <span className="font-bold">Status Pesanan</span>.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 mb-8 text-left max-w-sm mx-auto space-y-2">
            <p className="text-[13.5px] text-gray-600">• Jumlah item: <span className="font-bold text-gray-900">{qty} Karung</span></p>
            <p className="text-[13.5px] text-gray-600">• Metode Pembayaran: <span className="font-bold text-gray-900">QRIS</span></p>
            <p className="text-[13.5px] text-gray-600">• Total Transaksi: <span className="font-bold text-gray-900">{formatRupiah(grandTotal)}</span></p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={`/status?kode=${invoiceCode}`} className="w-full sm:w-auto bg-[#2D6A4F] text-white px-8 py-3.5 rounded-xl font-bold text-[14.5px] hover:bg-[#1B4332] transition-colors shadow-md">
              Lacak Pesanan Saya
            </Link>
            <Link href="/pupuk" className="w-full sm:w-auto bg-gray-100 text-gray-700 px-8 py-3.5 rounded-xl font-bold text-[14.5px] hover:bg-gray-200 transition-colors">
              Pesan Lagi
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────
  // TAMPILAN FORM PESANAN UTAMA
  // ────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link href="/pupuk" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 font-medium mb-6">
        <ArrowLeft size={16} /> Kembali ke Halaman Pupuk
      </Link>

      <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Formulir Pesanan Pupuk</h1>
      <p className="text-sm text-gray-500 mb-8">Lengkapi data pengiriman dan upload bukti pembayaran Anda.</p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <form onSubmit={handleKirimPesanan} className="lg:col-span-7 bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-[15px] font-bold text-gray-900 border-b border-gray-100 pb-2">Data Diri</h3>
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><User size={15}/> Nama Lengkap *</label>
              <input type="text" required value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Masukkan nama" className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#2D6A4F] outline-none text-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><Phone size={15}/> WhatsApp *</label>
                <input type="tel" required value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="0812..." className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#2D6A4F] outline-none text-sm" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><Mail size={15}/> Email (Opsional)</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#2D6A4F] outline-none text-sm" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-[15px] font-bold text-gray-900 flex items-center gap-2">
              <MapPin size={18} className="text-[#2D6A4F]" /> Opsi Penerimaan
            </h3>

            <div className="space-y-3">
              <label className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${metodePenerimaan === 'ambil' ? 'border-[#2D6A4F] bg-[#F0FFF4] ring-1 ring-[#2D6A4F]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                <input type="radio" name="pengiriman" value="ambil" checked={metodePenerimaan === 'ambil'} onChange={() => setMetodePenerimaan('ambil')} className="mt-1 w-4 h-4 text-[#2D6A4F] focus:ring-[#2D6A4F]" />
                <div>
                  <p className="font-bold text-[13.5px] text-gray-900">Ambil Sendiri di Peternakan</p>
                  <p className="text-[12px] text-gray-500 mt-0.5">Gratis. Ambil langsung di lokasi Cikarawang Farm.</p>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${metodePenerimaan === 'diantar' ? 'border-[#2D6A4F] bg-[#F0FFF4] ring-1 ring-[#2D6A4F]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                <input type="radio" name="pengiriman" value="diantar" checked={metodePenerimaan === 'diantar'} onChange={() => setMetodePenerimaan('diantar')} className="mt-1 w-4 h-4 text-[#2D6A4F] focus:ring-[#2D6A4F]" />
                <div>
                  <p className="font-bold text-[13.5px] text-gray-900">Diantar ke Alamat</p>
                  <p className="text-[12px] text-gray-500 mt-0.5">Flat Rate Area Bogor menggunakan mobil Pick-Up.</p>
                </div>
              </label>
            </div>

            {metodePenerimaan === 'diantar' ? (
              <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Pilih Zona Area Bogor *</label>
                  <select value={zona} onChange={(e) => setZona(Number(e.target.value))} className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#2D6A4F] outline-none text-sm bg-white">
                    <option value={tarifOngkir.zona1}>Zona 1: Dramaga, Cikarawang, Ciomas, Bogor Barat — Rp {tarifOngkir.zona1.toLocaleString('id-ID')}</option>
                    <option value={tarifOngkir.zona2}>Zona 2: Kota Bogor Lainnya (Tengah, Utara, Timur, Selatan) — Rp {tarifOngkir.zona2.toLocaleString('id-ID')}</option>
                    <option value={tarifOngkir.zona3}>Zona 3: Kabupaten Bogor Luar (Cibinong, Parung, Ciawi, dll) — Rp {tarifOngkir.zona3.toLocaleString('id-ID')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Alamat Lengkap *</label>
                  <textarea required rows={3} value={alamat} onChange={(e) => setAlamat(e.target.value)} placeholder="Tuliskan jalan, desa/kelurahan..." className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#2D6A4F] outline-none text-sm resize-none"></textarea>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Patokan Lokasi</label>
                  <input type="text" value={patokan} onChange={(e) => setPatokan(e.target.value)} placeholder="Contoh: Depan warung Madura pagar hitam" className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#2D6A4F] outline-none text-sm" />
                </div>
              </div>
            ) : (
              <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl animate-in fade-in">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Catatan Pesanan (Opsional)</label>
                <textarea rows={2} value={alamat} onChange={(e) => setAlamat(e.target.value)} placeholder="Tuliskan jika ada perkiraan jam ambil..." className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#2D6A4F] outline-none text-sm resize-none"></textarea>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-[15px] font-bold text-gray-900 flex items-center gap-2">
              <QrCode size={18} className="text-[#2D6A4F]" /> Metode Pembayaran
            </h3>

            <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-5 flex flex-col items-center">
              <div className="flex items-center gap-2 bg-[#2D6A4F]/10 text-[#2D6A4F] px-4 py-2 rounded-full text-xs font-bold">
                <QrCode size={14} /> Transfer Instan Menggunakan QRIS
              </div>
              
              <p className="text-[12.5px] text-gray-500 text-center max-w-sm leading-relaxed">
                Silakan pindai kode QRIS di bawah ini melalui aplikasi e-Wallet atau M-Banking Anda, lalu lampirkan bukti transfernya.
              </p>

              <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center bg-white shadow-sm overflow-hidden p-2">
                {qrisImage ? (
                  <img src={qrisImage} alt="QRIS Merchant" className="w-full h-full object-contain" />
                ) : (
                  <>
                    <QrCode size={64} className="text-gray-300 mb-2" />
                    <p className="text-xs text-gray-400 font-medium text-center px-2">QRIS Belum Diatur Owner</p>
                  </>
                )}
              </div>

              <div className="w-full max-w-sm bg-white border border-gray-100 rounded-xl p-4 space-y-3 shadow-sm">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-gray-500">Merchant Name:</span>
                  <span className="font-bold text-gray-900">Cikarawang Farm</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="text-[13px] text-gray-500">Jumlah Pembayaran:</span>
                  <span className="font-black text-[#2D6A4F] text-[15px]">{formatRupiah(grandTotal)}</span>
                </div>
              </div>

              <div className="w-full max-w-sm pt-2">
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Upload Bukti Transfer *</label>
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-7 h-7 text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500"><span className="font-semibold text-[#2D6A4F]">Klik untuk upload bukti</span></p>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setBuktiTf(e.target.files?.[0] || null)} />
                </label>
                
                {buktiTf && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between animate-in slide-in-from-top-2">
                    <span className="text-xs font-medium text-green-800 truncate pr-4">{buktiTf.name}</span>
                    <button type="button" onClick={() => setBuktiTf(null)} className="text-green-700 hover:text-green-900 text-xs font-bold bg-green-200/50 px-2 py-1 rounded">Batal</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-[#2D6A4F] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#1B4332] disabled:opacity-70 mt-6 shadow-md transition-all">
            {isSubmitting ? <><Loader2 className="animate-spin" size={18} /> Memproses Pesanan...</> : 'Kirim Pesanan'}
          </button>
        </form>

        <div className="lg:col-span-5 bg-gray-50/70 border border-gray-200/60 rounded-3xl p-6 space-y-5 sticky top-6">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3">Ringkasan Pesanan</h3>
          
          <div className="space-y-3">
            <div className="flex gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm items-center">
              <div className="w-16 h-16 bg-[#6B8E73] rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                 <Package size={28} className="text-white opacity-90" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <p className="text-[13px] font-bold text-gray-900 line-clamp-2">Pupuk Organik Kotoran Domba</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{qty} Karung</span>
                  <span className="text-xs font-bold text-[#2D6A4F]">{formatRupiah(subtotal)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-300 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500"><span>Subtotal ({qty} Karung)</span><span className="font-bold">{formatRupiah(subtotal)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Ongkos Kirim</span><span className="font-bold text-gray-800">{metodePenerimaan === 'diantar' ? formatRupiah(ongkir) : 'Gratis'}</span></div>
            
            <div className="border-t border-gray-200 pt-3 flex flex-col items-end">
              <span className="text-xs text-gray-400 mb-1">Total Tagihan</span>
              <span className="text-2xl font-black text-[#2D6A4F]">{formatRupiah(grandTotal)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function PesanPupukPage() {
  return <Suspense fallback={<div className="min-h-[80vh] flex justify-center items-center"><Loader2 size={40} className="animate-spin text-[#2D6A4F]" /></div>}><FormPesananPupukContent /></Suspense>;
}