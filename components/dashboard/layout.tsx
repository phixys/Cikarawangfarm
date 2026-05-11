import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 font-poppins">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-[1100px] mx-auto px-7 py-7">
          {children}
        </div>
      </main>
    </div>
  );
}
