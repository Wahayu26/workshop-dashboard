'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  ClipboardList,
  Users,
  Wrench,
  Package,
  UserCog,
  Receipt,
  BarChart3,
  Settings,
  Car,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth, Role } from '@/lib/auth-context';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  allowedRoles: Role[];
  badge?: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['OWNER', 'ADMIN', 'CASHIER'],
  },
  {
    name: 'Booking & Antrian',
    href: '/bookings',
    icon: CalendarCheck,
    allowedRoles: ['OWNER', 'ADMIN', 'CASHIER', 'CUSTOMER'],
    badge: 'Real-time',
  },
  {
    name: 'Work Order (SPK)',
    href: '/work-orders',
    icon: ClipboardList,
    allowedRoles: ['OWNER', 'ADMIN', 'CASHIER', 'MECHANIC'],
    badge: 'Kanban',
  },
  {
    name: 'Pelanggan & Kendaraan',
    href: '/customers',
    icon: Users,
    allowedRoles: ['OWNER', 'ADMIN', 'CASHIER'],
  },
  {
    name: 'Layanan & Tarif',
    href: '/services',
    icon: Wrench,
    allowedRoles: ['OWNER', 'ADMIN', 'CASHIER'],
  },
  {
    name: 'Inventori Sparepart',
    href: '/inventory',
    icon: Package,
    allowedRoles: ['OWNER', 'ADMIN', 'CASHIER'],
  },
  {
    name: 'Mekanik & Jadwal',
    href: '/mechanics',
    icon: UserCog,
    allowedRoles: ['OWNER', 'ADMIN'],
  },
  {
    name: 'Kasir & POS',
    href: '/pos',
    icon: Receipt,
    allowedRoles: ['OWNER', 'ADMIN', 'CASHIER'],
  },
  {
    name: 'Laporan & Analisis',
    href: '/reports',
    icon: BarChart3,
    allowedRoles: ['OWNER'],
  },
  {
    name: 'Pengaturan Bengkel',
    href: '/settings',
    icon: Settings,
    allowedRoles: ['OWNER', 'ADMIN'],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();

  const filteredMenus = MENU_ITEMS.filter((item) =>
    role ? item.allowedRoles.includes(role) : false,
  );

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 select-none shrink-0 h-screen sticky top-0">
      {/* Brand Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200 dark:border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-racing-600 to-racing-400 flex items-center justify-center text-white shadow-glow">
          <Wrench className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Bengkel<span className="text-racing-500">Ku</span>
          </span>
          <div className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">
            Mobil & Motor
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Menu Utama
        </div>

        {filteredMenus.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-racing-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                  }`}
                />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-racing-500/10 text-racing-600 dark:text-racing-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Profile & Logout */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 mb-2">
          <div className="flex items-center justify-between">
            <div className="truncate mr-2">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user?.fullName || 'Pengguna'}
              </div>
              <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-racing-500/15 text-racing-600 dark:text-racing-400 shrink-0">
              <ShieldCheck className="w-3 h-3" />
              {role}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Akun</span>
        </button>
      </div>
    </aside>
  );
}
