'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Upload, Loader2, CheckCircle2 } from 'lucide-react';

export default function TambahTernakPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [sukses, setSukses] = useState(false);

  const [idTernak, setIdTernak] = useState('');
  const [gender, setGender] = useState('Jantan');
  const [breed, setBreed] = useState('Garut');
  const [berat, setBerat] = useState('');
  const [harga, setHarga] = useState('');
  const [fileFoto, setFileFoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (berat && Number(berat) > 0) {
      const hargaPerKg = gender === 'Jantan' ? 100000 : 80000;
      const totalKalkulasi = Number(berat) * hargaPerKg;
      setHarga(totalKalkulasi.toString());
    } else {
      setHarga('');
    }
  }, [berat, gender]);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileFoto(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileFoto) {
      alert('Tolong pilih foto ternak terlebih dahulu!');
      return;
    }

    setIsLoading(true);

    try {
      // 🟢 1. CEK SESI LOGIN DULU (Jangan-jangan tiket admin hilang saat refresh)
      console.log("-> 1. Mengecek sesi login...");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
         alert('Sesi login admin terputus! Buka tab baru, login ulang di /masuk, lalu kembali ke sini.');
         setIsLoading(false);
         return;
      }

      // 🟢 2. UPLOAD FOTO KE STORAGE
      console.log("-> 2. Mulai upload foto ke Storage...");
      const fileExt = fileFoto.name.split('.').pop();
      const fileName = `${idTernak.replace(/\s+/g, '-')}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gambar-ternak')
        .upload(filePath, fileFoto);

      if (uploadError) {
        console.error("DETAIL ERROR UPLOAD:", uploadError);
        throw new Error('Gagal Upload Foto: ' + uploadError.message);
      }

      // 🟢 3. AMBIL URL FOTO
      console.log("-> 3. Foto sukses, mengambil URL...");
      const { data: publicUrlData } = supabase.storage
        .from('gambar-ternak')
        .getPublicUrl(filePath);
      
      const imageUrl = publicUrlData.publicUrl;

      // 🟢 4. SIMPAN TEKS KE DATABASE
      console.log("-> 4. Mulai menyimpan teks ke database Katalog Ternak...");
      const { error: dbError } = await supabase
        .from('katalog_ternak')
        .insert([
          {
            id: idTernak.toUpperCase(),
            name: idTernak.toUpperCase(),
            gender: gender,
            breed: breed,
            weight: Number(berat),
            total_price: Number(harga),
            image_url: imageUrl,
            status: 'Tersedia',
            vaksin: 'Vaksin'
          }
        ]);

      if (dbError) {
        console.error("DETAIL ERROR DATABASE:", dbError);
        if (dbError.code === '23505') {
          throw new Error('Kode Unik ini sudah dipakai! Gunakan kode lain.');
        }
        throw new Error('Gagal simpan ke DB: ' + dbError.message);
      }

      // 🟢 5. SEMUA SUKSES
      console.log("-> 5. MANTAP! Semua proses sukses!");
      setSukses(true);
      
      setTimeout(() => {
        setSukses(false);
        setIdTernak(''); setBerat(''); setHarga('');
        setFileFoto(null); setPreviewUrl(null);
      }, 2500);

    } catch (error: any) {
      console.error('PROSES TERHENTI:', error);
      alert('Terdapat Error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-sm border border-gray-100 mb-10 animate-in fade-in">
      <h1 className="text-2xl font-bold text-[#2D6A4F] mb-2">Tambah Katalog Ternak Baru</h1>
      <p className="text-gray-500 text-[14px] mb-8">
        Jantan: Rp 100.000/Kg | Betina: Rp 80.000/Kg. (Semua otomatis berstatus Vaksin).
      </p>
      
      {sukses && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 border border-green-200">
          <CheckCircle2 /> Berhasil menambahkan ternak ke katalog!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[13.5px] font-semibold text-gray-700 mb-2">Foto Ternak *</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFotoChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              required
            />
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="h-40 mx-auto rounded-lg object-cover shadow-sm" />
            ) : (
              <div className="flex flex-col items-center pointer-events-none">
                <Upload className="text-gray-400 mb-2" size={32} />
                <p className="text-sm text-gray-500">Klik atau seret foto domba ke sini</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[13.5px] font-medium text-gray-700 mb-1.5">Kode Unik / Tag Telinga *</label>
          <input type="text" value={idTernak} onChange={(e) => setIdTernak(e.target.value)} placeholder="Contoh: DP-001" className="w-full p-3 border border-gray-200 rounded-xl uppercase focus:border-[#2D6A4F] outline-none font-semibold" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[13.5px] font-medium text-gray-700 mb-1.5">Jenis / Ras *</label>
            <select value={breed} onChange={(e) => setBreed(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:border-[#2D6A4F] outline-none">
              <option value="Garut">Garut</option>
              <option value="Dorper">Dorper</option>
              <option value="Batur">Batur</option>
              <option value="Merino">Merino</option>
            </select>
          </div>
          <div>
            <label className="block text-[13.5px] font-medium text-gray-700 mb-1.5">Jenis Kelamin *</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:border-[#2D6A4F] outline-none">
              <option value="Jantan">Jantan (Rp 100k/Kg)</option>
              <option value="Betina">Betina (Rp 80k/Kg)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[13.5px] font-medium text-gray-700 mb-1.5">Berat (Kg) *</label>
            <input type="number" value={berat} onChange={(e) => setBerat(e.target.value)} placeholder="0" className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#2D6A4F] outline-none" required />
          </div>
          <div>
            <label className="block text-[13.5px] font-medium text-gray-700 mb-1.5">Total Harga (Otomatis)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
              <input type="text" value={harga ? new Intl.NumberFormat('id-ID').format(Number(harga)) : ''} className="w-full pl-11 pr-4 py-3 border border-green-200 bg-[#F0FFF4] text-[#2D6A4F] font-bold rounded-xl outline-none" readOnly />
            </div>
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="w-full bg-[#2D6A4F] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#1B4332] transition-colors disabled:opacity-70 mt-4">
          {isLoading ? <><Loader2 className="animate-spin" size={18} /> Menyimpan Data...</> : 'Simpan ke Katalog'}
        </button>
      </form>
    </div>
  );
}