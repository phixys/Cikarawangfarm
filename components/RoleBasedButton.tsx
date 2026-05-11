'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type Role = 'pelanggan' | 'admin' | 'owner' | null;

export default function RoleBasedButton({ productId }: { productId: string }) {
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const loadRole = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setRole(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!error && data) {
        setRole(data.role as Role);
      }
      setLoading(false);
    };

    loadRole();
  }, [supabase]);

  if (loading) {
    return <p>Memuat hak akses...</p>;
  }

  if (role === 'admin') {
    return (
      <button className="rounded-xl bg-[#2D6A4F] px-4 py-2 text-white hover:bg-[#1B4332] transition-colors">
        Edit Stok
      </button>
    );
  }

  return (
    <p className="text-sm text-gray-600">
      Hanya admin yang dapat mengubah stok produk.
    </p>
  );
}
