import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cikarawang Farm',
  description: 'Pesan ternak dan aqiqah segar langsung dari farm',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="font-poppins antialiased">{children}</body>
    </html>
  );
}
