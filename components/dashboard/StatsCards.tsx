import { TrendingUp, ShoppingCart, DollarSign, PiggyBank } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeLabel: string;
  icon: React.ReactNode;
  positive?: boolean;
}

function StatCard({ title, value, change, changeLabel, icon, positive = true }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <p className="text-gray-500 text-[12px] font-medium uppercase tracking-wide">{title}</p>
        <div className="w-9 h-9 rounded-xl bg-primary-tint flex items-center justify-center text-primary-dark">
          {icon}
        </div>
      </div>
      <p className="text-[24px] font-bold text-gray-900 leading-none mb-2">{value}</p>
      <div className="flex items-center gap-1">
        <TrendingUp
          size={13}
          className={positive ? 'text-green-500' : 'text-red-500'}
          strokeWidth={2.5}
        />
        <span className={`text-[12px] font-semibold ${positive ? 'text-green-500' : 'text-red-500'}`}>
          {change}
        </span>
        <span className="text-gray-400 text-[12px]">{changeLabel}</span>
      </div>
    </div>
  );
}

export default function StatsCards() {
  const stats = [
    {
      title: 'Total Ternak',
      value: '247',
      change: '+9%',
      changeLabel: 'dari bulan lalu',
      icon: <ShoppingCart size={18} strokeWidth={2} />,
      positive: true,
    },
    {
      title: 'Pesanan Bulan Ini',
      value: '84',
      change: '+12%',
      changeLabel: 'dari bulan lalu',
      icon: <ShoppingCart size={18} strokeWidth={2} />,
      positive: true,
    },
    {
      title: 'Pendapatan Bulan Ini',
      value: 'Rp 284jt',
      change: '+18.2%',
      changeLabel: 'dari bulan lalu',
      icon: <DollarSign size={18} strokeWidth={2} />,
      positive: true,
    },
    {
      title: 'Laba Bersih',
      value: 'Rp 96jt',
      change: '+11%',
      changeLabel: 'dari bulan lalu',
      icon: <PiggyBank size={18} strokeWidth={2} />,
      positive: true,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
