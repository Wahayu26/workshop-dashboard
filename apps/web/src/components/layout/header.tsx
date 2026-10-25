'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import {
  Sun,
  Moon,
  Bell,
  Search,
  UserCheck,
  ChevronDown,
  Menu,
  Wrench,
  ShieldCheck,
} from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS, Role } from '@/lib/auth-context';

interface HeaderProps {
  onToggleMobileNav?: () => void;
}

export function Header({ onToggleMobileNav }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { user, role, quickLoginAsRole } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  return (
    <header className="h-16 px-4 sm:px-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Menu button + Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileNav}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            BengkelKu Service Center
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline-block">•</span>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            Operasional Buka (08:00 - 17:00)
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Switcher Pill (Great for interactive evaluation) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-racing-500/50 transition-all text-slate-800 dark:text-slate-200"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-racing-500" />
            <span className="hidden md:inline">Role:</span>
            <span className="text-racing-600 dark:text-racing-400 font-bold">{role}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50">
              <div className="px-2 py-1 text-[11px] font-bold uppercase text-slate-400">
                Ganti Role Cepat (Simulasi RBAC)
              </div>
              {(Object.keys(DEMO_ACCOUNTS) as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    quickLoginAsRole(r);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-between transition-colors ${
                    role === r
                      ? 'bg-racing-500 text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{DEMO_ACCOUNTS[r].label}</span>
                  {role === r && <span className="text-[10px]">Aktif</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all"
          aria-label="Toggle dark/light theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-racing-500" />
        </button>
      </div>
    </header>
  );
}
