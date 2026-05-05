import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import CaraPemesananSection from '@/components/sections/CaraPemesananSection';
import KatalogTernakSection from '@/components/sections/KatalogTernakSection';
import PaketAqiqahSection from '@/components/sections/PaketAqiqahSection';
import Footer from '@/components/Footer';

export default function BerandaPage() {
  return (
    <main className="min-h-screen font-poppins">
      <Navbar />
      <HeroSection />
      <CaraPemesananSection />
      <KatalogTernakSection />
      <PaketAqiqahSection />
      <Footer />
    </main>
  );
}
