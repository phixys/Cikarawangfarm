import Link from 'next/link';

function formatRupiah(n: number) {
  if (n === undefined || n === null || isNaN(n)) return 'Rp 0';
  return 'Rp ' + n.toLocaleString('id-ID');
}

interface CatalogCardProps {
  animal: any;
  isSelected?: boolean;
  onToggleSelect?: (animal: any) => void;
}

const genderCardBg: Record<string, string> = {
  Jantan: 'bg-gradient-to-br from-[#d1fae5] to-[#a7f3d0]',
  Betina: 'bg-gradient-to-br from-[#fce7f3] to-[#fbcfe8]',
};

export default function CatalogCard({ animal, isSelected = false, onToggleSelect }: CatalogCardProps) {
  const isDipesan = animal.status === 'Terjual' || animal.status === 'Dipesan';
  const isVaccinated = animal.vaksin === 'Vaksin';
  const imageToShow = animal.imageUrl || animal.image_url;
  const pricePerKg = animal.weight > 0 ? (animal.totalPrice / animal.weight) : 0;

  const isClickable = !isDipesan && onToggleSelect;

  return (
    <div 
      onClick={() => { if (isClickable) onToggleSelect(animal); }}
      className={`relative bg-white rounded-2xl overflow-hidden border transition-all duration-200 
        ${isClickable ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''} 
        ${isSelected ? 'border-[#2D6A4F] ring-2 ring-[#2D6A4F] ring-offset-1' : 'border-gray-100 shadow-sm'}
      `}
    >
      <div className={`relative h-[160px] w-full ${genderCardBg[animal.gender] || 'bg-gray-100'}`}>
        
        {/* Kiri Atas: Kotak Centang & Status */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
          {isClickable && (
            <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors shadow-sm
              ${isSelected ? 'bg-[#2D6A4F] border-[#2D6A4F]' : 'bg-white/90 border-gray-300'}
            `}>
              {isSelected && (
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          )}
          
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide shadow-sm
              ${isDipesan ? 'bg-yellow-400 text-yellow-900' : 'bg-[#2D6A4F] text-white'}
          `}>
            {animal.status}
          </span>
        </div>

        <div className="absolute top-3 right-3 z-10">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-sm
              ${animal.gender === 'Jantan' ? 'bg-white text-blue-700 border-blue-100' : 'bg-white text-pink-700 border-pink-100'}
          `}>
            {animal.gender === 'Jantan' ? '♂' : '♀'} {animal.gender?.toUpperCase()}
          </span>
        </div>
        
        {imageToShow && (
          <img src={imageToShow} alt={animal.breed} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-0.5 gap-2">
          <span className="text-[13px] font-bold text-gray-900 truncate">{animal.id}</span>
          <span className="text-[15px] font-bold text-[#2D6A4F] whitespace-nowrap">
            {formatRupiah(animal.totalPrice)}
          </span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-[12.5px] text-gray-500 font-medium">Domba {animal.breed}</span>
          <span className="text-[11px] text-gray-400">
            {animal.weight} kg × {formatRupiah(pricePerKg)}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
            {animal.weight} kg
          </span>
          {isVaccinated && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
              Vaksin
            </span>
          )}
        </div>

        {isDipesan ? (
          <button disabled className="w-full flex justify-center items-center bg-gray-200 text-gray-500 text-[13px] font-medium py-2 rounded-full cursor-not-allowed">
            Sudah Terjual
          </button>
        ) : (
          <Link
            href={`/pesan-ternak?ids=${animal.id}`}
            onClick={(e) => e.stopPropagation()}
            className="w-full flex justify-center items-center bg-[#2D6A4F] text-white text-[13px] font-semibold py-2 px-2 rounded-full hover:bg-[#1B4332] transition-colors duration-150 shadow-sm whitespace-nowrap"
          >
            Pesan Sekarang
          </Link>
        )}
      </div>
    </div>
  );
}