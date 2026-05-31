import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll: () =>
          req.cookies.getAll().map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          })),
        setAll: (cookies) => {
          cookies.forEach((cookie) => {
            res.cookies.set(cookie.name, cookie.value, cookie.options ?? {});
          });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const pathname = req.nextUrl.pathname;

  const isAdminRoute = pathname.startsWith('/admin');
  const isOwnerRoute = pathname.startsWith('/owner');

  // Belum login — blokir semua rute panel
  if (!session) {
    if (isAdminRoute || isOwnerRoute) {
      return NextResponse.redirect(new URL('/masuk', req.url));
    }
    return res;
  }

  // Sudah login — ambil role dari profil_karyawan (sumber kebenaran)
  const { data: karyawan } = await supabase
    .from('profil_karyawan')
    .select('role')
    .eq('id', session.user.id)
    .single();

  const role = karyawan?.role ?? null;

  // Proteksi rute /admin — hanya untuk role 'admin' dan 'owner'
  if (isAdminRoute && role !== 'admin' && role !== 'owner') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // Proteksi rute /owner — hanya untuk role 'owner'
  if (isOwnerRoute && role !== 'owner') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/owner/:path*'],
};