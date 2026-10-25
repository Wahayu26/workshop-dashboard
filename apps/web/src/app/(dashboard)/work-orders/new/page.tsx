'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  Car,
  Bike,
  User,
  Wrench,
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewWorkOrderPage() {
  const router = useRouter();

  const [vType, setVType] = useState<'CAR' | 'MOTORCYCLE'>('CAR');
  const [customerName, setCustomerName] = useState('Budi Darmawan');
  const [customerPhone, setCustomerPhone] = useState('0813-9988-1122');
  const [vehiclePlate, setVehiclePlate] = useState('B 1452 SKA');
  const [vehicleModel, setVehicleModel] = useState('Toyota Avanza 1.5 Veloz');
  const [entryMileage, setEntryMileage] = useState('42520');
  const [priority, setPriority] = useState<'NORMAL' | 'URGENT'>('NORMAL');
  const [complaint, setComplaint] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [mechanicId, setMechanicId] = useState('Agus Santoso (MEK-001)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/work-orders/wo-1');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/work-orders"
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-racing-500" />
            Penerbitan Surat Perintah Kerja (SPK) Baru
          </h1>
          <p className="text-xs text-slate-500">
            Formulir penerimaan servis masuk kendaraan mobil & motor
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Tipe Kendaraan */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Jenis Kendaraan Masuk *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setVType('CAR')}
                className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                  vType === 'CAR'
                    ? 'border-racing-500 bg-racing-500/10 text-racing-500 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500'
                }`}
              >
                <Car className="w-5 h-5" /> Servis Mobil
              </button>
              <button
                type="button"
                onClick={() => setVType('MOTORCYCLE')}
                className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                  vType === 'MOTORCYCLE'
                    ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500'
                }`}
              >
                <Bike className="w-5 h-5" /> Servis Motor
              </button>
            </div>
          </div>

          {/* Customer & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Pemilik Kendaraan *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
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
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nomor Plat Polisi *
              </label>
              <input
                type="text"
                required
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                className="w-full font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Merk & Model Kendaraan *
              </label>
              <input
                type="text"
                required
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                KM Odometer Masuk *
              </label>
              <input
                type="number"
                required
                value={entryMileage}
                onChange={(e) => setEntryMileage(e.target.value)}
                className="w-full font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Mechanic Assignment & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tugaskan Mekanik
              </label>
              <select
                value={mechanicId}
                onChange={(e) => setMechanicId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
              >
                <option>Agus Santoso (MEK-001) - Mobil</option>
                <option>Hendra Wijaya (MEK-002) - Motor Matic</option>
                <option>Dedi Kurniawan (MEK-003) - AC & Kelistrikan</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tingkat Prioritas
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
              >
                <option value="NORMAL">Normal (Antrian Standar)</option>
                <option value="URGENT">Urgent (Prioritas Cepat / Darurat)</option>
              </select>
            </div>
          </div>

          {/* Keluhan & Diagnosa */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Keluhan Pelanggan *
            </label>
            <textarea
              rows={2}
              required
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              placeholder="Jelaskan kendala yang dirasakan pelanggan secara detail..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Hasil Diagnosa Awal Service Advisor / SA (Opsional)
            </label>
            <textarea
              rows={2}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Catatan inspeksi fisik awal di stall penerimaan..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/work-orders"
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-racing-500 to-racing-600 hover:from-racing-600 hover:to-racing-700 text-white font-bold shadow-glow transition-all active:scale-95 flex items-center gap-2"
            >
              <span>Terbitkan SPK & Mulai Servis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
