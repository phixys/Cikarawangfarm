import { Download } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export default function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-[22px] font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="text-gray-400 text-[13px] mt-0.5">{subtitle}</p>
        )}
      </div>
      <button className="flex items-center gap-2 bg-primary-dark text-white text-[13px] font-semibold px-4 py-2.5 rounded-full hover:bg-primary-medium transition-colors duration-150">
        <Download size={15} strokeWidth={2.5} />
        Unduh Laporan
      </button>
    </div>
  );
}
