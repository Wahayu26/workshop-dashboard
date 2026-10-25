'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  Car,
  Bike,
  Plus,
  Search,
  Filter,
  Kanban,
  List,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  User,
  Wrench,
  DollarSign,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { VehicleTypeToggle, VehicleFilter } from '@/components/shared/vehicle-type-toggle';
import { formatRupiah, formatDateTimeIndo } from '@/lib/utils';

export type WOStatus =
  | 'PENDING'
  | 'DIAGNOSING'
  | 'IN_PROGRESS'
  | 'QC'
  | 'COMPLETED'
  | 'PAID';

interface WOItem {
  id: string;
  woNumber: string;
  customerName: string;
  vehiclePlate: string;
  vehicleModel: string;
  vehicleType: 'CAR' | 'MOTORCYCLE';
  complaint: string;
  mechanicName?: string;
  priority: 'NORMAL' | 'URGENT';
  status: WOStatus;
  entryMileage: number;
  totalEstimated: number;
  createdAt: string;
}

const KANBAN_COLUMNS: { key: WOStatus; label: string; color: string; badgeColor: string }[] = [
  {
    key: 'PENDING',
    label: 'Menunggu Antrian',
    color: 'border-slate-300 dark:border-slate-700',
    badgeColor: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
  },
  {
    key: 'DIAGNOSING',
    label: 'Diagnosa & Cek',
    color: 'border-blue-500/40',
    badgeColor: 'bg-blue-500/15 text-blue-500',
  },
  {
    key: 'IN_PROGRESS',
    label: 'Dikerjakan',
    color: 'border-amber-500/40',
    badgeColor: 'bg-amber-500/15 text-amber-500',
  },
  {
    key: 'QC',
    label: 'Quality Control',
    color: 'border-purple-500/40',
    badgeColor: 'bg-purple-500/15 text-purple-500',
  },
  {
    key: 'COMPLETED',
    label: 'Selesai (Siap Bayar)',
    color: 'border-emerald-500/40',
    badgeColor: 'bg-emerald-500/15 text-emerald-500',
  },
  {
    key: 'PAID',
    label: 'Lunas',
    color: 'border-racing-500/40',
    badgeColor: 'bg-racing-500/15 text-racing-500',
  },
];

