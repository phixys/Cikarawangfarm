/**
 * lib/siteUrl.ts
 *
 * Mengembalikan absolute base URL aplikasi secara dinamis.
 * Prioritas:
 *   1. NEXT_PUBLIC_SITE_URL  → Set ini di Vercel Dashboard untuk production
 *   2. NEXT_PUBLIC_VERCEL_URL → Otomatis tersedia di semua deployment Vercel (preview & production)
 *   3. http://localhost:3000  → Fallback untuk development lokal
 *
 * Cara pakai:
 *   import { getSiteUrl } from '@/lib/siteUrl';
 *   const url = `${getSiteUrl()}/masuk`;
 */
export function getSiteUrl(): string {
  // 1. URL produksi yang kamu set sendiri (paling diprioritaskan)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, ''); // hapus trailing slash
  }

  // 2. URL Vercel otomatis (tersedia di semua deployment Vercel)
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  // 3. Fallback lokal
  return 'http://localhost:3000';
}
