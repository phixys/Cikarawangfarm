import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import RevenueChart from '@/components/dashboard/RevenueChart';
import StockDonut from '@/components/dashboard/StockDonut';
import RecentOrdersTable from '@/components/dashboard/RecentOrdersTable';

export default function DashboardPage() {
  // Get current date string in Bahasa Indonesia
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <DashboardHeader
        title="Dashboard"
        subtitle={`${today} · Selamat pagi, Pak Hendra`}
      />

      {/* Stats Row */}
      <StatsCards />

      {/* Charts Row */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="col-span-3">
          <RevenueChart />
        </div>
        <div className="col-span-2">
          <StockDonut />
        </div>
      </div>

      {/* Recent Orders */}
      <RecentOrdersTable />
    </>
  );
}
