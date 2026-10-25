'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Car,
  Bike,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Wrench,
  AlertCircle,
  Calendar,
  X,
  CheckCircle2,
} from 'lucide-react';
import { VehicleTypeToggle, VehicleFilter } from '@/components/shared/vehicle-type-toggle';
import { formatDateIndo } from '@/lib/utils';

// Realistic master data
interface VehicleItem {
  id: string;
  vehicleType: 'CAR' | 'MOTORCYCLE';
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  currentMileage: number;
  lastServiceDate?: string;
  nextServiceDueDate?: string;
}

interface CustomerItem {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  createdAt: string;
  vehicles: VehicleItem[];
}

const INITIAL_CUSTOMERS: CustomerItem[] = [
  {
    id: 'cust-1',
    fullName: 'Budi Darmawan',
    phone: '0813-9988-1122',
    email: 'budi@gmail.com',
    address: 'Komp. Buah Batu Regency Blok C-12, Bandung',
    createdAt: '2026-06-10',
    vehicles: [
      {
        id: 'veh-1',
        vehicleType: 'CAR',
        plateNumber: 'B 1452 SKA',
        brand: 'Toyota',
        model: 'Avanza 1.5 Veloz',
        year: 2021,
        currentMileage: 42520,
        lastServiceDate: '2026-08-15',
        nextServiceDueDate: '2026-11-15',
      },
      {
        id: 'veh-2',
        vehicleType: 'MOTORCYCLE',
        plateNumber: 'D 4567 KLA',
        brand: 'Yamaha',
        model: 'NMAX 155 Connected',
        year: 2023,
        currentMileage: 12400,
        lastServiceDate: '2026-09-10',
        nextServiceDueDate: '2026-11-10',
      },
    ],
  },
  {
    id: 'cust-2',
    fullName: 'Dewi Lestari',
    phone: '0857-1234-9988',
    email: 'dewi.lestari@gmail.com',
    address: 'Jl. Tebet Barat Dalam No. 45, Jakarta Selatan',
    createdAt: '2026-07-02',
    vehicles: [
      {
        id: 'veh-3',
        vehicleType: 'CAR',
        plateNumber: 'B 8899 TAY',
        brand: 'Honda',
        model: 'HR-V 1.5 SE',
        year: 2022,
        currentMileage: 28000,
        lastServiceDate: '2026-07-20',
        nextServiceDueDate: '2026-10-20',
      },
    ],
  },
  {
    id: 'cust-3',
    fullName: 'Ahmad Fauzi',
    phone: '0821-8877-6655',
    email: 'fauzi.ahmad@outlook.com',
    address: 'Jl. Dago Asri No. 18, Bandung',
    createdAt: '2026-08-19',
    vehicles: [
      {
        id: 'veh-4',
        vehicleType: 'MOTORCYCLE',
        plateNumber: 'D 3344 BDG',
        brand: 'Honda',
        model: 'Vario 160 CBS',
        year: 2023,
        currentMileage: 8900,
        lastServiceDate: '2026-09-25',
        nextServiceDueDate: '2026-12-25',
      },
    ],
  },
  {
    id: 'cust-4',
    fullName: 'Hendrik Pratama',
    phone: '0812-4455-8899',
    email: 'hendrik.p@gmail.com',
    address: 'Jl. Cempaka Putih Tengah No. 22, Jakarta',
    createdAt: '2026-09-05',
    vehicles: [
      {
        id: 'veh-5',
        vehicleType: 'CAR',
        plateNumber: 'B 2233 PQR',
        brand: 'Mitsubishi',
        model: 'Pajero Sport Dakar 4x2',
        year: 2020,
        currentMileage: 64200,
        lastServiceDate: '2026-08-30',
        nextServiceDueDate: '2026-11-30',
      },
    ],
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>(INITIAL_CUSTOMERS);
  const [search, setSearch] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter>('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);

  // Modal states
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');

  // Add Vehicle form state
  const [vType, setVType] = useState<'CAR' | 'MOTORCYCLE'>('CAR');
  const [vPlate, setVPlate] = useState('');
  const [vBrand, setVBrand] = useState('');
  const [vModel, setVModel] = useState('');
  const [vYear, setVYear] = useState('2022');
  const [vMileage, setVMileage] = useState('30000');

  // Filter logic
  const filteredCustomers = customers.filter((cust) => {
    const query = search.toLowerCase();
    const matchSearch =
      cust.fullName.toLowerCase().includes(query) ||
      cust.phone.includes(query) ||
      (cust.email && cust.email.toLowerCase().includes(query)) ||
      cust.vehicles.some((v) => v.plateNumber.toLowerCase().includes(query));

    const matchVehicle =
      vehicleFilter === 'ALL'
        ? true
        : cust.vehicles.some((v) => v.vehicleType === vehicleFilter);

    return matchSearch && matchVehicle;
  });

  const totalCars = customers.reduce(
    (acc, c) => acc + c.vehicles.filter((v) => v.vehicleType === 'CAR').length,
    0,
  );
  const totalMotors = customers.reduce(
    (acc, c) => acc + c.vehicles.filter((v) => v.vehicleType === 'MOTORCYCLE').length,
    0,
  );

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone) return;

    const newCust: CustomerItem = {
      id: `cust-${Date.now()}`,
      fullName: newCustName,
      phone: newCustPhone,
      email: newCustEmail || undefined,
      address: newCustAddress || undefined,
      createdAt: new Date().toISOString().split('T')[0],
      vehicles: [],
    };

    setCustomers([newCust, ...customers]);
    setShowAddCustomerModal(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustEmail('');
    setNewCustAddress('');
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !vPlate || !vBrand || !vModel) return;

    const newVeh: VehicleItem = {
      id: `veh-${Date.now()}`,
      vehicleType: vType,
      plateNumber: vPlate.toUpperCase().trim(),
      brand: vBrand,
      model: vModel,
      year: parseInt(vYear, 10) || 2022,
      currentMileage: parseInt(vMileage, 10) || 0,
      lastServiceDate: new Date().toISOString().split('T')[0],
    };

    const updated = customers.map((c) => {
      if (c.id === selectedCustomer.id) {
        return {
          ...c,
          vehicles: [...c.vehicles, newVeh],
        };
      }
      return c;
    });

    setCustomers(updated);
    setSelectedCustomer({
      ...selectedCustomer,
      vehicles: [...selectedCustomer.vehicles, newVeh],
    });
    setShowAddVehicleModal(false);
    setVPlate('');
    setVBrand('');
    setVModel('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-racing-500" />
            Data Pelanggan & Kendaraan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Kelola profil pemilik kendaraan, nomor kontak, serta riwayat mobil & motor terdaftar
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddCustomerModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-racing-500 hover:bg-racing-600 text-white font-bold text-xs shadow-glow transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pelanggan</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Pelanggan</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {customers.length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-racing-500" /> Mobil Terdaftar
          </div>
          <div className="text-2xl font-black text-racing-600 dark:text-racing-400 mt-1">
            {totalCars} Unit
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-1.5">
            <Bike className="w-3.5 h-3.5 text-yellow-500" /> Motor Terdaftar
          </div>
          <div className="text-2xl font-black text-yellow-600 dark:text-yellow-400 mt-1">
            {totalMotors} Unit
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Kendaraan</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalCars + totalMotors} Unit
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama pelanggan, nomor WhatsApp, atau plat nomor (B 1452 SKA)..."
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-racing-500"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-slate-500 hidden md:inline">Filter:</span>
          <VehicleTypeToggle value={vehicleFilter} onChange={setVehicleFilter} />
        </div>
      </div>

      {/* Customers List / Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="py-3.5 px-4">Nama Pelanggan</th>
                <th className="py-3.5 px-4">Kontak (WhatsApp / Email)</th>
                <th className="py-3.5 px-4">Alamat Domisili</th>
                <th className="py-3.5 px-4">Kendaraan Terdaftar</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                    Tidak ada pelanggan yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                      {cust.fullName}
                      <div className="text-[10px] text-slate-400 font-normal">
                        Terdaftar sejak: {formatDateIndo(cust.createdAt)}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Phone className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{cust.phone}</span>
                      </div>
                      {cust.email && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{cust.email}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 max-w-xs text-slate-500 dark:text-slate-400 truncate">
                      {cust.address ? (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          <span className="truncate">{cust.address}</span>
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {cust.vehicles.map((v) => (
                          <span
                            key={v.id}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold border ${
                              v.vehicleType === 'CAR'
                                ? 'bg-racing-500/10 text-racing-600 dark:text-racing-400 border-racing-500/20'
                                : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20'
                            }`}
                          >
                            {v.vehicleType === 'CAR' ? (
                              <Car className="w-3 h-3" />
                            ) : (
                              <Bike className="w-3 h-3" />
                            )}
                            <span className="font-mono">{v.plateNumber}</span>
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedCustomer(cust)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition-all"
                      >
                        <span>Detail & Kendaraan</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer / Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-racing-500/15 text-racing-500 flex items-center justify-center font-black text-lg">
                  {selectedCustomer.fullName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedCustomer.fullName}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span>{selectedCustomer.phone}</span>
                    {selectedCustomer.email && <span>• {selectedCustomer.email}</span>}
                  </div>
                </div>
              </div>

              {selectedCustomer.address && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300 mb-6 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-racing-500 shrink-0 mt-0.5" />
                  <span>{selectedCustomer.address}</span>
                </div>
              )}

              {/* Vehicle List */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Car className="w-4 h-4 text-racing-500" />
                  Daftar Kendaraan Terdaftar ({selectedCustomer.vehicles.length})
                </h3>

                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-racing-500 hover:bg-racing-600 text-white font-bold text-xs transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Kendaraan
                </button>
              </div>

              <div className="space-y-3">
                {selectedCustomer.vehicles.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">
                    Belum ada kendaraan terdaftar untuk pelanggan ini.
                  </p>
                ) : (
                  selectedCustomer.vehicles.map((v) => (
                    <div
                      key={v.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            v.vehicleType === 'CAR'
                              ? 'bg-racing-500/15 text-racing-500'
                              : 'bg-yellow-500/15 text-yellow-500'
                          }`}
                        >
                          {v.vehicleType === 'CAR' ? (
                            <Car className="w-5 h-5" />
                          ) : (
                            <Bike className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                              {v.plateNumber}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              {v.vehicleType === 'CAR' ? 'Mobil' : 'Motor'}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                            {v.brand} {v.model} ({v.year})
                          </div>
                        </div>
                      </div>

                      <div className="text-right sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-slate-700">
                        <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                          {v.currentMileage.toLocaleString()} KM
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Servis Terakhir: {formatDateIndo(v.lastServiceDate)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Tambah Pelanggan Baru */}
      <AnimatePresence>
        {showAddCustomerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setShowAddCustomerModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-racing-500" />
                Registrasi Pelanggan Baru
              </h2>

              <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="Contoh: Raditya Maulana"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor WhatsApp / HP *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    placeholder="Contoh: 0812-9876-5432"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email (Opsional)
                  </label>
                  <input
                    type="email"
                    value={newCustEmail}
                    onChange={(e) => setNewCustEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Alamat Domisili
                  </label>
                  <textarea
                    rows={2}
                    value={newCustAddress}
                    onChange={(e) => setNewCustAddress(e.target.value)}
                    placeholder="Alamat lengkap tempat tinggal"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCustomerModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-racing-500 hover:bg-racing-600 text-white font-bold shadow-glow"
                  >
                    Simpan Pelanggan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Tambah Kendaraan */}
      <AnimatePresence>
        {showAddVehicleModal && selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setShowAddVehicleModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Car className="w-5 h-5 text-racing-500" />
                Tambah Kendaraan: {selectedCustomer.fullName}
              </h2>
              <p className="text-xs text-slate-500 mb-4">Daftarkan mobil atau motor baru milik pelanggan ini</p>

              <form onSubmit={handleAddVehicle} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Jenis Kendaraan *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setVType('CAR')}
                      className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
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
                      className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                        vType === 'MOTORCYCLE'
                          ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      <Bike className="w-4 h-4" /> Motor
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor Plat Polisi *
                  </label>
                  <input
                    type="text"
                    required
                    value={vPlate}
                    onChange={(e) => setVPlate(e.target.value.toUpperCase())}
                    placeholder="Contoh: B 1234 XYZ"
                    className="w-full font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Merk (Brand) *
                    </label>
                    <input
                      type="text"
                      required
                      value={vBrand}
                      onChange={(e) => setVBrand(e.target.value)}
                      placeholder="Toyota / Honda / Yamaha"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Model / Tipe *
                    </label>
                    <input
                      type="text"
                      required
                      value={vModel}
                      onChange={(e) => setVModel(e.target.value)}
                      placeholder="Avanza / Vario 160"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tahun Pembuatan
                    </label>
                    <input
                      type="number"
                      value={vYear}
                      onChange={(e) => setVYear(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Odometer (KM Masuk)
                    </label>
                    <input
                      type="number"
                      value={vMileage}
                      onChange={(e) => setVMileage(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddVehicleModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-racing-500 hover:bg-racing-600 text-white font-bold shadow-glow"
                  >
                    Tambahkan Kendaraan
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
