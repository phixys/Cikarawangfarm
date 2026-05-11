'use client';

export default function OwnerFinancePage() {
  return (
    <main className="min-h-screen bg-[#F0FFF4] p-6">
      <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-10 shadow-xl">
        <h1 className="text-3xl font-bold text-[#2D6A4F] mb-4">Dashboard Keuangan</h1>
        <p className="text-gray-600 mb-6">
          Halaman ini hanya dapat diakses oleh owner. Di sini Anda dapat melihat data pendapatan, laporan transaksi, dan analitik bisnis.
        </p>
        <div className="rounded-2xl border border-gray-200 p-6 bg-blue-50 text-blue-800">
          <p className="font-semibold">Role yang diizinkan: owner</p>
        </div>
      </div>
    </main>
  );
}
