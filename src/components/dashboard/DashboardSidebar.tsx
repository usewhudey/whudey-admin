// src/components/dashboard/DashboardSidebar.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/store/useUIStore';
import { useState, type ComponentType } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Paintbrush,
  Settings,
  CreditCard,
  X,
  Menu,
  ChevronDown,
  Activity,
  SmilePlus,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import Image from 'next/image';

const menuItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    subItems: null,
  },
  {
    label: 'Sellers',
    icon: Package,
    href: '/dashboard/sellers',
    subItems: null,
  },
  {
    label: 'Subscriptions',
    icon: CreditCard,
    href: '/dashboard/subscriptions',
    subItems: null,
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    href: '/dashboard/analytics',
    subItems: null,
  },

  // {
  //   label: 'Store Settings',
  //   icon: Paintbrush,
  //   href: '/dashboard/store-settings',
  //   subItems: [
  //     {
  //       label: 'Store Settings',
  //       href: '/dashboard/store-settings/store',
  //     },
  //     {
  //       label: 'Product Categories',
  //       href: '/dashboard/store-settings/category',
  //     },
  //   ],
  // },
  {
    label: 'Reports',
    icon: Activity,
    href: '/dashboard/reports',
    subItems: null,
  },
  {
    label: 'Admins',
    icon: Settings,
    href: '/dashboard/admins',
    subItems: null,
  },
  {
    label: 'Profile Settings',
    icon: Settings,
    href: '/dashboard/settings',
    subItems: null,
  },

  {
    label: 'Support',
    icon: SmilePlus,
    href: '/dashboard/support',
    subItems: null,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar, toggleSidebar } = useUIStore();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const mobileWidth = 'w-64';
  const desktopWidth = isSidebarOpen ? 'lg:w-64' : 'lg:w-20';

  const handleToggleSubmenu = (label: string) => {
    setOpenSubmenu(current => (current === label ? null : label));
  };

  type SubItem = { label: string; href: string };
  type MenuItem = {
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: ComponentType<any>;
    href: string;
    subItems?: SubItem[] | null;
  };

  interface NavItemProps {
    item: MenuItem;
    isActive: boolean;
    isSubmenuOpen: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Icon: ComponentType<any>;
  }

  const NavItem = ({ item, isActive, isSubmenuOpen, Icon }: NavItemProps) => {
    const hasSubItems = !!(item.subItems && item.subItems.length > 0);

    if (!hasSubItems) {
      return (
        <Link
          href={item.href}
          onClick={() => {
            if (window.innerWidth < 1024) {
              closeSidebar();
            }
          }}
          className={cn(
            'flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-left',
            isActive
              ? 'bg-purple-900 text-white'
              : 'text-gray-700 hover:bg-gray-100',
            !isSidebarOpen && 'lg:justify-center'
          )}
        >
          <Icon size={20} />
          <span
            className={cn(
              'font-medium whitespace-nowrap grow transition-opacity duration-200',
              !isSidebarOpen && 'lg:hidden'
            )}
          >
            {item.label}
          </span>
        </Link>
      );
    }

    // Render accordion trigger (has sub-menu)
    return (
      <>
        <button
          onClick={() => handleToggleSubmenu(item.label)}
          className={cn(
            'flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-left',
            isActive
              ? 'bg-purple-900 text-white'
              : 'text-gray-700 hover:bg-gray-100',
            !isSidebarOpen && 'lg:justify-center'
          )}
        >
          <Icon size={20} />
          <span
            className={cn(
              'font-medium whitespace-nowrap grow transition-opacity duration-200',
              !isSidebarOpen && 'lg:hidden'
            )}
          >
            {item.label}
          </span>

          <ChevronDown
            size={16}
            className={cn(
              'transition-transform',
              !isSidebarOpen && 'lg:hidden',
              isSubmenuOpen && 'rotate-180'
            )}
          />
        </button>

        {/* Sub-Items */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300',
            isSubmenuOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
          )}
        >
          {item.subItems?.map(subItem => (
            <Link
              key={subItem.href}
              href={subItem.href}
              onClick={() => {
                if (window.innerWidth < 1024) closeSidebar();
              }}
              className={cn(
                'flex items-center gap-3 pl-12 pr-4 py-2 rounded-lg transition-colors text-sm',
                pathname === subItem.href
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      </>
    );
  };

  const LOGO_WIDTH = 140; // Slightly larger for impact
  const LOGO_HEIGHT = 48; // For a 3:1 ratio logo

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
              src="/whudey.png" // 🎯 Note: Ensure your file name matches the one in /public, e.g., 'whudey-logo.png'
              alt="Whudey Logo"
              width={LOGO_WIDTH}
              height={LOGO_HEIGHT}
              priority
              className={cn(
                // 1. Base Class for block display (default for logos)
                'block transition-opacity duration-300',

                // 2. The Core Logic: Hide the image when the sidebar is closed
                // Apply opacity: 0 and prevent clicks/layout if needed
                !isSidebarOpen && 'opacity-0 pointer-events-none lg:hidden',

                // 3. Ensure it's visible on large screens when the sidebar is open
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
          {menuItems.map(item => {
            const isSubItemActive = !!item.subItems?.some(sub =>
              pathname?.startsWith(sub.href)
            );

            const isBaseRouteActive = pathname?.startsWith(item.href);

            let isActive = false;
            if (item.subItems) {
              isActive = isSubItemActive;
              if (pathname === item.href) {
                isActive = true;
              }
            } else if (item.href === '/dashboard') {
              isActive = pathname === item.href;
            } else {
              isActive = isBaseRouteActive;
            }

            const isSubmenuOpen = openSubmenu === item.label;
            const Icon = item.icon;

            return (
              <div key={item.label}>
                <NavItem
                  item={item}
                  isActive={isActive}
                  isSubmenuOpen={isSubItemActive || isSubmenuOpen}
                  Icon={Icon}
                />
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
