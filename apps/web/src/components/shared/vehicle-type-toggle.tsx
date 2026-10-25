'use client';

import React from 'react';
import { Car, Bike } from 'lucide-react';

export type VehicleFilter = 'ALL' | 'CAR' | 'MOTORCYCLE';

interface VehicleTypeToggleProps {
  value: VehicleFilter;
  onChange: (val: VehicleFilter) => void;
  showAll?: boolean;
}

export function VehicleTypeToggle({
  value,
  onChange,
  showAll = true,
}: VehicleTypeToggleProps) {
  return (
    <div className="inline-flex items-center p-1 bg-slate-200/70 dark:bg-slate-900/80 rounded-xl border border-slate-300 dark:border-slate-800 text-xs font-semibold shadow-inner">
      {showAll && (
        <button
          type="button"
          onClick={() => onChange('ALL')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            value === 'ALL'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Semua
        </button>
      )}

      <button
        type="button"
        onClick={() => onChange('CAR')}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
          value === 'CAR'
            ? 'bg-racing-500 text-white shadow-sm font-bold'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Car className="w-3.5 h-3.5" />
        <span>Mobil</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('MOTORCYCLE')}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
          value === 'MOTORCYCLE'
            ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Bike className="w-3.5 h-3.5" />
        <span>Motor</span>
      </button>
    </div>
  );
}
