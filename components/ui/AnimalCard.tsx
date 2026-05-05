import Link from 'next/link';
import Image from 'next/image';
import Badge from '@/components/ui/Badge';

interface AnimalCardProps {
  id: string;
  name: string;
  weight: string;
  price: string;
  isVaccinated?: boolean;
  imageSrc?: string;
  slug: string;
}

export default function AnimalCard({
  id,
  name,
  weight,
  price,
  isVaccinated = true,
  imageSrc,
  slug,
}: AnimalCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      {/* Image / placeholder */}
      <div className="relative h-[150px] w-full bg-gradient-to-br from-primary-medium to-primary-light">
        {imageSrc ? (
          <Image src={imageSrc} alt={name} fill className="object-cover" />
        ) : null}
        <span className="absolute top-2 left-3 text-white/90 text-[11px] font-medium">
          {id}
        </span>
      </div>

      {/* Body */}
      <div className="p-3.5">
        <h3 className="text-gray-900 font-semibold text-[14px] mb-2 leading-snug">
          {name}
        </h3>

        {/* Weight row */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-gray-500 text-[13px]">{weight}</span>
          {isVaccinated && <Badge variant="vaksin" />}
        </div>

        {/* Price */}
        <p className="text-primary-dark font-bold text-[15px] mb-3">{price}</p>

        {/* Detail button */}
        <Link
          href={`/katalog-ternak/${slug}`}
          className="block w-full text-center text-[13px] font-medium text-primary-dark bg-primary-tint rounded-full py-2 hover:bg-primary-tint2 transition-colors duration-150"
        >
          Detail
        </Link>
      </div>
    </div>
  );
}
