'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarCheck,
  Clock,
  Car,
  Bike,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Phone,
  User,
  ArrowRight,
  ClipboardList,
  AlertCircle,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { VehicleTypeToggle, VehicleFilter } from '@/components/shared/vehicle-type-toggle';
import { formatDateIndo } from '@/lib/utils';

interface BookingItem {
  id: string;
  bookingCode: string;
  queueNumber: number;
  customerName: string;
  customerPhone: string;
  vehicleType: 'CAR' | 'MOTORCYCLE';
  vehiclePlate: string;
  vehicleModel: string;
  preferredDate: string;
  preferredTimeSlot: string;
  serviceTypeNotes: string;
  status: 'PENDING' | 'CONFIRMED' | 'ARRIVED' | 'CANCELLED';
  woNumber?: string;
}

const INITIAL_BOOKINGS: BookingItem[] = [
  {
    id: 'bkg-1',
    bookingCode: 'BKG-20261025-01',
    queueNumber: 1,
    customerName: 'Budi Darmawan',
    customerPhone: '0813-9988-1122',
    vehicleType: 'CAR',
    vehiclePlate: 'B 1452 SKA',
    vehicleModel: 'Toyota Avanza 1.5 Veloz',
    preferredDate: '2026-10-25',
    preferredTimeSlot: '09:00 - 10:00',
    serviceTypeNotes: 'Ganti oli rutin & cek rem berdecit',
    status: 'ARRIVED',
    woNumber: 'WO-20261025-001',
  },
  {
    id: 'bkg-2',
    bookingCode: 'BKG-20261025-02',
    queueNumber: 2,
    customerName: 'Ahmad Fauzi',
    customerPhone: '0821-8877-6655',
    vehicleType: 'MOTORCYCLE',
    vehiclePlate: 'D 3344 BDG',
    vehicleModel: 'Honda Vario 160 CBS',
    preferredDate: '2026-10-25',
    preferredTimeSlot: '10:30 - 11:30',
    serviceTypeNotes: 'CVT gredek & ganti oli matic',
    status: 'ARRIVED',
    woNumber: 'WO-20261025-002',
  },
  {
    id: 'bkg-3',
    bookingCode: 'BKG-20261025-03',
    queueNumber: 3,
    customerName: 'Dewi Lestari',
    customerPhone: '0857-1234-9988',
    vehicleType: 'CAR',
    vehiclePlate: 'B 8899 TAY',
    vehicleModel: 'Honda HR-V 1.5 SE',
    preferredDate: '2026-10-25',
    preferredTimeSlot: '13:00 - 14:00',
    serviceTypeNotes: 'Servis AC berkala & bau apek',
    status: 'CONFIRMED',
  },
  {
    id: 'bkg-4',
    bookingCode: 'BKG-20261025-04',
    queueNumber: 4,
    customerName: 'Rudi Hartono',
    customerPhone: '0812-7788-9900',
    vehicleType: 'MOTORCYCLE',
    vehiclePlate: 'D 5566 BDG',
    vehicleModel: 'Yamaha Aerox 155',
    preferredDate: '2026-10-25',
    preferredTimeSlot: '14:30 - 15:30',
    serviceTypeNotes: 'Ganti ban belakang & tune up injeksi',
    status: 'CONFIRMED',
  },
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>(INITIAL_BOOKINGS);
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter>('ALL');
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-10-25');
  const [showAddModal, setShowAddModal] = useState(false);

  // New booking state
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [vType, setVType] = useState<'CAR' | 'MOTORCYCLE'>('CAR');
  const [vPlate, setVPlate] = useState('');
  const [vModel, setVModel] = useState('');
  const [timeSlot, setTimeSlot] = useState('11:00 - 12:00');
  const [notes, setNotes] = useState('');

  const filteredBookings = bookings.filter((bkg) => {
    const matchSearch =
      bkg.customerName.toLowerCase().includes(search.toLowerCase()) ||
      bkg.vehiclePlate.toLowerCase().includes(search.toLowerCase()) ||
      bkg.bookingCode.toLowerCase().includes(search.toLowerCase());

    const matchVehicle =
      vehicleFilter === 'ALL' ? true : bkg.vehicleType === vehicleFilter;

    return matchSearch && matchVehicle;
  });

  const handleConvertToWO = (id: string) => {
    const updated = bookings.map((b) => {
      if (b.id === id) {
        return {
          ...b,
          status: 'ARRIVED' as const,
          woNumber: `WO-20261025-${String(Date.now()).slice(-3)}`,
        };
      }
      return b;
    });
    setBookings(updated);
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !vPlate) return;

    const nextQueue = bookings.length + 1;
    const newBkg: BookingItem = {
      id: `bkg-${Date.now()}`,
      bookingCode: `BKG-20261025-${String(nextQueue).padStart(2, '0')}`,
      queueNumber: nextQueue,
      customerName: custName,
      customerPhone: custPhone,
      vehicleType: vType,
      vehiclePlate: vPlate.toUpperCase(),
      vehicleModel: vModel || (vType === 'CAR' ? 'Toyota Avanza' : 'Honda Vario'),
      preferredDate: selectedDate,
      preferredTimeSlot: timeSlot,
      serviceTypeNotes: notes || 'Servis berkala & ganti oli',
      status: 'CONFIRMED',
    };

    setBookings([...bookings, newBkg]);
    setShowAddModal(false);
    setCustName('');
    setCustPhone('');
    setVPlate('');
    setVModel('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-racing-500" />
            Booking & Antrian Servis Real-Time
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Jadwal reservasi pelanggan mobil & motor dengan urutan antrian otomatis
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-racing-500 hover:bg-racing-600 text-white font-bold text-xs shadow-glow transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Booking Servis Baru</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Booking Hari Ini</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {bookings.length} Antrian
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-emerald-600 font-semibold uppercase flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Sudah Tiba / Masuk SPK
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {bookings.filter((b) => b.status === 'ARRIVED').length} Unit
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-blue-500 font-semibold uppercase flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Menunggu Kedatangan
          </div>
          <div className="text-2xl font-black text-blue-500 mt-1">
            {bookings.filter((b) => b.status === 'CONFIRMED').length} Unit
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">Tanggal Operasional</div>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-2">
            {formatDateIndo(selectedDate)}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode booking, nama pelanggan, atau plat nomor..."
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-racing-500"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-slate-500 hidden md:inline">Jenis Kendaraan:</span>
          <VehicleTypeToggle value={vehicleFilter} onChange={setVehicleFilter} />
        </div>
      </div>

      {/* Queue List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBookings.map((bkg) => {
          const isArrived = bkg.status === 'ARRIVED';

          return (
            <motion.div
              key={bkg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
                isArrived
                  ? 'border-emerald-500/40 bg-emerald-50/10 dark:bg-emerald-950/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-racing-500 text-white font-black text-xl flex items-center justify-center shadow-glow shrink-0">
                    #{bkg.queueNumber}
                  </div>
                  <div>
                    <span className="font-mono text-[11px] font-bold text-slate-400">
                      {bkg.bookingCode}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {bkg.customerName}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      isArrived
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
                    }`}
                  >
                    {isArrived ? 'Tiba di Bengkel' : 'Terkonfirmasi'}
                  </span>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-racing-500" /> {bkg.preferredTimeSlot}
                  </div>
                </div>
              </div>

              {/* Vehicle info pill */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center gap-2">
                  {bkg.vehicleType === 'CAR' ? (
                    <Car className="w-4 h-4 text-racing-500 shrink-0" />
                  ) : (
                    <Bike className="w-4 h-4 text-yellow-500 shrink-0" />
                  )}
                  <div>
                    <span className="font-mono font-black text-slate-900 dark:text-white mr-1.5">
                      {bkg.vehiclePlate}
                    </span>
                    <span className="text-slate-500">{bkg.vehicleModel}</span>
                  </div>
                </div>

                <span className="text-slate-400 text-[11px] font-medium">{bkg.customerPhone}</span>
              </div>

              {/* Keluhan / Servis Notes */}
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 bg-slate-100/50 dark:bg-slate-800/30 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <span className="font-semibold text-slate-900 dark:text-white">Rencana Servis:</span>{' '}
                {bkg.serviceTypeNotes}
              </p>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                {isArrived ? (
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>SPK Terbit: {bkg.woNumber}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleConvertToWO(bkg.id)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-racing-500 to-racing-600 hover:from-racing-600 hover:to-racing-700 text-white font-bold shadow-glow transition-all active:scale-95"
                  >
                    <ClipboardList className="w-4 h-4" />
                    <span>Konversi Jadi SPK (Kendaraan Tiba)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal Booking Baru */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-racing-500" />
                Buat Booking Servis Baru
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Catat janji servis pelanggan untuk hari ini atau tanggal mendatang
              </p>

              <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Pelanggan *
                    </label>
                    <input
                      type="text"
                      required
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      placeholder="Nama lengkap"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      No. WhatsApp / HP *
                    </label>
                    <input
                      type="text"
                      required
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Tipe Kendaraan *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setVType('CAR')}
                      className={`p-2 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                        vType === 'CAR'
                          ? 'border-racing-500 bg-racing-500/10 text-racing-500'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      <Car className="w-4 h-4" /> Mobil
                    </button>
                    <button
                      type="button"
                      onClick={() => setVType('MOTORCYCLE')}
                      className={`p-2 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                        vType === 'MOTORCYCLE'
                          ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      <Bike className="w-4 h-4" /> Motor
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nomor Plat Polisi *
                    </label>
                    <input
                      type="text"
                      required
                      value={vPlate}
                      onChange={(e) => setVPlate(e.target.value.toUpperCase())}
                      placeholder="B 1234 ABC"
                      className="w-full font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Merk & Tipe Kendaraan
                    </label>
                    <input
                      type="text"
                      value={vModel}
                      onChange={(e) => setVModel(e.target.value)}
                      placeholder="Toyota Avanza / Honda Vario"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tanggal Kedatangan
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Slot Jam Kedatangan
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    >
                      <option>08:00 - 09:00</option>
                      <option>09:00 - 10:00</option>
                      <option>10:00 - 11:00</option>
                      <option>11:00 - 12:00</option>
                      <option>13:00 - 14:00</option>
                      <option>14:00 - 15:00</option>
                      <option>15:00 - 16:00</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Keluhan & Servis yang Diinginkan *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Ganti oli rutin 10.000 km, cek sistem pengereman, dan tune up mesin"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-racing-500 hover:bg-racing-600 text-white font-bold shadow-glow"
                  >
                    Konfirmasi Booking
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
