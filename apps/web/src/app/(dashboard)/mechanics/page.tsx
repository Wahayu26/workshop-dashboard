'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCog,
  Wrench,
  Car,
  Bike,
  Star,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  X,
} from 'lucide-react';

interface ActiveWO {
  id: string;
  woNumber: string;
  vehiclePlate: string;
  vehicleModel: string;
  vehicleType: 'CAR' | 'MOTORCYCLE';
  status: string;
  statusLabel: string;
}

interface MechanicItem {
  id: string;
  employeeId: string;
  fullName: string;
  phone: string;
  email: string;
  specialization: string;
  status: 'AVAILABLE' | 'BUSY' | 'OFF_DUTY';
  rating: number;
  dailyTarget: number;
  todayCompletedCount: number;
  activeWorkOrders: ActiveWO[];
}

const INITIAL_MECHANICS: MechanicItem[] = [
  {
    id: 'mek-1',
    employeeId: 'MEK-001',
    fullName: 'Agus Santoso',
    phone: '0812-1111-0004',
    email: 'agus.santoso@bengkelku.id',
    specialization: 'Mobil Umum & Mesin Bensin',
    status: 'BUSY',
    rating: 4.9,
    dailyTarget: 5,
    todayCompletedCount: 2,
    activeWorkOrders: [
      {
        id: 'wo-1',
        woNumber: 'WO-20261025-001',
        vehiclePlate: 'B 1452 SKA',
        vehicleModel: 'Toyota Avanza 1.5 Veloz',
        vehicleType: 'CAR',
        status: 'IN_PROGRESS',
        statusLabel: 'Dikerjakan (Tune Up)',
      },
    ],
  },
  {
    id: 'mek-2',
    employeeId: 'MEK-002',
    fullName: 'Hendra Wijaya',
    phone: '0812-1111-0005',
    email: 'hendra.wijaya@bengkelku.id',
    specialization: 'Motor Matic, Bebek & CVT Injeksi',
    status: 'BUSY',
    rating: 4.85,
    dailyTarget: 7,
    todayCompletedCount: 3,
    activeWorkOrders: [
      {
        id: 'wo-2',
        woNumber: 'WO-20261025-002',
        vehiclePlate: 'D 3344 BDG',
        vehicleModel: 'Honda Vario 160 CBS',
        vehicleType: 'MOTORCYCLE',
        status: 'DIAGNOSING',
        statusLabel: 'Diagnosa CVT',
      },
    ],
  },
  {
    id: 'mek-3',
    employeeId: 'MEK-003',
    fullName: 'Dedi Kurniawan',
    phone: '0812-1111-0006',
    email: 'dedi.kurniawan@bengkelku.id',
    specialization: 'AC Mobil & Sistem Kelistrikan',
    status: 'AVAILABLE',
    rating: 4.95,
    dailyTarget: 4,
    todayCompletedCount: 2,
    activeWorkOrders: [],
  },
];

