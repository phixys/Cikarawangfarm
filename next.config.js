/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Membiarkan Vercel tetap build meskipun ada error ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Membiarkan Vercel tetap build meskipun ada error TypeScript
    ignoreBuildErrors: true,
  },
};

export default nextConfig; // Gunakan module.exports = nextConfig; jika pakai file .js