import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const cookieStore = cookies();
    
    // Inisialisasi menggunakan createServerClient (karena auth-helpers v0.15.0 adalah kedok dari @supabase/ssr)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch (error) {
              // Abaikan error pengaturan cookie di konteks tertentu
            }
          },
        },
      }
    );

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      return NextResponse.redirect(new URL(`/masuk?error=${encodeURIComponent(exchangeError.message)}`, request.url));
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.redirect(new URL(`/masuk?error=${encodeURIComponent(userError?.message || 'No user')}`, request.url));
    }

    // Cek profile untuk mendapatkan role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Catat waktu login
    await supabase
      .from('profiles')
      .update({ terakhir_login: new Date().toISOString() })
      .eq('id', user.id);

    const role = profile?.role ?? 'pelanggan';

    if (role === 'owner') {
      return NextResponse.redirect(new URL('/owner', request.url));
    } else if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin/pesanan', request.url));
    } else {
      return NextResponse.redirect(new URL('/', request.url));
    }

  } catch (err: any) {
    console.error('CRITICAL CALLBACK ERROR:', err);
    const errorMsg = err?.message || String(err);
    return NextResponse.redirect(new URL(`/masuk?error=${encodeURIComponent(errorMsg)}`, request.url));
  }
}
