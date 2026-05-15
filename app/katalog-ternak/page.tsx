import CatalogClient from '@/components/catalog/CatalogClient';

export const metadata = {
  title: 'Katalog Ternak — Cikarawang Farm',
  description: 'Pilih domba berkualitas langsung dari peternakan Cikarawang.',
};

export default function KatalogTernakPage() {
  return (
    // Navbar dan Footer sudah otomatis ada dari layout.tsx
    // div wrapper juga tidak perlu lagi karena sudah ada di body layout
    <CatalogClient />
  );
}