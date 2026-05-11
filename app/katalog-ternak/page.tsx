import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CatalogClient from '@/components/catalog/CatalogClient';

export const metadata = {
  title: 'Katalog Ternak — Cikarawang Farm',
  description: 'Pilih domba berkualitas langsung dari peternakan Cikarawang.',
};

export default function KatalogTernakPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-poppins flex flex-col">
      <Navbar />
      <div className="flex-1">
        <CatalogClient />
      </div>
      <Footer />
    </div>
  );
}
