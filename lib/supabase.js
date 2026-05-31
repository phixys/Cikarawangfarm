// lib/supabase.js
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Menggunakan createBrowserClient agar PKCE code verifier 
// dan sesi disimpan di dalam Cookie browser secara otomatis,
// sehingga server (Route Handler & Middleware) bisa membacanya!
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)