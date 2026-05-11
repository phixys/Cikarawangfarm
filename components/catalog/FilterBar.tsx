'use client';

import { Search } from 'lucide-react';

interface FilterBarProps {
  search: string;
  gender: string;
  berat: string;
  status: string;
  sortBy: string;
  onSearchChange: (v: string) => void;
  onGenderChange: (v: string) => void;
  onBeratChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onSortChange: (v: string) => void;
}

export default function FilterBar({
  search, gender, berat, status, sortBy,
  onSearchChange, onGenderChange, onBeratChange, onStatusChange, onSortChange,
}: FilterBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-[64px] z-40 shadow-sm">
      <div className="max-w-[1200px] mx-auto flex flex-wrap items-start gap-3">

        {/* Search */}
        <div className="relative min-w-[160px] max-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari ID atau tipe domba..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-[13px] border border-gray-200 rounded-full focus:outline-none focus:border-primary-medium focus:ring-1 focus:ring-primary-medium/30 bg-gray-50"
          />
        </div>

        {/* Gender toggle pills */}
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] text-gray-500 font-medium">Jenis Kelamin:</span>
          {['Semua', 'Jantan', 'Betina'].map((g) => (
            <button
              key={g}
              onClick={() => onGenderChange(g)}
              className={`
                text-[12.5px] font-medium px-3.5 py-1.5 rounded-full border transition-all duration-150
                ${gender === g
                  ? 'bg-primary-dark text-white border-primary-dark'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-primary-medium hover:text-primary-dark'}
              `}
            >
              {g === 'Jantan' ? '♂ Jantan' : g === 'Betina' ? '♀ Betina' : g}
            </button>
          ))}
        </div>

        {/* Berat dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-gray-500 font-medium">Berat:</span>
          <select
            value={berat}
            onChange={(e) => onBeratChange(e.target.value)}
            className="text-[12px] border border-gray-200 rounded-full px-2.5 py-1.5 bg-white focus:outline-none focus:border-primary-medium cursor-pointer"
          >
            <option value="Semua Berat">Semua Berat</option>
            <option value="<15">{'< 15 kg'}</option>
            <option value="15-25">15 – 25 kg</option>
            <option value=">25">{'> 25 kg'}</option>
          </select>
        </div>

        <div className="flex flex-wrap items-start gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-gray-500 font-medium">Status:</span>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="text-[12px] border border-gray-200 rounded-full px-2.5 py-1.5 bg-white focus:outline-none focus:border-primary-medium cursor-pointer"
            >
              <option value="Semua">Semua</option>
              <option value="Tersedia">Tersedia</option>
              <option value="Dipesan">Dipesan</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12px] text-gray-500 font-medium">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="text-[12px] border border-gray-200 rounded-full px-2.5 py-1.5 bg-white focus:outline-none focus:border-primary-medium cursor-pointer"
            >
              <option value="harga-asc">Harga: Rendah ke Tinggi</option>
              <option value="harga-desc">Harga: Tinggi ke Rendah</option>
              <option value="berat-asc">Berat: Ringan ke Berat</option>
              <option value="berat-desc">Berat: Berat ke Ringan</option>
              <option value="id-asc">ID: A ke Z</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
}
