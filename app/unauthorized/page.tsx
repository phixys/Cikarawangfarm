'use client';

import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-[#F0FFF4] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-xl bg-white rounded-[2rem] p-10 shadow-xl text-center">
        <h1 className="text-3xl font-bold text-[#2D6A4F] mb-4">Akses Ditolak</h1>
        <p className="text-gray-600 mb-8">
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-xl bg-[#2D6A4F] px-6 py-3 text-white font-semibold hover:bg-[#1B4332] transition-colors"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </main>
  );
}
