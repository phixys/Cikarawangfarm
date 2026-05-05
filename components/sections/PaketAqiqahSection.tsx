import Link from 'next/link';
import AqiqahCard from '@/components/ui/AqiqahCard';

const packages = [
  {
    name: 'Paket Aqiqah Barokah',
    price: 'Rp 2.500.000',
    badge: 'tersedia' as const,
    isFeatured: false,
    features: [
      '40–50 porsi nasi',
      'Berat domba 25–30 kg',
      'Bisa diantar (Sekitar Bogor)',
    ],
    slug: 'barokah',
  },
  {
    name: 'Paket Aqiqah Premium',
    price: 'Rp 3.800.000',
    badge: 'terpopuler' as const,
    isFeatured: true,
    features: [
      '60–70 porsi nasi',
      'Berat domba 35–40 kg',
      'Bisa diantar (Sekitar Bogor)',
    ],
    slug: 'premium',
  },
  {
    name: 'Paket Aqiqah Eksklusif',
    price: 'Rp 5.200.000',
    badge: 'baru' as const,
    isFeatured: false,
    features: [
      '90–100 porsi nasi',
      'Berat domba 45–50 kg',
      'Bisa diantar (Sekitar Bogor)',
    ],
    slug: 'eksklusif',
  },
];

export default function PaketAqiqahSection() {
  return (
    <section className="bg-white py-14 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Header row */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-[1.6rem] font-bold text-gray-900">
              Paket <span className="text-primary-medium">Aqiqah</span>
            </h2>
            <p className="text-gray-500 text-[13.5px] mt-1">
              Pilih paket yang sesuai dengan kebutuhan Anda
            </p>
          </div>
          <Link
            href="/paket-aqiqah"
            className="text-[13px] font-medium text-primary-dark border border-primary-dark rounded-full px-4 py-1.5 hover:bg-primary-tint transition-colors duration-150 whitespace-nowrap self-start mt-1"
          >
            Lihat Semua →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {packages.map((pkg) => (
            <AqiqahCard key={pkg.slug} {...pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}
