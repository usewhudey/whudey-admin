// src/components/dashboard/DashboardSidebar.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/store/useUIStore';
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Settings,
  CreditCard,
  X,
  Menu,
  Activity,
  SmilePlus,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import Image from 'next/image';

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar, toggleSidebar } = useUIStore();

  const mobileWidth = 'w-64';
  const desktopWidth = isSidebarOpen ? 'lg:w-64' : 'lg:w-20';

  const LOGO_WIDTH = 140;
  const LOGO_HEIGHT = 48;

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-200 transition-all duration-300',
          mobileWidth,
          desktopWidth,
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        <div
          className={cn(
            'flex items-center justify-between p-6 border-b',
            !isSidebarOpen && 'lg:justify-center lg:px-4'
          )}
        >
          <Link href="/dashboard">
            <Image
              src="/whudey.png"
              alt="Whudey Logo"
              width={LOGO_WIDTH}
              height={LOGO_HEIGHT}
              priority
              className={cn(
                'block transition-opacity duration-300',
                !isSidebarOpen && 'opacity-0 pointer-events-none lg:hidden',
                isSidebarOpen && 'opacity-100'
              )}
            />
          </Link>

          <button
            onClick={closeSidebar}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>

          <button
            onClick={toggleSidebar}
            className={cn(
              'hidden lg:block text-gray-500 hover:text-gray-700 cursor-pointer p-1',
              !isSidebarOpen ? 'mx-auto' : 'mr-0'
            )}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {/* Dashboard */}
          <Link
            href="/dashboard"
            onClick={() => {
              if (window.innerWidth < 1024) {
                closeSidebar();
              }
            }}
            className={cn(
              'flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-left',
              pathname === '/dashboard'
                ? 'bg-purple-900 text-white'
                : 'text-gray-700 hover:bg-gray-100',
              !isSidebarOpen && 'lg:justify-center'
            )}
          >
            <LayoutDashboard size={20} />
            <span
              className={cn(
                'font-medium whitespace-nowrap grow transition-opacity duration-200',
                !isSidebarOpen && 'lg:hidden'
              )}
            >
              Dashboard
            </span>
          </Link>

          {/* Sellers */}
          <Link
            href="/dashboard/sellers"
            onClick={() => {
              if (window.innerWidth < 1024) {
                closeSidebar();
              }
            }}
            className={cn(
              'flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-left',
              pathname?.startsWith('/dashboard/sellers')
                ? 'bg-purple-900 text-white'
                : 'text-gray-700 hover:bg-gray-100',
              !isSidebarOpen && 'lg:justify-center'
            )}
          >
            <Package size={20} />
            <span
              className={cn(
                'font-medium whitespace-nowrap grow transition-opacity duration-200',
                !isSidebarOpen && 'lg:hidden'
              )}
            >
              Sellers
            </span>
          </Link>

          {/* Subscriptions */}
          <Link
            href="/dashboard/subscriptions"
            onClick={() => {
              if (window.innerWidth < 1024) {
                closeSidebar();
              }
            }}
            className={cn(
              'flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-left',
              pathname?.startsWith('/dashboard/subscriptions')
                ? 'bg-purple-900 text-white'
                : 'text-gray-700 hover:bg-gray-100',
              !isSidebarOpen && 'lg:justify-center'
            )}
          >
            <CreditCard size={20} />
            <span
              className={cn(
                'font-medium whitespace-nowrap grow transition-opacity duration-200',
                !isSidebarOpen && 'lg:hidden'
              )}
            >
              Subscriptions
            </span>
          </Link>

          {/* Analytics */}
          <Link
            href="/dashboard/analytics"
            onClick={() => {
              if (window.innerWidth < 1024) {
                closeSidebar();
              }
            }}
            className={cn(
              'flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-left',
              pathname?.startsWith('/dashboard/analytics')
                ? 'bg-purple-900 text-white'
                : 'text-gray-700 hover:bg-gray-100',
              !isSidebarOpen && 'lg:justify-center'
            )}
          >
            <BarChart3 size={20} />
            <span
              className={cn(
                'font-medium whitespace-nowrap grow transition-opacity duration-200',
                !isSidebarOpen && 'lg:hidden'
              )}
            >
              Analytics
            </span>
          </Link>

          {/* Reports */}
          <Link
            href="/dashboard/reports"
            onClick={() => {
              if (window.innerWidth < 1024) {
                closeSidebar();
              }
            }}
            className={cn(
              'flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-left',
              pathname?.startsWith('/dashboard/reports')
                ? 'bg-purple-900 text-white'
                : 'text-gray-700 hover:bg-gray-100',
              !isSidebarOpen && 'lg:justify-center'
            )}
          >
            <Activity size={20} />
            <span
              className={cn(
                'font-medium whitespace-nowrap grow transition-opacity duration-200',
                !isSidebarOpen && 'lg:hidden'
              )}
            >
              Reports
            </span>
          </Link>

          {/* Admins */}
          <Link
            href="/dashboard/admins"
            onClick={() => {
              if (window.innerWidth < 1024) {
                closeSidebar();
              }
            }}
            className={cn(
              'flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-left',
              pathname?.startsWith('/dashboard/admins')
                ? 'bg-purple-900 text-white'
                : 'text-gray-700 hover:bg-gray-100',
              !isSidebarOpen && 'lg:justify-center'
            )}
          >
            <Settings size={20} />
            <span
              className={cn(
                'font-medium whitespace-nowrap grow transition-opacity duration-200',
                !isSidebarOpen && 'lg:hidden'
              )}
            >
              Admins
            </span>
          </Link>

          {/* Issues */}
          <Link
            href="/dashboard/issues"
            onClick={() => {
              if (window.innerWidth < 1024) {
                closeSidebar();
              }
            }}
            className={cn(
              'flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-left',
              pathname?.startsWith('/dashboard/issues')
                ? 'bg-purple-900 text-white'
                : 'text-gray-700 hover:bg-gray-100',
              !isSidebarOpen && 'lg:justify-center'
            )}
          >
            <SmilePlus size={20} />
            <span
              className={cn(
                'font-medium whitespace-nowrap grow transition-opacity duration-200',
                !isSidebarOpen && 'lg:hidden'
              )}
            >
              Issues
            </span>
          </Link>
        </nav>
      </aside>
    </>
  );
}
