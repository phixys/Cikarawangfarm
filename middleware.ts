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
        getAll: () => {
          return req.cookies.getAll().map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          }));
        },
        setAll: (cookies) => {
          cookies.forEach((cookie) => {
            res.cookies.set(cookie.name, cookie.value, cookie.options ?? {});
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // Route protection for authenticated sections
  const isAdminArea = pathname.startsWith('/admin/stock');
  const isOwnerFinance = pathname.startsWith('/owner/finance');
  const isDashboardArea = pathname.startsWith('/dashboard');

  if (!session) {
    if (isAdminArea || isOwnerFinance || isDashboardArea) {
      return NextResponse.redirect(new URL('/masuk', req.url));
    }
    return res;
  }

  const userId = session.user.id;
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  const role = profile?.role;

  if (profileError || !role) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  if (isAdminArea && role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  if (isOwnerFinance && role !== 'owner') {
    if (role === 'pelanggan') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/owner/:path*', '/dashboard/:path*'],
};