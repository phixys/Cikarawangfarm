import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import HeroSection from '@/components/sections/HeroSection';
import CaraPemesananSection from '@/components/sections/CaraPemesananSection';
import KatalogTernakSection from '@/components/sections/KatalogTernakSection';
import PaketAqiqahSection from '@/components/sections/PaketAqiqahSection';

export default async function BerandaPage() {
  // Cek session di server menggunakan createServerClient (seperti di middleware)
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll: () => cookieStore.getAll().map((cookie) => ({ name: cookie.name, value: cookie.value })),
        setAll: () => {}, // Read-only in Server Components
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role === 'owner') {
      redirect('/owner');
    } else if (profile?.role === 'admin') {
      redirect('/admin/pesanan');
    }
    // Role pelanggan atau null → lanjut render beranda publik
  }

  return (
    <>
      <HeroSection />
      <CaraPemesananSection />
      <KatalogTernakSection />
      <PaketAqiqahSection />
    </>
  );
}