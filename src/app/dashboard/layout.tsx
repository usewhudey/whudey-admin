// dashboard/layout.tsx
'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardTopBar } from '@/components/dashboard/DashboardTopBar';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';
import { useAuthInterceptor } from '@/lib/authInterceptor';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarOpen } = useUIStore();

  useAuthInterceptor();
  const offsetClass = isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20';

  return (
    <ProtectedRoute requireEmailVerified>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <div className={cn('transition-all duration-300', offsetClass)}>
          {/* Top Bar */}
          <DashboardTopBar />

          {/* Page Content */}

          <main className="p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
