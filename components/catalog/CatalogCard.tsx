import { Animal } from '@/lib/animalData';

function formatRupiah(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

interface CatalogCardProps {
  animal: Animal;
}

const genderCardBg: Record<string, string> = {
  Jantan: 'bg-gradient-to-br from-[#d1fae5] to-[#a7f3d0]',
  Betina: 'bg-gradient-to-br from-[#fce7f3] to-[#fbcfe8]',
};

export default function CatalogCard({ animal }: CatalogCardProps) {
  const isDipesan = animal.status === 'Dipesan';

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">

      {/* Image area */}
      <div className={`relative h-[160px] w-full ${genderCardBg[animal.gender]}`}>
        {/* Top-left: status badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`
              text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide
              ${isDipesan
                ? 'bg-yellow-400 text-yellow-900'
                : 'bg-primary-dark text-white'}
            `}
          >
            {animal.status}
          </span>
        </div>
        {/* Top-right: gender badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`
              text-[11px] font-semibold px-2.5 py-1 rounded-full border
              ${animal.gender === 'Jantan'
                ? 'bg-white/80 text-blue-700 border-blue-200'
                : 'bg-white/80 text-pink-700 border-pink-200'}
            `}
          >
            {animal.gender === 'Jantan' ? '♂' : '♀'} {animal.gender.toUpperCase()}
          </span>
        </div>
        {/* Placeholder image — replace with <Image> when real assets exist */}
        {animal.imageSrc && (
          <img
            src={animal.imageSrc}
            alt={animal.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {/* ID + Price row */}
        <div className="flex items-start justify-between mb-0.5">
          <span className="text-[13px] font-bold text-gray-900">{animal.id}</span>
          <span className="text-[15px] font-bold text-primary-dark">
            {formatRupiah(animal.totalPrice)}
          </span>
        </div>

        {/* Name + price per kg */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12.5px] text-gray-500">{animal.name}</span>
          <span className="text-[11px] text-gray-400">
            {animal.weight} kg × {formatRupiah(animal.pricePerKg)}
          </span>
        </div>

        {/* Badges row */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
            {animal.weight} kg
          </span>
          {animal.isVaccinated && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
              Vaksin
            </span>
          )}
        </div>

        {/* CTA Button */}
        {isDipesan ? (
          <button
            disabled
            className="w-full bg-gray-200 text-gray-400 text-[13px] font-medium py-2.5 rounded-full cursor-not-allowed"
          >
            Sedang Dipesan
          </button>
        ) : (
          <button className="w-full bg-primary-dark text-white text-[13px] font-semibold py-2.5 rounded-full hover:bg-primary-medium transition-colors duration-150">
            Pesan Sekarang
          </button>
        )}
      </div>
    </div>
  );
}
