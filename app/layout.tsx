import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar'; // Pastikan path ini sesuai
import Footer from '@/components/Footer'; // Pastikan path ini sesuai

export const metadata: Metadata = {
  title: 'Cikarawang Farm',
  description: 'Pesan ternak dan aqiqah segar langsung dari farm',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      {/* Tambahkan min-h-screen, flex, flex-col, dan bg-gray-50 di sini */}
      <body className="font-poppins antialiased min-h-screen flex flex-col bg-gray-50">
        
        {/* Navbar otomatis muncul di atas */}
        <Navbar />
        
        {/* flex-1 akan mendorong Footer selalu ke paling bawah layar */}
        <main className="flex-1">
          {children}
        </main>
        
        {/* Footer otomatis muncul di bawah */}
        <Footer />
        
      </body>
    </html>
  );
}