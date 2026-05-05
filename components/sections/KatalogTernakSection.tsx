import Link from 'next/link';
import AnimalCard from '@/components/ui/AnimalCard';

const animals = [
  {
    id: '#DM-2024-001',
    name: 'Domba Merino Jantan',
    weight: '28 kg',
    price: 'Rp 2.800.000',
    slug: 'domba-merino-jantan-001',
  },
  {
    id: '#DG-2024-012',
    name: 'Domba Garut Betina',
    weight: '22 kg',
    price: 'Rp 2.200.000',
    slug: 'domba-garut-betina-012',
  },
  {
    id: '#DE-2024-007',
    name: 'Domba Dorper Jantan',
    weight: '35 kg',
    price: 'Rp 3.500.000',
    slug: 'domba-dorper-jantan-007',
  },
  {
    id: '#DM-2024-019',
    name: 'Domba Batur Jantan',
    weight: '26 kg',
    price: 'Rp 2.600.000',
    slug: 'domba-batur-jantan-019',
  },
];

export default function KatalogTernakSection() {
  return (
    <section className="bg-primary-tint py-14 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Header row */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-[1.6rem] font-bold text-gray-900">
              Katalog <span className="text-primary-medium">Ternak</span>
            </h2>
            <p className="text-gray-500 text-[13.5px] mt-1">
              Ternak segar langsung dari kandang kami
            </p>
          </div>
          <Link
            href="/katalog-ternak"
            className="text-[13px] font-medium text-primary-dark border border-primary-dark rounded-full px-4 py-1.5 hover:bg-primary-tint2 transition-colors duration-150 whitespace-nowrap self-start mt-1"
          >
            Lihat Semua →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {animals.map((animal) => (
            <AnimalCard key={animal.id} {...animal} />
          ))}
        </div>
      </div>
    </section>
  );
}
