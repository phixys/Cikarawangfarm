export default function KelolaPesananPage() {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-[#2D6A4F] mb-2">Kelola Pesanan Masuk</h1>
      <p className="text-gray-500 text-sm mb-8">
        Pantau dan perbarui status pesanan pelanggan dari halaman ini.
      </p>
      
      <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
        <p className="text-gray-500 font-medium">Tabel antrean pesanan dari Supabase akan kita buat di sini</p>
      </div>
    </div>
  );
}