'use client';

export default function AdminStockPage() {
  return (
    <main className="min-h-screen bg-[#F0FFF4] p-6">
      <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-10 shadow-xl">
        <h1 className="text-3xl font-bold text-[#2D6A4F] mb-4">Admin Stock Management</h1>
        <p className="text-gray-600 mb-6">
          Halaman ini hanya dapat diakses oleh admin. Di sini Anda dapat mengelola katalog paket aqiqah, domba, dan pupuk.
        </p>
        <div className="rounded-2xl border border-gray-200 p-6 bg-green-50 text-green-800">
          <p className="font-semibold">Role yang diizinkan: admin</p>
        </div>
      </div>
    </main>
  );
}