const INITIAL_WOS: WOItem[] = [
  {
    id: 'wo-1',
    woNumber: 'WO-20261025-001',
    customerName: 'Budi Darmawan',
    vehiclePlate: 'B 1452 SKA',
    vehicleModel: 'Toyota Avanza 1.5 Veloz',
    vehicleType: 'CAR',
    complaint: 'Tarikan mesin berat, ganti oli mesin 40.000 km dan rem belakang berdecit',
    mechanicName: 'Agus Santoso',
    priority: 'NORMAL',
    status: 'IN_PROGRESS',
    entryMileage: 42520,
    totalEstimated: 783000,
    createdAt: '2026-10-25T09:15:00',
  },
  {
    id: 'wo-2',
    woNumber: 'WO-20261025-002',
    customerName: 'Ahmad Fauzi',
    vehiclePlate: 'D 3344 BDG',
    vehicleModel: 'Honda Vario 160 CBS',
    vehicleType: 'MOTORCYCLE',
    complaint: 'CVT gredek saat tanjakan & ganti oli matic',
    mechanicName: 'Hendra Wijaya',
    priority: 'NORMAL',
    status: 'DIAGNOSING',
    entryMileage: 8900,
    totalEstimated: 160000,
    createdAt: '2026-10-25T09:40:00',
  },
  {
    id: 'wo-3',
    woNumber: 'WO-20261025-003',
    customerName: 'Dewi Lestari',
    vehiclePlate: 'B 8899 TAY',
    vehicleModel: 'Honda HR-V 1.5 SE',
    vehicleType: 'CAR',
    complaint: 'AC kurang dingin, hembusan angin kecil & bau apek',
    mechanicName: 'Dedi Kurniawan',
    priority: 'NORMAL',
    status: 'QC',
    entryMileage: 28000,
    totalEstimated: 520000,
    createdAt: '2026-10-25T08:30:00',
  },
  {
    id: 'wo-4',
    woNumber: 'WO-20261025-004',
    customerName: 'Hendrik Pratama',
    vehiclePlate: 'B 2233 PQR',
    vehicleModel: 'Pajero Sport Dakar 4x2',
    vehicleType: 'CAR',
    complaint: 'Lampu check engine menyala, mogok darurat di tol',
    mechanicName: 'Agus Santoso',
    priority: 'URGENT',
    status: 'PENDING',
    entryMileage: 64200,
    totalEstimated: 1250000,
    createdAt: '2026-10-25T10:00:00',
  },
  {
    id: 'wo-5',
    woNumber: 'WO-20261024-005',
    customerName: 'Budi Darmawan',
    vehiclePlate: 'D 4567 KLA',
    vehicleModel: 'Yamaha NMAX 155',
    vehicleType: 'MOTORCYCLE',
    complaint: 'Servis CVT komplit & ganti oli mesin Enduro Matic',
    mechanicName: 'Hendra Wijaya',
    priority: 'NORMAL',
    status: 'PAID',
    entryMileage: 12400,
    totalEstimated: 177600,
    createdAt: '2026-10-24T13:00:00',
  },
];

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<WOItem[]>(INITIAL_WOS);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter>('ALL');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'URGENT'>('ALL');

  const filteredWOs = workOrders.filter((wo) => {
    const matchSearch =
      wo.woNumber.toLowerCase().includes(search.toLowerCase()) ||
      wo.customerName.toLowerCase().includes(search.toLowerCase()) ||
      wo.vehiclePlate.toLowerCase().includes(search.toLowerCase()) ||
      wo.complaint.toLowerCase().includes(search.toLowerCase());

    const matchVehicle =
      vehicleFilter === 'ALL' ? true : wo.vehicleType === vehicleFilter;

    const matchPriority =
      priorityFilter === 'ALL' ? true : wo.priority === priorityFilter;

    return matchSearch && matchVehicle && matchPriority;
  });

  const advanceStatus = (id: string) => {
    const sequence: WOStatus[] = [
      'PENDING',
      'DIAGNOSING',
      'IN_PROGRESS',
      'QC',
      'COMPLETED',
      'PAID',
    ];

    setWorkOrders(
      workOrders.map((wo) => {
        if (wo.id === id) {
          const currentIndex = sequence.indexOf(wo.status);
          const nextStatus =
            currentIndex < sequence.length - 1
              ? sequence[currentIndex + 1]
              : wo.status;
          return { ...wo, status: nextStatus };
        }
        return wo;
      }),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-racing-500" />
            Work Order & Status Stepper Servis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Pipeline operasional servis: Menunggu → Diagnosa → Dikerjakan → QC → Selesai → Lunas
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle View Kanban vs Table */}
          <div className="p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Tabel</span>
            </button>
          </div>

          <Link
            href="/work-orders/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-racing-500 hover:bg-racing-600 text-white font-bold text-xs shadow-glow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Buat SPK Baru</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor SPK, nama pelanggan, plat polisi, atau keluhan..."
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-racing-500"
          />
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setPriorityFilter(priorityFilter === 'ALL' ? 'URGENT' : 'ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              priorityFilter === 'URGENT'
                ? 'bg-rose-500/15 text-rose-500 border-rose-500/40'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Hanya Urgent</span>
          </button>

          <VehicleTypeToggle value={vehicleFilter} onChange={setVehicleFilter} />
        </div>
      </div>

      {/* View Mode: KANBAN BOARD */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((col) => {
            const itemsInCol = filteredWOs.filter((wo) => wo.status === col.key);

            return (
              <div
                key={col.key}
                className={`p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-900/50 border ${col.color} min-w-[260px] flex flex-col min-h-[500px]`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                      {col.label}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${col.badgeColor}`}
                  >
                    {itemsInCol.length}
                  </span>
                </div>

                {/* Cards in Column */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {itemsInCol.length === 0 ? (
                    <div className="text-center py-8 text-[11px] text-slate-400 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl">
                      Kosong
                    </div>
                  ) : (
                    itemsInCol.map((wo) => (
                      <motion.div
                        key={wo.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start justify-between gap-1 mb-2">
                          <Link
                            href={`/work-orders/${wo.id}`}
                            className="font-mono text-xs font-black text-slate-900 dark:text-white hover:text-racing-500 flex items-center gap-1 group-hover:underline"
                          >
                            <span>{wo.woNumber}</span>
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                          </Link>

                          {wo.priority === 'URGENT' && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-500 border border-rose-500/30">
                              Urgent
                            </span>
                          )}
                        </div>

                        {/* Vehicle Plate & Model */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="p-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {wo.vehicleType === 'CAR' ? (
                              <Car className="w-3.5 h-3.5 text-racing-500" />
                            ) : (
                              <Bike className="w-3.5 h-3.5 text-yellow-500" />
                            )}
                          </span>
                          <div>
                            <div className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                              {wo.vehiclePlate}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">
                              {wo.vehicleModel}
                            </div>
                          </div>
                        </div>

                        {/* Customer & Keluhan */}
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mb-3 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                          {wo.complaint}
                        </div>

                        {/* Mechanic Assignment */}
                        <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-100 dark:border-slate-700/60 pt-2 mb-2">
                          <span className="flex items-center gap-1">
                            <Wrench className="w-3 h-3 text-slate-400" />
                            {wo.mechanicName || 'Belum Ditugaskan'}
                          </span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white">
                            {formatRupiah(wo.totalEstimated)}
                          </span>
                        </div>

                        {/* Next stage button */}
                        {wo.status !== 'PAID' && (
                          <button
                            type="button"
                            onClick={() => advanceStatus(wo.id)}
                            className="w-full mt-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-racing-500 hover:text-white dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 font-bold text-[10px] flex items-center justify-center gap-1 transition-all"
                          >
                            <span>Lanjut Tahap Berikutnya</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* View Mode: TABLE LIST */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3.5 px-4">No. SPK & Tanggal</th>
                  <th className="py-3.5 px-4">Kendaraan</th>
                  <th className="py-3.5 px-4">Pelanggan</th>
                  <th className="py-3.5 px-4">Keluhan & Perbaikan</th>
                  <th className="py-3.5 px-4">Mekanik</th>
                  <th className="py-3.5 px-4">Status Alur</th>
                  <th className="py-3.5 px-4 text-right">Total Estimasi</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {filteredWOs.map((wo) => (
                  <tr
                    key={wo.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/work-orders/${wo.id}`}
                        className="font-mono font-bold text-slate-900 dark:text-white hover:text-racing-500"
                      >
                        {wo.woNumber}
                      </Link>
                      <div className="text-[10px] text-slate-400">
                        {formatDateTimeIndo(wo.createdAt)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {wo.vehicleType === 'CAR' ? (
                          <Car className="w-4 h-4 text-racing-500" />
                        ) : (
                          <Bike className="w-4 h-4 text-yellow-500" />
                        )}
                        <div>
                          <div className="font-mono font-bold text-slate-900 dark:text-white">
                            {wo.vehiclePlate}
                          </div>
                          <div className="text-[11px] text-slate-500">{wo.vehicleModel}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {wo.customerName}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-600 dark:text-slate-300">
                      {wo.complaint}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      {wo.mechanicName || '-'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {wo.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatRupiah(wo.totalEstimated)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/work-orders/${wo.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs"
                      >
                        <span>Buka</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
