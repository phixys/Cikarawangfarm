import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const cookieStore = cookies();
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
              // Abaikan
            }
          },
        },
      }
    );

    // 1. Eksekusi Login di Server
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 401 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Gagal mendapatkan data user' }, { status: 400 });
    }

    // 2. Ambil Role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    // 3. Catat waktu login
    await supabase
      .from('profiles')
      .update({ terakhir_login: new Date().toISOString() })
      .eq('id', authData.user.id);

    // Kembalikan role ke client untuk eksekusi redirect
    return NextResponse.json({ role: profile?.role || 'pelanggan' });

  } catch (err: any) {
    console.error('Error in /auth/login:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan di server' }, { status: 500 });
  }
}