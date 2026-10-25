'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Car,
  Bike,
  Calendar,
  Download,
  Printer,
  Award,
  Layers,
  ArrowUpRight,
  Filter,
  CreditCard,
  CheckCircle2,
  Package,
  Wrench,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatRupiah } from '@/lib/utils';
import { VehicleTypeToggle, VehicleFilter } from '@/components/shared/vehicle-type-toggle';

const REVENUE_DATA_7DAYS = [
  { label: '19 Okt', mobil: 2800000, motor: 1200000, total: 4000000 },
  { label: '20 Okt', mobil: 3500000, motor: 1450000, total: 4950000 },
  { label: '21 Okt', mobil: 2200000, motor: 980000, total: 3180000 },
  { label: '22 Okt', mobil: 4100000, motor: 1800000, total: 5900000 },
  { label: '23 Okt', mobil: 3800000, motor: 1650000, total: 5450000 },
  { label: '24 Okt', mobil: 5200000, motor: 2400000, total: 7600000 },
  { label: '25 Okt', mobil: 4600000, motor: 2100000, total: 6700000 },
];

const REVENUE_DATA_MONTH = [
  { label: 'Minggu 1', mobil: 18500000, motor: 8200000, total: 26700000 },
  { label: 'Minggu 2', mobil: 22400000, motor: 9800000, total: 32200000 },
  { label: 'Minggu 3', mobil: 25100000, motor: 11400000, total: 36500000 },
  { label: 'Minggu 4', mobil: 20100000, motor: 9000000, total: 29100000 },
];

const TOP_SERVICES_DATA = [
  { name: 'Ganti Oli & Cek 15 Titik', count: 84, revenue: 4200000 },
  { name: 'Tune Up Mesin Injeksi', count: 42, revenue: 14700000 },
  { name: 'Servis CVT Matic Komplit', count: 68, revenue: 5780000 },
  { name: 'Servis AC & Flushing', count: 28, revenue: 12600000 },
  { name: 'Servis Rem & Bubut Rotor', count: 35, revenue: 9800000 },
];

const TOP_PARTS_DATA = [
  { name: 'Fastron Gold 10W-40 (4L)', sold: 54, revenue: 19440000 },
  { name: 'Enduro Matic 10W-30 (0.8L)', sold: 78, revenue: 4290000 },
  { name: 'Filter Oli Avanza/Xenia', sold: 48, revenue: 2304000 },
  { name: 'Kampas Rem Depan Vario 160', sold: 32, revenue: 2080000 },
  { name: 'Aki GS Astra MF NS40Z', sold: 14, revenue: 11900000 },
];

const VEHICLE_RATIO_DATA = [
  { name: 'Mobil', value: 65, color: '#F97316' },
  { name: 'Motor', value: 35, color: '#FACC15' },
];

const PAYMENT_RATIO_DATA = [
  { name: 'QRIS Dinamis', value: 45, color: '#10B981' },
  { name: 'Transfer Bank', value: 30, color: '#3B82F6' },
  { name: 'Tunai (Cash)', value: 25, color: '#F97316' },
];

