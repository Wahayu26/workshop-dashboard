'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench,
  Car,
  Bike,
  Plus,
  Search,
  Clock,
  Sparkles,
  Droplets,
  Disc,
  Wind,
  BatteryCharging,
  Cog,
  CheckCircle2,
  X,
  Edit2,
  Trash2,
} from 'lucide-react';
import { VehicleTypeToggle, VehicleFilter } from '@/components/shared/vehicle-type-toggle';
import { formatRupiah } from '@/lib/utils';

interface ServiceItem {
  id: string;
  code: string;
  name: string;
  category: string;
  categoryIcon: string;
  vehicleType: 'CAR' | 'MOTORCYCLE' | 'ALL';
  basePrice: number;
  estimatedDurationMinutes: number;
  description: string;
  isActive: boolean;
}

const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    code: 'SRV-MOB-001',
    name: 'Jasa Ganti Oli Mesin Mobil & 15 Titik Cek',
    category: 'Ganti Oli & Pelumas',
    categoryIcon: 'Droplets',
    vehicleType: 'CAR',
    basePrice: 50000,
    estimatedDurationMinutes: 30,
    description: 'Kuras oli lama, pasang oli baru & filter, cek 15 titik keselamatan berkendara',
    isActive: true,
  },
  {
    id: 'srv-2',
    code: 'SRV-MOB-002',
    name: 'Tune Up Mesin Mobil (Carbon Cleaner + Busi + Throttle Body)',
    category: 'Tune Up & Servis',
    categoryIcon: 'Wrench',
    vehicleType: 'CAR',
    basePrice: 350000,
    estimatedDurationMinutes: 90,
    description: 'Pembersihan ruang bakar piston, cek pengapian busi, kalibrasi scanner OBD2',
    isActive: true,
  },
  {
    id: 'srv-3',
    code: 'SRV-MOB-003',
    name: 'Servis AC Mobil Komplit & Flushing Freon R134a',
    category: 'AC Mobil',
    categoryIcon: 'Wind',
    vehicleType: 'CAR',
    basePrice: 450000,
    estimatedDurationMinutes: 120,
    description: 'Pembersihan blower evaporator, ganti oli kompresor ND-8 & isi freon murni',
    isActive: true,
  },
  {
    id: 'srv-4',
    code: 'SRV-MOB-004',
    name: 'Servis Rem 4 Roda & Bubut Piringan Cakram',
    category: 'Sistem Pengereman',
    categoryIcon: 'Disc',
    vehicleType: 'CAR',
    basePrice: 280000,
    estimatedDurationMinutes: 60,
    description: 'Bongkar kaliper rem, bersihkan kampas, bleeding minyak rem & ratakan piringan',
    isActive: true,
  },
  {
    id: 'srv-5',
    code: 'SRV-MOT-001',
    name: 'Jasa Ganti Oli Mesin + Oli Gardan Motor',
    category: 'Ganti Oli & Pelumas',
    categoryIcon: 'Droplets',
    vehicleType: 'MOTORCYCLE',
    basePrice: 20000,
    estimatedDurationMinutes: 20,
    description: 'Ganti oli mesin & transmisi gardan matic, cek tekanan angin & setel rem',
    isActive: true,
  },
  {
    id: 'srv-6',
    code: 'SRV-MOT-002',
    name: 'Servis CVT Komplit Matic & Penggantian Greasing',
    category: 'CVT & Transmisi Motor',
    categoryIcon: 'Cog',
    vehicleType: 'MOTORCYCLE',
    basePrice: 85000,
    estimatedDurationMinutes: 45,
    description: 'Bongkar CVT, bersihkan debu mangkok kopling, cek roller, v-belt & beri grease high-temp',
    isActive: true,
  },
  {
    id: 'srv-7',
    code: 'SRV-MOT-003',
    name: 'Tune Up Injeksi Motor (Ultrasonic Injector Cleaner)',
    category: 'Tune Up & Servis',
    categoryIcon: 'Wrench',
    vehicleType: 'MOTORCYCLE',
    basePrice: 95000,
    estimatedDurationMinutes: 40,
    description: 'Pembersihan injector dengan mesin ultrasonic, cek busi & reset ECU diagnostik',
    isActive: true,
  },
  {
    id: 'srv-8',
    code: 'SRV-ALL-001',
    name: 'Cek Kelistrikan & Uji Kapasitas Aki (Battery Test)',
    category: 'Kelistrikan & Aki',
    categoryIcon: 'BatteryCharging',
    vehicleType: 'ALL',
    basePrice: 35000,
    estimatedDurationMinutes: 20,
    description: 'Uji tegangan CCA (Cold Cranking Amps) aki, cek sistem pengisian dinamo alternator',
    isActive: true,
  },
];