export default function MechanicsPage() {
  const [mechanics, setMechanics] = useState<MechanicItem[]>(INITIAL_MECHANICS);
  const [selectedMechanic, setSelectedMechanic] = useState<MechanicItem | null>(null);

  const totalAvailable = mechanics.filter((m) => m.status === 'AVAILABLE').length;
  const totalBusy = mechanics.filter((m) => m.status === 'BUSY').length;

  const toggleStatus = (id: string, newStatus: 'AVAILABLE' | 'BUSY' | 'OFF_DUTY') => {
    setMechanics(
      mechanics.map((m) => (m.id === id ? { ...m, status: newStatus } : m)),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <UserCog className="w-6 h-6 text-racing-500" />
            Mekanik & Manajemen Beban Kerja
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Pantau status ketersediaan teknisi, penugasan SPK aktif, target harian, dan rating performa
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Teknisi</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {mechanics.length} Orang
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-emerald-600 font-semibold uppercase flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Teknisi Tersedia
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {totalAvailable} Siap SPK
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-amber-500 font-semibold uppercase flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5" /> Sedang Menangani SPK
          </div>
          <div className="text-2xl font-black text-amber-500 mt-1">
            {totalBusy} Teknisi
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-racing-500 font-semibold uppercase flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5" /> Rata-Rata Kepuasan
          </div>
          <div className="text-2xl font-black text-racing-600 dark:text-racing-400 mt-1">
            4.9 / 5.0
          </div>
        </div>
      </div>

      {/* Mechanics Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mechanics.map((m) => {
          const progressPercent = Math.min(
            100,
            Math.round(
              ((m.todayCompletedCount + m.activeWorkOrders.length) / m.dailyTarget) * 100,
            ),
          );

          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card flex flex-col justify-between"
            >
              <div>
                {/* Top header: Employee ID & Status Badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {m.employeeId}
                  </span>

                  {/* Status Dropdown/Toggle */}
                  <select
                    value={m.status}
                    onChange={(e) => toggleStatus(m.id, e.target.value as any)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border outline-none cursor-pointer ${
                      m.status === 'AVAILABLE'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        : m.status === 'BUSY'
                        ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                        : 'bg-slate-500/15 text-slate-500 border-slate-500/30'
                    }`}
                  >
                    <option value="AVAILABLE">🟢 Tersedia</option>
                    <option value="BUSY">🟡 Sibuk (Dikerjakan)</option>
                    <option value="OFF_DUTY">⚪ Cuti / Libur</option>
                  </select>
                </div>

                {/* Profile Info */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-racing-500 to-racing-600 text-white font-black text-base flex items-center justify-center shadow-glow">
                    {m.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {m.fullName}
                    </h3>
                    <div className="text-xs text-racing-600 dark:text-racing-400 font-semibold">
                      {m.specialization}
                    </div>
                  </div>
                </div>

                {/* Contact and Rating */}
                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
                  <div className="flex items-center justify-between">
                    <span>Telepon:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{m.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Rating Kepuasan:</span>
                    <span className="font-bold text-amber-500 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {m.rating} / 5.0
                    </span>
                  </div>
                </div>

                {/* Daily Workload Progress */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mb-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500 font-medium">Target Harian:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {m.todayCompletedCount} / {m.dailyTarget} SPK
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-racing-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Active Work Orders */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    SPK Sedang Ditangani ({m.activeWorkOrders.length})
                  </div>
                  {m.activeWorkOrders.length === 0 ? (
                    <div className="p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                      Tidak ada pekerjaan aktif saat ini.
                    </div>
                  ) : (
                    m.activeWorkOrders.map((wo) => (
                      <div
                        key={wo.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {wo.vehicleType === 'CAR' ? (
                            <Car className="w-4 h-4 text-racing-500" />
                          ) : (
                            <Bike className="w-4 h-4 text-yellow-500" />
                          )}
                          <div>
                            <div className="font-mono font-bold text-slate-900 dark:text-white text-[11px]">
                              {wo.vehiclePlate}
                            </div>
                            <div className="text-[10px] text-slate-500">{wo.vehicleModel}</div>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-500">
                          {wo.statusLabel}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedMechanic(m)}
                  className="text-xs font-bold text-racing-500 hover:text-racing-600 flex items-center gap-1"
                >
                  Lihat Riwayat Pekerjaan <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mechanic Detail Modal */}
      <AnimatePresence>
        {selectedMechanic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setSelectedMechanic(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-racing-500 text-white font-black text-base flex items-center justify-center">
                  {selectedMechanic.employeeId}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedMechanic.fullName}
                  </h2>
                  <div className="text-xs text-racing-500 font-semibold">
                    {selectedMechanic.specialization}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2 text-xs mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Servis Selesai Bulan Ini:</span>
                  <span className="font-bold text-slate-900 dark:text-white">48 SPK</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tingkat Ketepatan Waktu:</span>
                  <span className="font-bold text-emerald-500">96.5% Tepat Waktu</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rating Rata-Rata:</span>
                  <span className="font-bold text-amber-500 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    {selectedMechanic.rating} / 5.0 (Berdasarkan 42 ulasan pelanggan)
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedMechanic(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
