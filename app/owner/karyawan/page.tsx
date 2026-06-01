'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Users,
  Crown,
  ShieldCheck,
  User,
  Clock,
  CheckCircle2,
  X,
  Loader2,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';

// ── Tipe Data ────────────────────────────────────────────────────────────────
type Role = 'owner' | 'admin' | 'pelanggan';

interface Karyawan {
  id: string;
  full_name: string;
  role: Role;
  terakhir_login: string | null;
}

// ── Helper: Format tanggal login ─────────────────────────────────────────────
function formatLogin(iso: string | null): string {
  if (!iso) return 'Belum pernah login';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
    timeZoneName: 'short',
  }).format(new Date(iso));
}

// ── Komponen Badge Role ──────────────────────────────────────────────────────
function RoleBadge({ role }: { role: Role }) {
  if (role === 'owner') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
        <Crown size={11} /> Owner
      </span>
    );
  }
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
        <ShieldCheck size={11} /> Admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
      <User size={11} /> Pelanggan
    </span>
  );
}

// ── Komponen Custom Dropdown Role ────────────────────────────────────────────
function RoleSelect({ role, disabled, onChange, className = 'w-36' }: { role: Role, disabled: boolean, onChange: (r: Role) => void, className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles: { value: Role; label: string; icon: any; colorClass: string }[] = [
    { value: 'owner', label: 'Owner', icon: Crown, colorClass: 'text-amber-500' },
    { value: 'admin', label: 'Admin', icon: ShieldCheck, colorClass: 'text-blue-500' },
    { value: 'pelanggan', label: 'Pelanggan', icon: User, colorClass: 'text-gray-500' },
  ];

  const current = roles.find(r => r.value === role) || roles[2];
  const CurrentIcon = current.icon;

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-sm font-semibold border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/30 transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300'}`}
      >
        <div className="flex items-center gap-2">
          <CurrentIcon size={14} className={current.colorClass} />
          {current.label}
        </div>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden py-1">
          {roles.map(r => {
            const Icon = r.icon;
            return (
              <button
                key={r.value}
                onClick={() => {
                  onChange(r.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-left hover:bg-gray-50 transition-colors ${role === r.value ? 'bg-gray-50 text-gray-900' : 'text-gray-600'}`}
              >
                <Icon size={14} className={r.colorClass} />
                {r.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  );
}

// ── Halaman Utama ────────────────────────────────────────────────────────────
export default function KelollaKaryawanPage() {
  const [karyawan, setKaryawan] = useState<Karyawan[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null); // ID baris yg sedang diproses

  // — Alert Banner —
  const [alert, setAlert] = useState<{ show: boolean; msg: string; type: 'success' | 'error' }>({
    show: false,
    msg: '',
    type: 'success',
  });

  const showAlert = (msg: string, type: 'success' | 'error' = 'success') => {
    setAlert({ show: true, msg, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 4000);
  };

  // ── Ambil sesi + data karyawan ─────────────────────────────────────────────
  const fetchData = async () => {
    setIsFetching(true);
    try {
      // Siapa yang sedang login?
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setCurrentUserId(session?.user?.id ?? null);

      // Ambil semua profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, terakhir_login')
        .order('full_name', { ascending: true });

      if (error) throw error;
      setKaryawan((data as Karyawan[]) ?? []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat data akun.';
      showAlert(msg, 'error');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Fungsi Ubah Role ───────────────────────────────────────────────────────
  const ubahRole = async (id: string, roleBaru: Role) => {
    // Validasi: Owner tidak bisa mengubah role-nya sendiri
    if (id === currentUserId) {
      showAlert('Anda tidak dapat mengubah role akun Anda sendiri.', 'error');
      return;
    }

    setLoadingId(id);
    try {
      const { error, data } = await supabase
        .from('profiles')
        .update({ role: roleBaru })
        .eq('id', id)
        .select()
        .single();

      if (error || !data) throw new Error('Akses Ditolak: Anda tidak memiliki hak akses (RLS) untuk mengubah profil ini di database.');

      // Update state lokal tanpa fetch ulang
      setKaryawan((prev) =>
        prev.map((k) => (k.id === id ? { ...k, role: roleBaru } : k))
      );

      const nama = karyawan.find((k) => k.id === id)?.full_name ?? 'Pengguna';
      showAlert(`Role ${nama} berhasil diubah menjadi "${roleBaru}".`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengubah role.';
      showAlert(msg, 'error');
    } finally {
      setLoadingId(null);
    }
  };

  // ── Render Loading ─────────────────────────────────────────────────────────
  if (isFetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={40} className="animate-spin text-[#2D6A4F]" />
          <p className="text-sm font-medium text-gray-400">Memuat data akun…</p>
        </div>
      </div>
    );
  }

  // ── Render Utama ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Alert Banner ── */}
      {alert.show && (
        <div
          className={`w-full max-w-2xl mx-auto p-4 rounded-xl shadow-sm border flex items-center justify-between transition-all duration-300 ${
            alert.type === 'success'
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {alert.type === 'success' ? (
              <CheckCircle2 size={18} className="text-green-600 shrink-0" />
            ) : (
              <AlertTriangle size={18} className="text-red-500 shrink-0" />
            )}
            <span
              className={`text-sm font-medium ${
                alert.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {alert.msg}
            </span>
          </div>
          <button
            onClick={() => setAlert({ show: false, msg: '', type: 'success' })}
            className={`p-1 rounded-lg transition-colors ${
              alert.type === 'success'
                ? 'text-green-500 hover:bg-green-100'
                : 'text-red-400 hover:bg-red-100'
            }`}
            aria-label="Tutup notifikasi"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Users size={22} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Kelola Akun</h1>
          </div>
          <p className="text-sm text-gray-500 ml-[52px]">
            Lihat semua akun terdaftar dan atur hak akses (role) mereka.
          </p>
        </div>

        {/* Tombol Refresh */}
        <button
          onClick={fetchData}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* ── Kartu Statistik Cepat ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Total Akun',
            value: karyawan.length,
            color: 'bg-gray-50 border-gray-200 text-gray-700',
            icon: <Users size={16} className="text-gray-400" />,
          },
          {
            label: 'Owner',
            value: karyawan.filter((k) => k.role === 'owner').length,
            color: 'bg-amber-50 border-amber-200 text-amber-700',
            icon: <Crown size={16} className="text-amber-500" />,
          },
          {
            label: 'Admin',
            value: karyawan.filter((k) => k.role === 'admin').length,
            color: 'bg-blue-50 border-blue-200 text-blue-700',
            icon: <ShieldCheck size={16} className="text-blue-500" />,
          },
        ].map(({ label, value, color, icon }) => (
          <div
            key={label}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${color} bg-opacity-60`}
          >
            {icon}
            <div>
              <p className="text-xl font-black leading-none">{value}</p>
              <p className="text-xs font-medium opacity-70 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabel ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tabel Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
            <Users size={16} className="text-blue-600" />
          </div>
          <h2 className="font-bold text-gray-900">Daftar Semua Akun</h2>
          <span className="ml-auto text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {karyawan.length} akun
          </span>
        </div>

        {karyawan.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
            <Users size={40} className="opacity-30" />
            <p className="text-sm font-medium">Belum ada data akun di tabel profiles.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-6 py-4">
                      Nama Akun
                    </th>
                    <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-4">
                      Role Saat Ini
                    </th>
                    <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-4">
                      Login Terakhir
                    </th>
                    <th className="text-right text-xs font-bold text-gray-400 uppercase tracking-wider px-6 py-4">
                      Ubah Role
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {karyawan.map((k) => {
                    const isSelf = k.id === currentUserId;
                    const isProcessing = loadingId === k.id;
                    return (
                      <tr
                        key={k.id}
                        className={`hover:bg-gray-50/70 transition-colors ${isSelf ? 'bg-amber-50/40' : ''}`}
                      >
                        {/* Nama */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0 ${
                                k.role === 'owner'
                                  ? 'bg-amber-500'
                                  : k.role === 'admin'
                                  ? 'bg-blue-500'
                                  : 'bg-gray-400'
                              }`}
                            >
                              {k.full_name?.charAt(0)?.toUpperCase() ?? '?'}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{k.full_name ?? '—'}</p>
                              {isSelf && (
                                <p className="text-[10px] font-semibold text-amber-600 bg-amber-100 inline-block px-1.5 py-0.5 rounded-md mt-0.5">
                                  Akun Anda
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="px-4 py-4">
                          <RoleBadge role={k.role} />
                        </td>

                        {/* Login Terakhir */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock size={12} className="shrink-0 text-gray-400" />
                            <span>{formatLogin(k.terakhir_login)}</span>
                          </div>
                        </td>

                        {/* Dropdown Ubah Role */}
                        <td className="px-6 py-4 text-right">
                          {isSelf ? (
                            <span className="text-xs text-gray-400 italic">Tidak dapat diubah</span>
                          ) : (
                            <div className="inline-flex items-center gap-2">
                              {isProcessing && (
                                <Loader2 size={14} className="animate-spin text-gray-400" />
                              )}
                              <RoleSelect 
                                role={k.role} 
                                disabled={isProcessing} 
                                onChange={(newRole) => ubahRole(k.id, newRole)} 
                              />
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden divide-y divide-gray-50">
              {karyawan.map((k) => {
                const isSelf = k.id === currentUserId;
                const isProcessing = loadingId === k.id;
                return (
                  <div key={k.id} className={`p-5 ${isSelf ? 'bg-amber-50/40' : ''}`}>
                    {/* Header baris */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0 ${
                          k.role === 'owner'
                            ? 'bg-amber-500'
                            : k.role === 'admin'
                            ? 'bg-blue-500'
                            : 'bg-gray-400'
                        }`}
                      >
                        {k.full_name?.charAt(0)?.toUpperCase() ?? '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-gray-900 text-sm truncate">{k.full_name ?? '—'}</p>
                          {isSelf && (
                            <span className="text-[10px] font-semibold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-md shrink-0">
                              Akun Anda
                            </span>
                          )}
                        </div>
                        <RoleBadge role={k.role} />
                      </div>
                    </div>

                    {/* Login terakhir */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                      <Clock size={12} />
                      <span>{formatLogin(k.terakhir_login)}</span>
                    </div>

                    {/* Dropdown */}
                    {!isSelf && (
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-gray-500">Ubah Role:</label>
                        {isProcessing && (
                          <Loader2 size={13} className="animate-spin text-gray-400" />
                        )}
                        <div className="flex-1">
                          <RoleSelect 
                            role={k.role} 
                            disabled={isProcessing} 
                            onChange={(newRole) => ubahRole(k.id, newRole)} 
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