const CATEGORIES = [
  'Semua Kategori',
  'Ganti Oli & Pelumas',
  'Tune Up & Servis',
  'Sistem Pengereman',
  'AC Mobil',
  'CVT & Transmisi Motor',
  'Kelistrikan & Aki',
];

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [search, setSearch] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter>('ALL');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [showAddModal, setShowAddModal] = useState(false);

  // New service form state
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORIES[1]);
  const [newVType, setNewVType] = useState<'CAR' | 'MOTORCYCLE' | 'ALL'>('CAR');
  const [newPrice, setNewPrice] = useState('100000');
  const [newDuration, setNewDuration] = useState('45');
  const [newDesc, setNewDesc] = useState('');

  const filteredServices = services.filter((srv) => {
    const matchSearch =
      srv.name.toLowerCase().includes(search.toLowerCase()) ||
      srv.code.toLowerCase().includes(search.toLowerCase()) ||
      srv.description.toLowerCase().includes(search.toLowerCase());

    const matchVehicle =
      vehicleFilter === 'ALL'
        ? true
        : srv.vehicleType === 'ALL' || srv.vehicleType === vehicleFilter;

    const matchCategory =
      selectedCategory === 'Semua Kategori' || srv.category === selectedCategory;

    return matchSearch && matchVehicle && matchCategory;
  });

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName) return;

    const newSrv: ServiceItem = {
      id: `srv-${Date.now()}`,
      code: newCode.toUpperCase(),
      name: newName,
      category: newCategory,
      categoryIcon: 'Wrench',
      vehicleType: newVType,
      basePrice: parseInt(newPrice, 10) || 50000,
      estimatedDurationMinutes: parseInt(newDuration, 10) || 30,
      description: newDesc,
      isActive: true,
    };

    setServices([newSrv, ...services]);
    setShowAddModal(false);
    setNewCode('');
    setNewName('');
    setNewDesc('');
  };

  const toggleServiceActive = (id: string) => {
    setServices(
      services.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-racing-500" />
            Layanan Servis & Tarif Jasa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Katalog jasa perawatan dan perbaikan berkala untuk mobil dan motor
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setNewCode(`SRV-${Date.now().toString().slice(-4)}`);
            setShowAddModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-racing-500 hover:bg-racing-600 text-white font-bold text-xs shadow-glow transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Layanan Baru</span>
        </button>
      </div>

      {/* Filter and Category Chips */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kode jasa, nama layanan, atau deskripsi teknis..."
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-racing-500"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-slate-500 hidden md:inline">Tipe Kendaraan:</span>
            <VehicleTypeToggle value={vehicleFilter} onChange={setVehicleFilter} />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((srv) => (
          <motion.div
            key={srv.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between ${
              srv.isActive
                ? 'border-slate-200 dark:border-slate-800 shadow-sm hover:border-racing-500/50'
                : 'border-slate-200/50 dark:border-slate-800/50 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  {srv.code}
                </span>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      srv.vehicleType === 'CAR'
                        ? 'bg-racing-500/15 text-racing-600 dark:text-racing-400'
                        : srv.vehicleType === 'MOTORCYCLE'
                        ? 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400'
                        : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {srv.vehicleType === 'CAR' ? (
                      <>
                        <Car className="w-3 h-3" /> Mobil
                      </>
                    ) : srv.vehicleType === 'MOTORCYCLE' ? (
                      <>
                        <Bike className="w-3 h-3" /> Motor
                      </>
                    ) : (
                      'Semua'
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleServiceActive(srv.id)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      srv.isActive
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-500/15 text-slate-500'
                    }`}
                  >
                    {srv.isActive ? 'Aktif' : 'Nonaktif'}
                  </button>
                </div>
              </div>

              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 leading-snug">
                {srv.name}
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                {srv.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {srv.estimatedDurationMinutes} Menit
                </div>
                <div className="text-base font-black text-racing-600 dark:text-racing-400 mt-0.5">
                  {formatRupiah(srv.basePrice)}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  aria-label="Edit layanan"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Tambah Layanan Baru */}
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
                <Wrench className="w-5 h-5 text-racing-500" />
                Tambah Layanan Jasa Baru
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Daftarkan paket servis atau pekerjaan bengkel ke katalog
              </p>

              <form onSubmit={handleCreateService} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Kode Jasa *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                      className="w-full font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Kategori *
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    >
                      {CATEGORIES.filter((c) => c !== 'Semua Kategori').map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Layanan / Pekerjaan *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Contoh: Kuras & Flushing Minyak Rem Dot 4"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Tipe Kendaraan *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewVType('CAR')}
                      className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition-all ${
                        newVType === 'CAR'
                          ? 'border-racing-500 bg-racing-500/10 text-racing-500'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      <Car className="w-3.5 h-3.5" /> Mobil
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewVType('MOTORCYCLE')}
                      className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition-all ${
                        newVType === 'MOTORCYCLE'
                          ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      <Bike className="w-3.5 h-3.5" /> Motor
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewVType('ALL')}
                      className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition-all ${
                        newVType === 'ALL'
                          ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      Semua
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tarif Dasar (Rp) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Estimasi Durasi (Menit) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Deskripsi Pekerjaan Teknis
                  </label>
                  <textarea
                    rows={2}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Rincian bagian yang dicek atau dibersihkan..."
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
                    Simpan Layanan
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
