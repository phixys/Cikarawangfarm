import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative w-full h-[480px] flex items-center justify-center overflow-hidden">
      {/* Background image — replace /hero-bg.jpg with your real asset */}
      <div className="absolute inset-0 bg-gray-700">
        <Image
          src="/Header.png"
          alt="Cikarawang Farm background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Logo */}
        

        <h1 className="text-white text-[2.6rem] font-bold leading-tight tracking-tight drop-shadow-md">
          Cikarawang Farm
        </h1>
        <p className="text-white/85 text-[15px] font-normal mt-2 mb-7">
          Pesan ternak dan aqiqah segar langsung dari farm
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/katalog-ternak"
            className="text-[14px] font-semibold text-white border border-white/70 bg-white/10 rounded-full px-6 py-2.5 hover:bg-white/20 transition-colors duration-150"
          >
            Lihat Katalog Ternak
          </Link>
          <Link
            href="/paket-aqiqah"
            className="text-[14px] font-semibold text-primary-dark bg-white rounded-full px-6 py-2.5 hover:bg-primary-tint transition-colors duration-150"
          >
            Pesan Paket Aqiqah
          </Link>
        </div>
      </div>
    </section>
  );
}