const MECHANIC_LEADERBOARD = [
  {
    rank: 1,
    name: 'Agus Santoso',
    specialty: 'Kepala Mekanik Mesin Mobil & Transmisi',
    woCompleted: 48,
    grossRevenue: 34500000,
    rating: 4.95,
  },
  {
    rank: 2,
    name: 'Bambang Irawan',
    specialty: 'Spesialis Matic & Kelistrikan Motor',
    woCompleted: 56,
    grossRevenue: 28200000,
    rating: 4.92,
  },
  {
    rank: 3,
    name: 'Rudi Hermawan',
    specialty: 'Spesialis AC Mobil & Electrical',
    woCompleted: 34,
    grossRevenue: 26800000,
    rating: 4.88,
  },
  {
    rank: 4,
    name: 'Dedi Kurniawan',
    specialty: 'Mekanik Servis Berkala & Kaki-kaki',
    woCompleted: 41,
    grossRevenue: 21600000,
    rating: 4.85,
  },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState<'7days' | 'month' | 'year'>('7days');
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter>('ALL');

  const chartData = period === '7days' ? REVENUE_DATA_7DAYS : REVENUE_DATA_MONTH;

  const targetMonthly = 150000000;
  const currentRevenue = 124500000;
  const achievementRate = Math.round((currentRevenue / targetMonthly) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-racing-500" />
            Laporan Finansial & Analitik Bengkel
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Monitoring performa pendapatan, tren servis, mekanik terbaik, dan margin inventori
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Period Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setPeriod('7days')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === '7days'
                  ? 'bg-white dark:bg-slate-800 text-racing-600 dark:text-racing-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              7 Hari Terakhir
            </button>
            <button
              type="button"
              onClick={() => setPeriod('month')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === 'month'
                  ? 'bg-white dark:bg-slate-800 text-racing-600 dark:text-racing-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Bulan Ini
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak PDF / Print
          </button>
        </div>
      </div>

      {/* Target Progress Banner */}
      <div className="bg-gradient-to-r from-racing-500 via-racing-600 to-amber-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/90">
              <Sparkles className="w-4 h-4" />
              Target Omset Oktober 2026
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {formatRupiah(currentRevenue)}
              <span className="text-lg font-medium text-white/80"> / {formatRupiah(targetMonthly)}</span>
            </div>
            <p className="text-sm text-white/90">
              Pencapaian sudah <span className="font-bold">{achievementRate}%</span> dari target bulanan. Pacing sangat sehat dengan proyeksi surplus +8%!
            </p>
          </div>

          <div className="w-full md:w-72 bg-black/20 p-4 rounded-xl backdrop-blur-md border border-white/20">
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span>Progres Target</span>
              <span>{achievementRate}% Tercapai</span>
            </div>
            <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${achievementRate}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-white rounded-full"
              />
            </div>
            <div className="flex justify-between text-[11px] text-white/80 mt-2">
              <span>Sisa: {formatRupiah(targetMonthly - currentRevenue)}</span>
              <span>6 hari kerja lagi</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Kendaraan Servis</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">248 Unit</p>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+14.2% vs bln lalu</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-racing-50 dark:bg-racing-950/40 text-racing-500 flex items-center justify-center">
            <Car className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Rata-rata Nilai Transaksi</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{formatRupiah(502000)}</p>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+8.5% basket size</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Margin Laba Sparepart</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">32.4%</p>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>Stabil di atas 30%</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Tingkat Kepuasan (CSAT)</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">4.92 / 5.0</p>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-amber-500 font-semibold">
              <span>★ 142 Ulasan Pelanggan</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Revenue Trend Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-racing-500" />
              Tren Pendapatan: Mobil vs Motor
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Grafik perbandingan penerimaan bengkel berdasarkan segmen jenis kendaraan
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-racing-500" />
              <span className="text-slate-600 dark:text-slate-300">Mobil</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="text-slate-600 dark:text-slate-300">Motor</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMobil" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorMotor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FACC15" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#FACC15" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
              <XAxis dataKey="label" stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(0)}jt`}
              />
              <Tooltip
                formatter={(value: number) => [formatRupiah(value), '']}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#1E293B',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="mobil"
                name="Servis Mobil"
                stroke="#F97316"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorMobil)"
              />
              <Area
                type="monotone"
                dataKey="motor"
                name="Servis Motor"
                stroke="#FACC15"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorMotor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Top Services and Top Spareparts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-racing-500" />
                Layanan Paling Diminati
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                Berdasarkan Order
              </span>
            </div>

            <div className="space-y-4">
              {TOP_SERVICES_DATA.map((srv, idx) => (
                <div key={srv.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200 truncate pr-2">
                      <span className="text-racing-500 mr-2">#{idx + 1}</span>
                      {srv.name}
                    </span>
                    <span className="text-slate-900 dark:text-white whitespace-nowrap">
                      {srv.count} SPK ({formatRupiah(srv.revenue)})
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-racing-500 rounded-full transition-all duration-500"
                      style={{ width: `${(srv.count / 84) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Spare Parts */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-500" />
                Sparepart Terlaris (Revenue Terbesar)
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                Bulan Ini
              </span>
            </div>

            <div className="space-y-4">
              {TOP_PARTS_DATA.map((part, idx) => (
                <div key={part.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200 truncate pr-2">
                      <span className="text-blue-500 mr-2">#{idx + 1}</span>
                      {part.name}
                    </span>
                    <span className="text-slate-900 dark:text-white whitespace-nowrap">
                      {part.sold} pcs ({formatRupiah(part.revenue)})
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${(part.revenue / 19440000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Donut Ratios & Mechanic Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rasio Kendaraan & Pembayaran */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Layers className="w-4 h-4 text-racing-500" />
              Komposisi Unit: Mobil vs Motor
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Perbandingan volume kendaraan yang masuk ke bengkel
            </p>

            <div className="flex items-center justify-around">
              <div className="h-32 w-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={VEHICLE_RATIO_DATA}
                      innerRadius={36}
                      outerRadius={56}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {VEHICLE_RATIO_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 text-xs font-semibold">
                {VEHICLE_RATIO_DATA.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 dark:text-slate-300">{item.name}:</span>
                    <span className="text-slate-900 dark:text-white font-bold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-500" />
              Kanal Metode Pembayaran
            </h3>
            <div className="space-y-2 mt-3">
              {PAYMENT_RATIO_DATA.map((method) => (
                <div key={method.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: method.color }} />
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{method.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{method.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mechanic Performance Leaderboard */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Leaderboard & Produktivitas Mekanik
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Evaluasi performa penyelesaian SPK dan kontribusi omset per teknisi
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-lg border border-amber-200 dark:border-amber-800/40">
              4 Teknisi Terbaik
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Peringkat</th>
                  <th className="py-2.5 px-3">Nama Teknisi</th>
                  <th className="py-2.5 px-3">Keahlian Utama</th>
                  <th className="py-2.5 px-3 text-center">SPK Selesai</th>
                  <th className="py-2.5 px-3 text-center">Rating</th>
                  <th className="py-2.5 px-3 text-right">Omset Dihasilkan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {MECHANIC_LEADERBOARD.map((mech) => (
                  <tr key={mech.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3">
                      <span
                        className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                          mech.rank === 1
                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                            : mech.rank === 2
                            ? 'bg-slate-300 text-slate-900'
                            : mech.rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {mech.rank}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{mech.name}</td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{mech.specialty}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                      {mech.woCompleted} Unit
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-amber-500">
                      ★ {mech.rating}
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-slate-900 dark:text-white">
                      {formatRupiah(mech.grossRevenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
