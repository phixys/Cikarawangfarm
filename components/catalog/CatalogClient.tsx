'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { LayoutGrid, List, Loader2, ShoppingBag } from 'lucide-react';
import FilterBar from './FilterBar';
import SidebarFilter from './SidebarFilter';
import CatalogCard from './CatalogCard';
import { AnimalBreed } from '@/lib/animalData';
import { supabase } from '@/lib/supabase';

export default function CatalogClient() {
  const [dbAnimals, setDbAnimals] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [selectedAnimals, setSelectedAnimals] = useState<any[]>([]);

  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('Semua');
  const [berat, setBerat] = useState('Semua Berat');
  const [status, setStatus] = useState('Semua');
  const [sortBy, setSortBy] = useState('harga-asc');

  const [minPrice, setMinPrice] = useState('500000');
  const [maxPrice, setMaxPrice] = useState('3000000');
  const [selectedBreeds, setSelectedBreeds] = useState<AnimalBreed[]>(['Garut', 'Merino']);
  const [appliedMin, setAppliedMin] = useState(500000);
  const [appliedMax, setAppliedMax] = useState(3000000);
  const [appliedBreeds, setAppliedBreeds] = useState<AnimalBreed[]>([]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const { data, error } = await supabase
          .from('katalog_ternak')
          .select('*')
          // 🟢 KUNCI RAHASIANYA DI SINI: Hanya ambil yang benar-benar "Tersedia"
          .eq('status', 'Tersedia') 
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mappedData = (data || []).map((item) => ({
          ...item,
          totalPrice: item.total_price,
          imageUrl: item.image_url,
        }));
        setDbAnimals(mappedData);
      } catch (err) {
        console.error('Gagal memuat data ternak:', err);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchAnimals();
  }, []);

  const handleBreedToggle = (breed: AnimalBreed) => {
    setSelectedBreeds((prev) => prev.includes(breed) ? prev.filter((b) => b !== breed) : [...prev, breed]);
  };

  const handleApplyFilter = () => {
    setAppliedMin(Number(minPrice) || 0);
    setAppliedMax(Number(maxPrice) || 99999999);
    setAppliedBreeds(selectedBreeds);
  };

  const handleResetFilter = () => {
    setMinPrice('500000'); setMaxPrice('3000000'); setSelectedBreeds([]);
    setAppliedMin(0); setAppliedMax(99999999); setAppliedBreeds([]);
    setSearch(''); setGender('Semua'); setBerat('Semua Berat'); setStatus('Semua'); setSortBy('harga-asc');
  };

  const handleToggleSelect = (animal: any) => {
    setSelectedAnimals((prev) => {
      const isExist = prev.some((a) => a.id === animal.id);
      if (isExist) return prev.filter((a) => a.id !== animal.id);
      return [...prev, animal];
    });
  };

  const filtered: any[] = useMemo(() => {
    let list = [...dbAnimals];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) => a.id.toLowerCase().includes(q) || a.name.toLowerCase().includes(q));
    }
    if (gender !== 'Semua') list = list.filter((a) => a.gender === gender);
    if (berat === '<15') list = list.filter((a) => a.weight < 15);
    else if (berat === '15-25') list = list.filter((a) => a.weight >= 15 && a.weight <= 25);
    else if (berat === '>25') list = list.filter((a) => a.weight > 25);
    // Filter status bawaan UI ini sekarang cuma memfilter sisa domba yang "Tersedia" saja
    if (status !== 'Semua') list = list.filter((a) => a.status === status); 
    
    list = list.filter((a) => a.totalPrice >= appliedMin && a.totalPrice <= appliedMax);
    if (appliedBreeds.length > 0) list = list.filter((a) => appliedBreeds.includes(a.breed));

    if (sortBy === 'harga-asc') list.sort((a, b) => a.totalPrice - b.totalPrice);
    if (sortBy === 'harga-desc') list.sort((a, b) => b.totalPrice - a.totalPrice);
    if (sortBy === 'berat-asc') list.sort((a, b) => a.weight - b.weight);
    if (sortBy === 'berat-desc') list.sort((a, b) => b.weight - a.weight);
    if (sortBy === 'id-asc') list.sort((a, b) => a.id.localeCompare(b.id));

    return list;
  }, [search, gender, berat, status, sortBy, appliedMin, appliedMax, appliedBreeds, dbAnimals]);

  return (
    <div className="pb-28">
      <FilterBar
        search={search} gender={gender} berat={berat} status={status} sortBy={sortBy}
        onSearchChange={setSearch} onGenderChange={setGender} onBeratChange={setBerat} onStatusChange={setStatus} onSortChange={setSortBy}
      />

      <div className="max-w-[1200px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-5">
          <p className="text-[13.5px] text-gray-600">
            Menampilkan <span className="font-bold text-gray-900">{filtered.length}</span> dari <span className="font-bold text-gray-900">{dbAnimals.length}</span> ternak tersedia
          </p>
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}><LayoutGrid size={16} /></button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}><List size={16} /></button>
          </div>
        </div>

        <div className="flex gap-6 items-start">
          <SidebarFilter
            minPrice={minPrice} maxPrice={maxPrice} selectedBreeds={selectedBreeds}
            onMinPriceChange={setMinPrice} onMaxPriceChange={setMaxPrice} onBreedToggle={handleBreedToggle} onApply={handleApplyFilter} onReset={handleResetFilter}
          />

          <div className="flex-1">
            {isLoadingData ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                <Loader2 size={40} className="animate-spin text-[#2D6A4F] mb-4" />
                <p className="text-gray-500 font-medium text-sm">Sedang memuat data dari peternakan...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                <p className="text-gray-500 font-medium text-[14px]">Katalog sedang kosong atau semua ternak sudah habis dipesan.</p>
                <button onClick={handleResetFilter} className="mt-3 text-[13px] text-[#2D6A4F] font-semibold underline hover:no-underline">Reset filter</button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'flex flex-col gap-3'}>
                {filtered.map((animal) => (
                  <CatalogCard 
                    key={animal.id} 
                    animal={animal} 
                    isSelected={selectedAnimals.some(a => a.id === animal.id)}
                    onToggleSelect={handleToggleSelect}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedAnimals.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.15)] p-4 md:p-5 z-50 animate-in slide-in-from-bottom-8 duration-300">
          <div className="max-w-[1200px] mx-auto flex flex-row items-center justify-between px-2 md:px-6">
            
            <div className="flex items-center gap-3 md:gap-4 flex-shrink min-w-0 pr-4">
              <div className="hidden md:flex flex-shrink-0 w-12 h-12 bg-[#2D6A4F]/10 rounded-full items-center justify-center text-[#2D6A4F]">
                <ShoppingBag size={24} />
              </div>
              <div className="truncate">
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-0.5 truncate">Mode Borongan</p>
                <p className="text-sm md:text-xl font-black text-[#2D6A4F] truncate">
                  {selectedAnimals.length} Domba <span className="text-gray-300 font-normal mx-1 md:mx-2">|</span> Rp {selectedAnimals.reduce((sum, a) => sum + a.totalPrice, 0).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              <button 
                onClick={() => setSelectedAnimals([])}
                className="px-3 md:px-5 py-2.5 md:py-3 text-[13px] md:text-[14px] font-semibold text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors whitespace-nowrap"
              >
                Batal
              </button>
              
              <Link 
                href={`/pesan-ternak?ids=${selectedAnimals.map(a => a.id).join(',')}`}
                className="bg-[#2D6A4F] text-white flex-none shrink-0 min-w-max whitespace-nowrap inline-flex justify-center items-center px-5 md:px-8 py-2.5 md:py-3 rounded-xl text-[13.5px] md:text-[15px] font-bold shadow-lg hover:bg-[#1B4332] hover:-translate-y-1 transition-all"
              >
                Proses Pesanan
              </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}