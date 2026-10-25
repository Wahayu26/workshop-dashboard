'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { X, Wrench, ShieldCheck, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, Role } from '@/lib/auth-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const pathname = usePathname();
  const { user, role, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row text-slate-900 dark:text-slate-100">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex"
          onClick={() => setMobileDrawerOpen(false)}
        >
          <div
            className="w-72 bg-white dark:bg-slate-950 h-full p-4 flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-racing-500 flex items-center justify-center text-white">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                  Bengkel<span className="text-racing-500">Ku</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 py-4 overflow-y-auto space-y-1">
              <Link
                href="/dashboard"
                onClick={() => setMobileDrawerOpen(false)}
                className="block px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Dashboard
              </Link>
              <Link
                href="/bookings"
                onClick={() => setMobileDrawerOpen(false)}
                className="block px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Booking & Antrian
              </Link>
              <Link
                href="/work-orders"
                onClick={() => setMobileDrawerOpen(false)}
                className="block px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Work Order (SPK)
              </Link>
              <Link
                href="/customers"
                onClick={() => setMobileDrawerOpen(false)}
                className="block px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Pelanggan & Kendaraan
              </Link>
              <Link
                href="/services"
                onClick={() => setMobileDrawerOpen(false)}
                className="block px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Layanan & Tarif
              </Link>
              <Link
                href="/inventory"
                onClick={() => setMobileDrawerOpen(false)}
                className="block px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Inventori Sparepart
              </Link>
              <Link
                href="/pos"
                onClick={() => setMobileDrawerOpen(false)}
                className="block px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Kasir & POS
              </Link>
              <Link
                href="/settings"
                onClick={() => setMobileDrawerOpen(false)}
                className="block px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Pengaturan
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-2 py-2 text-sm font-semibold text-rose-500"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Akun</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <Header onToggleMobileNav={() => setMobileDrawerOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
