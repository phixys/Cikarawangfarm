'use client';

import { AnimalBreed } from '@/lib/animalData';

const breeds: AnimalBreed[] = ['Garut', 'Merino', 'Dorper', 'Batur'];

interface SidebarFilterProps {
  minPrice: string;
  maxPrice: string;
  selectedBreeds: AnimalBreed[];
  onMinPriceChange: (v: string) => void;
  onMaxPriceChange: (v: string) => void;
  onBreedToggle: (breed: AnimalBreed) => void;
  onApply: () => void;
  onReset: () => void;
}

export default function SidebarFilter({
  minPrice, maxPrice, selectedBreeds,
  onMinPriceChange, onMaxPriceChange, onBreedToggle,
  onApply, onReset,
}: SidebarFilterProps) {
  return (
    <aside className="w-[220px] shrink-0">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

        {/* Rentang Harga */}
        <div className="mb-6">
          <h3 className="text-[13px] font-semibold text-gray-800 mb-3">Rentang Harga</h3>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value.replace(/\D/g, ''))}
              placeholder="Min"
              className="w-full text-[12px] border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-primary-medium"
            />
            <span className="text-gray-400 text-[12px] shrink-0">—</span>
            <input
              type="text"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value.replace(/\D/g, ''))}
              placeholder="Max"
              className="w-full text-[12px] border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-primary-medium"
            />
          </div>
        </div>

        {/* Tipe Domba */}
        <div className="mb-6">
          <h3 className="text-[13px] font-semibold text-gray-800 mb-3">Tipe Domba</h3>
          <div className="flex flex-col gap-2.5">
            {breeds.map((breed) => {
              const checked = selectedBreeds.includes(breed);
              return (
                <label
                  key={breed}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <div
                    onClick={() => onBreedToggle(breed)}
                    className={`
                      w-4 h-4 rounded flex items-center justify-center border transition-all duration-150 shrink-0
                      ${checked
                        ? 'bg-primary-dark border-primary-dark'
                        : 'border-gray-300 group-hover:border-primary-medium'}
                    `}
                  >
                    {checked && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3L3.5 5.5L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span
                    onClick={() => onBreedToggle(breed)}
                    className={`text-[13px] transition-colors ${checked ? 'text-gray-900 font-medium' : 'text-gray-600'}`}
                  >
                    {breed}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onApply}
            className="w-full bg-primary-dark text-white text-[13px] font-semibold py-2.5 rounded-full hover:bg-primary-medium transition-colors duration-150"
          >
            Terapkan Filter
          </button>
          <button
            onClick={onReset}
            className="w-full bg-white text-primary-dark text-[13px] font-medium py-2.5 rounded-full border border-primary-dark hover:bg-primary-tint transition-colors duration-150"
          >
            Reset Filter
          </button>
        </div>
      </div>
    </aside>
  );
}
