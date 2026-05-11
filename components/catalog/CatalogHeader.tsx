import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function CatalogHeader() {
  return (
    <div className="bg-primary-dark px-6 py-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12px] text-white/60 mb-3">
          <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
          <ChevronRight size={13} />
          <span className="text-white font-medium">Katalog Ternak</span>
        </div>
        {/* Title */}
        <h1 className="text-white text-[28px] font-bold mb-2">Katalog Ternak Domba</h1>
        <p className="text-white/70 text-[14px]">
          Pilih domba berkualitas langsung dari peternakan Cikarawang. Semua ternak terawat, divaksin, dan siap pesan.
        </p>
      </div>
    </div>
  );
}
