import Link from 'next/link';
import Image from 'next/image';
import Badge from '@/components/ui/Badge';

type AqiqahBadge = 'tersedia' | 'terpopuler' | 'baru';

interface AqiqahCardProps {
  name: string;
  price: string;
  features: string[];
  badge: AqiqahBadge;
  isFeatured?: boolean;
  imageSrc?: string;
  slug: string;
}

const cardBgMap: Record<AqiqahBadge, string> = {
  tersedia:   'bg-gradient-to-br from-[#40916C] to-[#2D6A4F]',
  terpopuler: 'bg-gradient-to-br from-[#1B4332] to-[#144125]',
  baru:       'bg-gradient-to-br from-[#74C69D] to-[#4C9A78]',
};

export default function AqiqahCard({
  name,
  price,
  features,
  badge,
  isFeatured = false,
  imageSrc,
  slug,
}: AqiqahCardProps) {
  return (
    <div
      className={`
        rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-primary-medium transition-all duration-200
      `}
    >
      {/* Card image header */}
      <div className={`relative h-[160px] w-full ${cardBgMap[badge]}`}>
        {imageSrc ? (
          <Image src={imageSrc} alt={name} fill className="object-cover" />
        ) : null}
        {/* Badge top-right */}
        <div className="absolute top-3 right-3">
          <Badge variant={badge} />
        </div>
      </div>

      {/* Body */}
      <div className="bg-white p-4">
        <h3 className="text-gray-900 font-semibold text-[15px] mb-1">{name}</h3>
        <p
          className={`font-bold text-[1.3rem] mb-3 ${
            isFeatured ? 'text-primary-medium' : 'text-primary-dark'
          }`}
        >
          {price}
        </p>

        <ul className="list-disc list-inside space-y-1 mb-4">
          {features.map((f) => (
            <li key={f} className="text-gray-600 text-[13px]">
              {f}
            </li>
          ))}
        </ul>

        <Link
          href={`/paket-aqiqah/${slug}`}
          className="block w-full text-center text-[13.5px] font-semibold text-white bg-primary-dark rounded-full py-2.5 hover:bg-primary-medium transition-colors duration-150"
        >
          Pesan Sekarang
        </Link>
      </div>
    </div>
  );
}
