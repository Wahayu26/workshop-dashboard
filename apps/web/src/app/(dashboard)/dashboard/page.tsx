'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Car,
  Bike,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ClipboardList,
  Wrench,
  DollarSign,
  Plus,
  CalendarCheck,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { VehicleTypeToggle, VehicleFilter } from '@/components/shared/vehicle-type-toggle';
import { formatRupiah, formatDateTimeIndo } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';

export default function DashboardPage() {
  const { user, role } = useAuth();
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter>('ALL');

  // Stats data filtered by vehicle type (Cars vs Motor vs All)
  const stats = {
    revenueToday: vehicleFilter === 'CAR' ? 2850000 : vehicleFilter === 'MOTORCYCLE' ? 1420000 : 4270000,
    activeQueue: vehicleFilter === 'CAR' ? 5 : vehicleFilter === 'MOTORCYCLE' ? 7 : 12,
    inProgressWO: vehicleFilter === 'CAR' ? 3 : vehicleFilter === 'MOTORCYCLE' ? 4 : 7,
    lowStockCount: 4,
  };

  // Mock recent Work Orders (active pipeline)
  const recentWorkOrders = [
    {
      id: 'wo-1',
      woNumber: 'WO-20261025-001',
      vehicleType: 'CAR',
      plateNumber: 'B 1452 SKA',
      vehicleName: 'Toyota Avanza 1.5 Veloz',
      customerName: 'Budi Darmawan',
      complaint: 'Tarikan berat & ganti oli mesin 40.000 km',
      mechanicName: 'Agus Santoso',
      status: 'IN_PROGRESS',
      statusLabel: 'Dikerjakan',
      statusColor: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
      totalEstimated: 783000,
      createdAt: '2026-10-25T09:15:00',
    },
    {
      id: 'wo-2',
      woNumber: 'WO-20261025-002',
      vehicleType: 'MOTORCYCLE',
      plateNumber: 'D 3344 BDG',
      vehicleName: 'Honda Vario 160 CBS',
      customerName: 'Ahmad Fauzi',
      complaint: 'CVT gredek & ganti oli matic',
      mechanicName: 'Hendra Wijaya',
      status: 'DIAGNOSING',
      statusLabel: 'Diagnosa',
      statusColor: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
      totalEstimated: 160000,
      createdAt: '2026-10-25T09:40:00',
    },
    {
      id: 'wo-3',
      woNumber: 'WO-20261025-003',
      vehicleType: 'CAR',
      plateNumber: 'B 8899 TAY',
      vehicleName: 'Honda HR-V 1.5 SE',
      customerName: 'Dewi Lestari',
      complaint: 'AC kurang dingin & bau apek',
      mechanicName: 'Dedi Kurniawan',
      status: 'QC',
      statusLabel: 'Quality Control',
      statusColor: 'bg-purple-500/15 text-purple-500 border-purple-500/30',
      totalEstimated: 520000,
      createdAt: '2026-10-25T08:30:00',
    },
    {
      id: 'wo-4',
      woNumber: 'WO-20261025-004',
      vehicleType: 'MOTORCYCLE',
      plateNumber: 'D 4567 KLA',
      vehicleName: 'Yamaha NMAX 155 Connected',
      customerName: 'Budi Darmawan',
      complaint: 'Kampas rem depan habis & ganti oli',
      mechanicName: 'Hendra Wijaya',
      status: 'COMPLETED',
      statusLabel: 'Selesai (Siap Bayar)',
      statusColor: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
      totalEstimated: 140000,
      createdAt: '2026-10-25T08:00:00',
    },
  ].filter((wo) => vehicleFilter === 'ALL' || wo.vehicleType === vehicleFilter);

  // Stepper statuses indicator
  const stepperStages = [
    { label: 'Menunggu', count: 3, color: 'text-slate-400' },
    { label: 'Diagnosa', count: 2, color: 'text-blue-500' },
    { label: 'Dikerjakan', count: stats.inProgressWO, color: 'text-amber-500' },
    { label: 'QC', count: 1, color: 'text-purple-500' },
    { label: 'Selesai', count: 5, color: 'text-emerald-500' },
    { label: 'Lunas', count: 8, color: 'text-racing-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome with Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-steel-blue to-charcoal-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute right-0 top-0 w-80 h-full bg-racing-500/10 blur-2xl pointer-events-none" />

        <div className="z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-racing-500/20 text-racing-300 border border-racing-500/30 mb-2">
            <Wrench className="w-3.5 h-3.5" /> Operasional Bengkel Terpadu
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang, {user?.fullName}!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Pantau status antrian, work order kendaraan, dan transaksi kasir secara real-time.
          </p>
        </div>

        {/* Filter Mobil / Motor / Semua */}
        <div className="z-10 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="text-xs text-slate-300 font-medium">Filter Kendaraan:</span>
          <VehicleTypeToggle value={vehicleFilter} onChange={setVehicleFilter} />
        </div>
      </div>

      {/* KPI Stat Cards (Grid 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pendapatan Hari Ini */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-card"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Pendapatan Hari Ini</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {formatRupiah(stats.revenueToday)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% dibanding kemarin</span>
          </div>
        </motion.div>

        {/* Card 2: Antrian Aktif */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-card"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Antrian & Booking</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.activeQueue} Kendaraan
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2">
            3 booking kedatangan siang ini
          </div>
        </motion.div>

        {/* Card 3: Work Order Dikerjakan */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-card"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Sedang Dikerjakan</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.inProgressWO} Unit
          </div>
          <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-2">
            3 mekanik bertugas aktif
          </div>
        </motion.div>

        {/* Card 4: Stok Sparepart Menipis */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-card"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Stok Sparepart Menipis</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {stats.lowStockCount} Item
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2">
            Termasuk Oli Enduro Matic & Busi
          </div>
        </motion.div>
      </div>

      {/* Stepper Status Work Order Flow Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-racing-500" />
              Alur Status Work Order Hari Ini
            </h2>
            <p className="text-xs text-slate-500">Pipeline servis real-time dari registrasi hingga pembayaran kasir</p>
          </div>
          <Link
            href="/work-orders"
            className="text-xs font-bold text-racing-500 hover:text-racing-600 flex items-center gap-1"
          >
            Buka Kanban Board <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stepper Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {stepperStages.map((stage, idx) => (
            <div
              key={stage.label}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 text-center relative overflow-hidden"
            >
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                {idx + 1}. {stage.label}
              </div>
              <div className={`text-xl font-black ${stage.color}`}>{stage.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Work Order Aktif Table / Card List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-racing-500" />
              Antrian & Servis Sedang Berjalan
            </h2>
            <p className="text-xs text-slate-500">
              Menampilkan {recentWorkOrders.length} unit kendaraan dalam penanganan
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/work-orders/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-racing-500 hover:bg-racing-600 text-white font-bold text-xs shadow-glow transition-all"
            >
              <Plus className="w-4 h-4" />
              Buat SPK Baru
            </Link>
          </div>
        </div>

        {/* Table on desktop, cards on mobile */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4">No. SPK & Waktu</th>
                <th className="py-3 px-4">Kendaraan</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4">Keluhan / Diagnosa</th>
                <th className="py-3 px-4">Mekanik</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Estimasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              {recentWorkOrders.map((wo) => (
                <tr
                  key={wo.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {wo.woNumber}
                    </span>
                    <div className="text-[10px] text-slate-400">
                      {formatDateTimeIndo(wo.createdAt)}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {wo.vehicleType === 'CAR' ? (
                          <Car className="w-4 h-4 text-racing-500" />
                        ) : (
                          <Bike className="w-4 h-4 text-yellow-500" />
                        )}
                      </span>
                      <div>
                        <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-[11px]">
                          {wo.plateNumber}
                        </span>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                          {wo.vehicleName}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {wo.customerName}
                  </td>

                  <td className="py-3.5 px-4 max-w-xs truncate text-slate-600 dark:text-slate-300">
                    {wo.complaint}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                      <Wrench className="w-3 h-3 text-slate-400" />
                      {wo.mechanicName}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${wo.statusColor}`}
                    >
                      {wo.statusLabel}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {formatRupiah(wo.totalEstimated)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
