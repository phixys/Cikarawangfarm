import Link from 'next/link';
import { Pencil, Eye, Trash2 } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';

type OrderStatus = 'Proses' | 'Selesai' | 'Konfirmasi DP' | 'Dibatalkan';

interface Order {
  noPesanan: string;
  namaKonsumen: string;
  paket: string;
  totalHarga: string;
  tglAqiqah: string;
  status: OrderStatus;
}

const orders: Order[] = [
  {
    noPesanan: '#ORD-001882',
    namaKonsumen: 'Ibu Sari Dewi',
    paket: 'Paket Premium',
    totalHarga: 'Rp 4.050.000',
    tglAqiqah: '30 Des 2026',
    status: 'Proses',
  },
  {
    noPesanan: '#ORD-001881',
    namaKonsumen: 'Bapak Ahmad Fauzi',
    paket: 'Paket Barokah',
    totalHarga: 'Rp 2.750.000',
    tglAqiqah: '15 Des 2026',
    status: 'Selesai',
  },
  {
    noPesanan: '#ORD-001880',
    namaKonsumen: 'Ibu Dewi Rahayu',
    paket: 'Paket Eksklusif',
    totalHarga: 'Rp 5.450.000',
    tglAqiqah: '18 Des 2026',
    status: 'Konfirmasi DP',
  },
  {
    noPesanan: '#ORD-001879',
    namaKonsumen: 'Bapak Rizky Pratama',
    paket: 'Paket Barokah',
    totalHarga: 'Rp 2.800.000',
    tglAqiqah: '10 Des 2026',
    status: 'Dibatalkan',
  },
];

export default function RecentOrdersTable() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Table header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-[14px] font-semibold text-gray-900">Pesanan Terbaru</h3>
        <Link
          href="/dashboard/pesanan"
          className="text-[12px] font-medium text-primary-dark border border-primary-dark rounded-full px-3.5 py-1.5 hover:bg-primary-tint transition-colors duration-150"
        >
          Lihat Semua →
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['NO. PESANAN', 'NAMA KONSUMEN', 'PAKET', 'TOTAL HARGA', 'TGL. AQIQAH', 'STATUS', 'AKSI'].map(
                (col) => (
                  <th
                    key={col}
                    className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-5 py-3"
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr
                key={order.noPesanan}
                className={`border-b border-gray-50 hover:bg-gray-50/60 transition-colors duration-100 ${
                  i === orders.length - 1 ? 'border-0' : ''
                }`}
              >
                <td className="px-5 py-3.5">
                  <span className="text-[13px] font-semibold text-primary-dark">
                    {order.noPesanan}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-[13px] text-gray-800">{order.namaKonsumen}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-[13px] text-gray-600">{order.paket}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-[13px] font-semibold text-gray-800">{order.totalHarga}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-[13px] text-gray-500">{order.tglAqiqah}</span>
                </td>
                <td className="px-5 py-3.5">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5">
                    {/* Edit */}
                    <button className="w-7 h-7 rounded-lg bg-primary-tint text-primary-dark flex items-center justify-center hover:bg-primary-tint2 transition-colors duration-150">
                      <Pencil size={13} strokeWidth={2.5} />
                    </button>
                    {/* View */}
                    <button className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors duration-150">
                      <Eye size={13} strokeWidth={2.5} />
                    </button>
                    {/* Delete */}
                    <button className="w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors duration-150">
                      <Trash2 size={13} strokeWidth={2.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
