'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { 
  User, Phone, Mail, MapPin, QrCode, 
  CheckCircle2, Send, Map, Baby, Copy, Loader2,
  AlertTriangle, UploadCloud
} from 'lucide-react';
import Link from 'next/link';

// DATABASE PAKET (Harga Dasar 1 Ekor)
const DAFTAR_PAKET: Record<string, { nama: string, porsi: number, harga: number }> = {
  barokah: { nama: 'Paket Aqiqah Barokah', porsi: 50, harga: 2500000 },
  premium: { nama: 'Paket Aqiqah Premium', porsi: 70, harga: 3800000 },
  eksklusif: { nama: 'Paket Aqiqah Eksklusif', porsi: 100, harga: 5200000 }
};


function FormPesananAqiqahContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const paketDariUrl = searchParams.get('paket') || 'premium';
  const paketAwal = DAFTAR_PAKET[paketDariUrl] ? paketDariUrl : 'premium';
  
  const [namaLengkap, setNamaLengkap] = useState('');
  const [userId, setUserId] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // State Pemesan
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  
  // State Detail Aqiqah
  const [namaAnak, setNamaAnak] = useState('');
  const [genderAnak, setGenderAnak] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [paketTerpilih] = useState(paketAwal);

  // State Pengiriman
  const [penerimaan, setPenerimaan] = useState<'ambil' | 'diantar'>('diantar');
  const [tarifOngkir, setTarifOngkir] = useState({ zona1: 50000, zona2: 100000, zona3: 150000 });
  const [zona, setZona] = useState<number>(50000); 
  const [alamat, setAlamat] = useState('');
  const [patokan, setPatokan] = useState('');
  
  // State Pembayaran (QRIS Only)
  const [buktiTf, setBuktiTf] = useState<File | null>(null);
  const [qrisImage, setQrisImage] = useState('');

  // State Sistem / UI
  const [sukses, setSukses] = useState(false);
  const [kodePesanan, setKodePesanan] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalData, setFinalData] = useState<any>({});

  // Proteksi Login & Ambil Profil
  useEffect(() => {
    const checkUserAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/masuk');
          return;
        }

        setUserId(session.user.id);
        if (session.user.email) setEmail(session.user.email);
        if (session.user.user_metadata?.full_name) setNamaLengkap(session.user.user_metadata.full_name);

        // Coba ambil profil (opsional, tidak menggagalkan halaman jika RLS memblokir)
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', session.user.id)
            .single();
          if (profile?.full_name) setNamaLengkap(profile.full_name);
        } catch (_) {
          // Profil tidak terbaca, gunakan metadata dari sesi Google
        }

        // Ambil gambar QRIS dan Tarif Ongkir
        const { data: pengaturan } = await supabase.from('pengaturan_sistem').select('*');
        if (pengaturan) {
          const qris = pengaturan.find(p => p.kunci === 'qris_url')?.nilai;
          if (qris) setQrisImage(qris);
          
          const z1 = pengaturan.find(p => p.kunci === 'ongkir_zona_1')?.nilai;
          const z2 = pengaturan.find(p => p.kunci === 'ongkir_zona_2')?.nilai;
          const z3 = pengaturan.find(p => p.kunci === 'ongkir_zona_3')?.nilai;
          
          const tarif = {
            zona1: z1 != null && z1 !== '' ? Number(z1) : 50000,
            zona2: z2 != null && z2 !== '' ? Number(z2) : 100000,
            zona3: z3 != null && z3 !== '' ? Number(z3) : 150000
          };
          setTarifOngkir(tarif);
          setZona(tarif.zona1); // Set default zona ke zona 1 terbaru
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/masuk');
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkUserAccess();
  }, [router]);

  // Kalkulasi Syariat & Total Harga
  const paketInfo = DAFTAR_PAKET[paketTerpilih];
  const pengaliSyariat = genderAnak === 'Laki-laki' ? 2 : 1; 
  const porsiDasar = paketInfo.porsi * pengaliSyariat;
  const subtotalPaket = paketInfo.harga * pengaliSyariat;
  const ongkir = penerimaan === 'diantar' ? zona : 0;
  const totalTagihan = subtotalPaket + ongkir;

  const formatRp = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(kodePesanan);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaAnak.trim()) {
      alert('Nama anak wajib diisi untuk niat ibadah Aqiqah.');
      return;
    }

    if (!buktiTf) {
      alert('Mohon upload bukti transfer QRIS terlebih dahulu untuk melanjutkan!');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // 1. Upload Bukti Transfer ke folder 'aqiqah' di Supabase Storage
      const fileExt = buktiTf.name.split('.').pop();
      const filePath = `aqiqah/TF-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('bukti_transfer')
        .upload(filePath, buktiTf);

      if (uploadError) {
        console.error("Storage Error:", uploadError);
        alert(`❌ ERROR UPLOAD GAMBAR:\n${uploadError.message}`);
        setIsSubmitting(false);
        return;
      }

      // 2. Generate Kode Invoice Unik
      const randomNumbers = Math.floor(100000 + Math.random() * 900000);
      const generatedCode = `CF-AQQ-${randomNumbers}`;
      const detailProduk = `${paketInfo.nama} (${pengaliSyariat} Ekor Domba - ${porsiDasar} Porsi)`;

      // 3. Simpan Lengkap ke Tabel 'pesanan'
      const { error: insertError } = await supabase
        .from('pesanan')
        .insert([
          {
            user_id: userId,
            kode_pesanan: generatedCode,
            jenis_pesanan: 'aqiqah', 
            produk: detailProduk,
            jumlah: pengaliSyariat, 
            penerimaan: penerimaan,
            pembayaran: 'QRIS', 
            subtotal: subtotalPaket,
            ongkir: ongkir,
            total: totalTagihan,
            status: 'Menunggu Konfirmasi',
            nama: namaLengkap, 
            whatsapp: whatsapp,
            email: email,
            alamat: penerimaan === 'diantar' ? alamat : 'Ambil di peternakan',
            patokan: penerimaan === 'diantar' ? patokan : '',
            nama_anak: namaAnak,
            gender_anak: genderAnak,
            bukti_transfer: filePath 
          }
        ]);

      if (insertError) {
        console.error("Database Error:", insertError);
        alert(`❌ ERROR SIMPAN DATABASE:\n${insertError.message}`);
        setIsSubmitting(false);
        return;
      }

      // 4. Set Data Halaman Sukses
      setFinalData({ 
        namaPaket: paketInfo.nama, 
        jumlahEkor: pengaliSyariat,
        porsiDasar: porsiDasar,
        totalHarga: totalTagihan,
        anak: `${namaAnak} (${genderAnak})`
      });
      setKodePesanan(generatedCode);
      setSukses(true);
      window.scrollTo(0, 0);

    } catch (error: any) {
      console.error('System Error:', error);
      alert(`Terjadi kesalahan sistem: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="max-w-3xl mx-auto p-20 text-center text-[#2D6A4F] font-semibold">
        <Loader2 className="animate-spin mx-auto mb-3" size={32} /> 
        Memverifikasi akses halaman...
      </div>
    );
  }

  // ────────────────────────────────────────────────────────
  // TAMPILAN HALAMAN SUKSES PESAN
  // ────────────────────────────────────────────────────────
  if (sukses) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 md:p-10 text-center shadow-sm border border-green-100 my-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-green-100 text-[#2D6A4F] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={36} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Pesanan Aqiqah Berhasil!</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          Terima kasih telah mempercayakan aqiqah ananda <span className="font-bold text-gray-800">{finalData.anak}</span> kepada Cikarawang Farm. Status pesanan Anda saat ini adalah <span className="font-semibold text-[#2D6A4F]">Menunggu Konfirmasi</span>.
        </p>

        <div className="bg-[#F0FFF4] border border-green-200 rounded-2xl p-5 mb-6 text-center">
          <p className="text-xs text-[#2D6A4F] font-semibold uppercase tracking-wider mb-2">Kode Pesanan Anda</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl font-bold text-gray-900 tracking-wider">{kodePesanan}</span>
            <button onClick={handleCopyCode} className="p-2 bg-white rounded-lg border border-green-200 text-[#2D6A4F] hover:bg-green-50 transition-colors">
              {isCopied ? <span className="text-xs font-bold text-green-600">Tersalin!</span> : <Copy size={20} />}
            </button>
          </div>
          <p className="text-[11px] text-green-700 mt-3">Gunakan kode ini di halaman <b>Status Pesanan</b>.</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 text-xs text-left text-gray-500 mb-8 space-y-2">
          <div className="flex justify-between border-b border-gray-200 pb-1.5"><span className="font-semibold text-gray-800">{finalData.namaPaket} ({finalData.jumlahEkor} Ekor)</span><span>{finalData.porsiDasar} Porsi</span></div>
          <p>• Total Nasi Box: <span className="font-semibold text-gray-800">{finalData.porsiDasar} Box</span></p>
          <p>• Metode Pembayaran: <span className="font-semibold text-gray-800">QRIS</span></p>
          <p>• Total Transaksi: <span className="font-bold text-[#2D6A4F] text-sm">{formatRp(finalData.totalHarga)}</span></p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={`/status?kode=${kodePesanan}`} className="flex-1 bg-[#2D6A4F] text-white text-sm font-semibold py-3.5 rounded-xl hover:bg-[#1B4332] transition-colors text-center flex items-center justify-center shadow-md">
            Lacak Pesanan Saya
          </Link>
          <Link href="/paket-aqiqah" className="flex-1 bg-gray-100 text-gray-700 text-sm font-semibold py-3.5 rounded-xl hover:bg-gray-200 transition-colors text-center flex items-center justify-center">
            Kembali ke Paket
          </Link>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────
  // TAMPILAN FORM UTAMA (Opsi Tunai/COD Dihapus Total)
  // ────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      <div className="p-8 md:p-10 border-b border-gray-100 bg-[#F0FFF4]/50">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shrink-0 border border-green-100 shadow-sm">
            <Image src="/Logo.png" alt="Logo" width={48} height={48} className="object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Form Pemesanan Aqiqah</h1>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xl">
              Lengkapi formulir di bawah ini untuk memproses pesanan aqiqah Anda. Pastikan nama anak dieja dengan benar untuk keperluan doa dan sertifikat.
            </p>
          </div>
        </div>
      </div>

      <form className="p-8 md:p-10 space-y-10" onSubmit={handleSubmit}>
        
        {/* IDENTITAS PEMESAN */}
        <section>
          <h2 className="text-[15px] font-bold text-gray-800 flex items-center gap-2 border-b pb-3 mb-5"><User size={18} className="text-[#2D6A4F]" /> Identitas Orang Tua / Pemesan</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Nama Lengkap *</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" value={namaLengkap} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none text-gray-700 font-medium cursor-not-allowed" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Nomor WhatsApp *</label>
                <div className="relative"><Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="0812-xxxx-xxxx" className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2D6A4F] outline-none" required /></div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Alamat Email</label>
                <div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contoh@email.com" className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2D6A4F] outline-none" /></div>
              </div>
            </div>
          </div>
        </section>

        {/* DATA ANAK */}
        <section>
          <h2 className="text-[15px] font-bold text-gray-800 flex items-center gap-2 border-b pb-3 mb-5"><Baby size={18} className="text-[#2D6A4F]" /> Data Anak</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Nama Lengkap Anak *</label>
              <input type="text" value={namaAnak} onChange={(e) => setNamaAnak(e.target.value)} placeholder="Masukkan nama lengkap anak" className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:border-[#2D6A4F] outline-none" required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Jenis Kelamin *</label>
              <div className="flex gap-3">
                <label className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border cursor-pointer transition-colors ${genderAnak === 'Laki-laki' ? 'bg-[#F0FFF4] border-[#2D6A4F] text-[#2D6A4F]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  <input type="radio" name="gender" value="Laki-laki" checked={genderAnak === 'Laki-laki'} onChange={() => setGenderAnak('Laki-laki')} className="hidden" />
                  <span className="text-sm font-semibold">Laki-laki</span>
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border cursor-pointer transition-colors ${genderAnak === 'Perempuan' ? 'bg-[#F0FFF4] border-[#2D6A4F] text-[#2D6A4F]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  <input type="radio" name="gender" value="Perempuan" checked={genderAnak === 'Perempuan'} onChange={() => setGenderAnak('Perempuan')} className="hidden" />
                  <span className="text-sm font-semibold">Perempuan</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3">
            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <p className="text-xs text-amber-800 leading-relaxed">
              Sesuai kaidah syariat Islam, aqiqah anak <b>{genderAnak}</b> membutuhkan penyembelihan <b>{pengaliSyariat} ekor domba</b>. Sistem otomatis menyesuaikan porsi dasar dan total harga berdasarkan ketentuan ibadah.
            </p>
          </div>
        </section>


        {/* OPSI PENERIMAAN */}
        <section>
          <h2 className="text-[15px] font-bold text-gray-800 flex items-center gap-2 border-b pb-3 mb-5"><MapPin size={18} className="text-[#2D6A4F]" /> Opsi Penerimaan</h2>
          <div className="space-y-4">
            <button type="button" onClick={() => setPenerimaan('diantar')} className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${penerimaan === 'diantar' ? 'border-[#2D6A4F] bg-[#F0FFF4]' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${penerimaan === 'diantar' ? 'border-[#2D6A4F]' : 'border-gray-300'}`}>{penerimaan === 'diantar' && <div className="w-2.5 h-2.5 bg-[#2D6A4F] rounded-full" />}</div>
              <div><p className="font-semibold text-sm text-gray-800">Diantar ke Rumah / Yayasan</p><p className="text-[13px] text-gray-500 mt-0.5">Dikirim aman dengan mobil operasional Cikarawang Farm.</p></div>
            </button>
            <button type="button" onClick={() => setPenerimaan('ambil')} className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${penerimaan === 'ambil' ? 'border-[#2D6A4F] bg-[#F0FFF4]' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${penerimaan === 'ambil' ? 'border-[#2D6A4F]' : 'border-gray-300'}`}>{penerimaan === 'ambil' && <div className="w-2.5 h-2.5 bg-[#2D6A4F] rounded-full" />}</div>
              <div><p className="font-semibold text-sm text-gray-800">Ambil Sendiri di Rumah Pengolahan</p><p className="text-[13px] text-gray-500 mt-0.5">Gratis. Ambil langsung di rumah produksi utama kami.</p></div>
            </button>
            
            {penerimaan === 'diantar' && (
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mt-2 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Pilih Zona Area Bogor & Sekitarnya *</label>
                  <div className="relative"><Map className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select 
                      value={zona} 
                      onChange={(e) => setZona(Number(e.target.value))} 
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2D6A4F] outline-none appearance-none bg-white font-medium text-gray-700"
                    >
                      <option value={tarifOngkir.zona1}>Zona 1: Dramaga, Cikarawang, Ciomas, Bogor Barat — Rp {tarifOngkir.zona1.toLocaleString('id-ID')}</option>
                      <option value={tarifOngkir.zona2}>Zona 2: Kota Bogor Lainnya (Tengah, Utara, Timur, Selatan, Tanah Sareal) — Rp {tarifOngkir.zona2.toLocaleString('id-ID')}</option>
                      <option value={tarifOngkir.zona3}>Zona 3: Kabupaten Bogor Luar (Cibinong, Bojonggede, Parung, Ciawi, dll) — Rp {tarifOngkir.zona3.toLocaleString('id-ID')}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Alamat Lengkap Pengiriman *</label>
                  <textarea rows={3} value={alamat} onChange={(e) => setAlamat(e.target.value)} placeholder="Nama Jalan, RT/RW, Kelurahan, Kecamatan..." className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:border-[#2D6A4F] outline-none resize-none" required={penerimaan === 'diantar'}></textarea>
                </div>
                <div><label className="block text-sm text-gray-600 mb-1.5">Patokan Lokasi</label><input type="text" value={patokan} onChange={(e) => setPatokan(e.target.value)} placeholder="Contoh: Depan Masjid Jami" className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:border-[#2D6A4F] outline-none" /></div>
              </div>
            )}
          </div>
        </section>

        {/* METODE PEMBAYARAN: HANYA QRIS */}
        <section>
          <h2 className="text-[15px] font-bold text-gray-800 flex items-center gap-2 border-b pb-3 mb-5"><QrCode size={18} className="text-[#2D6A4F]" /> Metode Pembayaran</h2>

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
                <span className="font-black text-[#2D6A4F] text-[15px]">{formatRp(totalTagihan)}</span>
              </div>
            </div>

            {/* Upload File Area */}
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
        </section>

        {/* RINGKASAN HARGA & SUBMIT */}
        <section className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Ringkasan Harga</h3>
          <div className="space-y-3 text-sm text-gray-600 mb-5">
            <div className="flex justify-between items-center">
              <div>
                <span className="block font-medium text-gray-800">{paketInfo.nama}</span>
                <span className="text-xs text-gray-400">{pengaliSyariat} Ekor Domba = {porsiDasar} Porsi</span>
              </div>
              <span className="font-semibold text-gray-800">{formatRp(subtotalPaket)}</span>
            </div>
            <div className="flex justify-between"><span>Biaya Pengiriman</span><span className="font-semibold text-gray-800">{formatRp(ongkir)}</span></div>
          </div>
          <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-6"><span className="font-bold text-gray-800">Total Tagihan</span><span className="text-2xl font-bold text-[#2D6A4F]">{formatRp(totalTagihan)}</span></div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#2D6A4F] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#1B4332] transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Memproses Pesanan...</> : <><Send size={16} /> Kirim Pesanan Aqiqah</>}
          </button>
        </section>
      </form>
    </div>
  );
}

export default function PesanAqiqahPage() {
  return (
    <div className="bg-[#F0FFF4] min-h-screen w-full py-10 px-4 sm:px-6">
      <Suspense fallback={<div className="max-w-3xl mx-auto bg-white rounded-3xl p-20 text-center text-gray-500 font-medium animate-pulse"><Loader2 size={32} className="animate-spin mx-auto mb-2 text-[#2D6A4F]" />Memuat formulir aqiqah...</div>}>
        <FormPesananAqiqahContent />
      </Suspense>
    </div>
  );
}