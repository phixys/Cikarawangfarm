type OrderStatus = 'Proses' | 'Selesai' | 'Konfirmasi DP' | 'Dibatalkan';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusStyles: Record<OrderStatus, string> = {
  'Proses':        'bg-yellow-100 text-yellow-700',
  'Selesai':       'bg-green-100 text-green-700',
  'Konfirmasi DP': 'bg-blue-100 text-blue-700',
  'Dibatalkan':    'bg-red-100 text-red-600',
};

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap
        ${statusStyles[status]}
      `}
    >
      {status}
    </span>
  );
}
