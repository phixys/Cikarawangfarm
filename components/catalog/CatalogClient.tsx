'use client';

import { useState, useMemo } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import FilterBar from './FilterBar';
import SidebarFilter from './SidebarFilter';
import CatalogCard from './CatalogCard';
import { animals, Animal, AnimalBreed } from '@/lib/animalData';

export default function CatalogClient() {
  // Filter bar state
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('Semua');
  const [berat, setBerat] = useState('Semua Berat');
  const [status, setStatus] = useState('Semua');
  const [sortBy, setSortBy] = useState('harga-asc');

  // Sidebar filter state
  const [minPrice, setMinPrice] = useState('500000');
  const [maxPrice, setMaxPrice] = useState('3000000');
  const [selectedBreeds, setSelectedBreeds] = useState<AnimalBreed[]>(['Garut', 'Merino']);
  const [appliedMin, setAppliedMin] = useState(500000);
  const [appliedMax, setAppliedMax] = useState(3000000);
  const [appliedBreeds, setAppliedBreeds] = useState<AnimalBreed[]>([]);

  // View mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleBreedToggle = (breed: AnimalBreed) => {
    setSelectedBreeds((prev) =>
      prev.includes(breed) ? prev.filter((b) => b !== breed) : [...prev, breed]
    );
  };

  const handleApplyFilter = () => {
    setAppliedMin(Number(minPrice) || 0);
    setAppliedMax(Number(maxPrice) || 99999999);
    setAppliedBreeds(selectedBreeds);
  };

  const handleResetFilter = () => {
    setMinPrice('500000');
    setMaxPrice('3000000');
    setSelectedBreeds([]);
    setAppliedMin(0);
    setAppliedMax(99999999);
    setAppliedBreeds([]);
    setSearch('');
    setGender('Semua');
    setBerat('Semua Berat');
    setStatus('Semua');
    setSortBy('harga-asc');
  };

  const filtered: Animal[] = useMemo(() => {
    let list = [...animals];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) => a.id.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
      );
    }

    // Gender
    if (gender !== 'Semua') {
      list = list.filter((a) => a.gender === gender);
    }

    // Berat
    if (berat === '<15') list = list.filter((a) => a.weight < 15);
    else if (berat === '15-25') list = list.filter((a) => a.weight >= 15 && a.weight <= 25);
    else if (berat === '>25') list = list.filter((a) => a.weight > 25);

    // Status
    if (status !== 'Semua') {
      list = list.filter((a) => a.status === status);
    }

    // Price range (applied)
    list = list.filter(
      (a) => a.totalPrice >= appliedMin && a.totalPrice <= appliedMax
    );

    // Breed filter (applied)
    if (appliedBreeds.length > 0) {
      list = list.filter((a) => appliedBreeds.includes(a.breed));
    }

    // Sort
    if (sortBy === 'harga-asc')   list.sort((a, b) => a.totalPrice - b.totalPrice);
    if (sortBy === 'harga-desc')  list.sort((a, b) => b.totalPrice - a.totalPrice);
    if (sortBy === 'berat-asc')   list.sort((a, b) => a.weight - b.weight);
    if (sortBy === 'berat-desc')  list.sort((a, b) => b.weight - a.weight);
    if (sortBy === 'id-asc')      list.sort((a, b) => a.id.localeCompare(b.id));

    return list;
  }, [search, gender, berat, status, sortBy, appliedMin, appliedMax, appliedBreeds]);

  return (
    <>
      {/* Sticky filter bar */}
      <FilterBar
        search={search}
        gender={gender}
        berat={berat}
        status={status}
        sortBy={sortBy}
        onSearchChange={setSearch}
        onGenderChange={setGender}
        onBeratChange={setBerat}
        onStatusChange={setStatus}
        onSortChange={setSortBy}
      />

      {/* Body */}
      <div className="max-w-[1200px] mx-auto px-6 py-6">
        {/* Result count + view toggle */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-[13.5px] text-gray-600">
            Menampilkan{' '}
            <span className="font-bold text-gray-900">{filtered.length}</span>{' '}
            dari{' '}
            <span className="font-bold text-gray-900">{animals.length}</span>{' '}
            ternak tersedia
          </p>
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Sidebar + Grid */}
        <div className="flex gap-6 items-start">
          <SidebarFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            selectedBreeds={selectedBreeds}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            onBreedToggle={handleBreedToggle}
            onApply={handleApplyFilter}
            onReset={handleResetFilter}
          />

          {/* Cards */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-gray-400 text-[14px]">Tidak ada ternak yang sesuai filter.</p>
                <button
                  onClick={handleResetFilter}
                  className="mt-3 text-[13px] text-primary-dark underline hover:no-underline"
                >
                  Reset filter
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-3 gap-4'
                    : 'flex flex-col gap-3'
                }
              >
                {filtered.map((animal) => (
                  <CatalogCard key={animal.id} animal={animal} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
