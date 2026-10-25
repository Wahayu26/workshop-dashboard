'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  TrendingDown,
  Building2,
  ArrowUpDown,
  Car,
  Bike,
  X,
  Phone,
  Mail,
  Edit2,
  RefreshCw,
} from 'lucide-react';
import { VehicleTypeToggle, VehicleFilter } from '@/components/shared/vehicle-type-toggle';
import { formatRupiah } from '@/lib/utils';

interface SparePartItem {
  id: string;
  partNumber: string;
  name: string;
  brand: string;
  vehicleType: 'CAR' | 'MOTORCYCLE' | 'UNIVERSAL';
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  minStockAlert: number;
  unit: string;
  shelfLocation: string;
  supplierName: string;
}

interface SupplierItem {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  totalPartsSupplied: number;
}

const INITIAL_PARTS: SparePartItem[] = [
  {
    id: 'part-1',
    partNumber: 'LUB-FAST-10W40',
    name: 'Pertamina Fastron Gold SAE 10W-40 (4 Liter)',
    brand: 'Pertamina Lubricants',
    vehicleType: 'CAR',
    category: 'Oli & Pelumas',
    purchasePrice: 280000,
    sellingPrice: 360000,
    stockQuantity: 18,
    minStockAlert: 5,
    unit: 'galon',
    shelfLocation: 'Rak A-01',
    supplierName: 'PT Pertamina Lubricants Dist.',
  },
  {
    id: 'part-2',
    partNumber: 'FLT-AVZ-001',
    name: 'Filter Oli Toyota Avanza / Rush / Xenia Original',
    brand: 'Toyota Genuine Parts',
    vehicleType: 'CAR',
    category: 'Filter',
    purchasePrice: 32000,
    sellingPrice: 48000,
    stockQuantity: 24,
    minStockAlert: 8,
    unit: 'pcs',
    shelfLocation: 'Rak B-04',
    supplierName: 'PT Astra Otoparts Tbk',
  },
  {
    id: 'part-3',
    partNumber: 'LUB-END-MATIC',
    name: 'Pertamina Enduro Matic 10W-30 0.8L',
    brand: 'Pertamina Lubricants',
    vehicleType: 'MOTORCYCLE',
    category: 'Oli & Pelumas',
    purchasePrice: 42000,
    sellingPrice: 55000,
    stockQuantity: 3, // LOW STOCK (Amber alert)
    minStockAlert: 10,
    unit: 'botol',
    shelfLocation: 'Rak M-02',
    supplierName: 'PT Pertamina Lubricants Dist.',
  },
  {
    id: 'part-4',
    partNumber: 'PAD-VAR-CBS',
    name: 'Kampas Rem Cakram Depan Honda Vario 125/150/160',
    brand: 'AHM Genuine Parts',
    vehicleType: 'MOTORCYCLE',
    category: 'Sistem Rem',
    purchasePrice: 45000,
    sellingPrice: 65000,
    stockQuantity: 15,
    minStockAlert: 5,
    unit: 'set',
    shelfLocation: 'Rak M-05',
    supplierName: 'PT Astra Otoparts Tbk',
  },
  {
    id: 'part-5',
    partNumber: 'BAT-GS-NS40Z',
    name: 'Aki GS Astra MF Maintenance Free NS40Z (Mobil)',
    brand: 'GS Astra',
    vehicleType: 'CAR',
    category: 'Aki & Kelistrikan',
    purchasePrice: 680000,
    sellingPrice: 850000,
    stockQuantity: 4,
    minStockAlert: 3,
    unit: 'unit',
    shelfLocation: 'Rak AKI-01',
    supplierName: 'PT Astra Otoparts Tbk',
  },
  {
    id: 'part-6',
    partNumber: 'SPK-NGK-IRID',
    name: 'Busi NGK Iridium CPR9EAIX-9',
    brand: 'NGK Spark Plugs',
    vehicleType: 'UNIVERSAL',
    category: 'Pengapian',
    purchasePrice: 85000,
    sellingPrice: 120000,
    stockQuantity: 0, // OUT OF STOCK (Red alert)
    minStockAlert: 6,
    unit: 'pcs',
    shelfLocation: 'Rak B-01',
    supplierName: 'PT Denso Indonesia',
  },
];

const INITIAL_SUPPLIERS: SupplierItem[] = [
  {
    id: 'sup-1',
    name: 'PT Astra Otoparts Tbk',
    contactPerson: 'Budi Cahyadi',
    phone: '021-4603930',
    email: 'sales@astra-otoparts.com',
    address: 'Jl. Pegangsaan Dua Km. 2.2, Kelapa Gading, Jakarta Utara',
    totalPartsSupplied: 14,
  },
  {
    id: 'sup-2',
    name: 'PT Pertamina Lubricants Dist.',
    contactPerson: 'Agung Wicaksono',
    phone: '021-3815111',
    email: 'distributor@pertaminalubricants.com',
    address: 'Oil Centre Building Lt. 4, Jakarta Pusat',
    totalPartsSupplied: 8,
  },
  {
    id: 'sup-3',
    name: 'PT Denso Indonesia',
    contactPerson: 'Hendro Setiawan',
    phone: '021-8980300',
    email: 'orders@denso.co.id',
    address: 'Kawasan Industri MM2100 Cikarang Barat, Bekasi',
    totalPartsSupplied: 6,
  },
];

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'parts' | 'suppliers'>('parts');
  const [parts, setParts] = useState<SparePartItem[]>(INITIAL_PARTS);
  const [suppliers, setSuppliers] = useState<SupplierItem[]>(INITIAL_SUPPLIERS);
  const [search, setSearch] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter>('ALL');
  const [stockStatusFilter, setStockStatusFilter] = useState<'ALL' | 'LOW' | 'OUT'>('ALL');

  // Modal states
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedPartForAdjust, setSelectedPartForAdjust] = useState<SparePartItem | null>(null);
  const [adjustQty, setAdjustQty] = useState('10');
  const [adjustType, setAdjustType] = useState<'IN' | 'OUT'>('IN');
  const [adjustNotes, setAdjustNotes] = useState('');

  // Add Part Modal
  const [showAddPartModal, setShowAddPartModal] = useState(false);
  const [newPartNumber, setNewPartNumber] = useState('');
  const [newPartName, setNewPartName] = useState('');
  const [newPartBrand, setNewPartBrand] = useState('');
  const [newPartCategory, setNewPartCategory] = useState('Oli & Pelumas');
  const [newPartVType, setNewPartVType] = useState<'CAR' | 'MOTORCYCLE' | 'UNIVERSAL'>('CAR');
  const [newBuyPrice, setNewBuyPrice] = useState('100000');
  const [newSellPrice, setNewSellPrice] = useState('135000');
  const [newStock, setNewStock] = useState('10');
  const [newMinStock, setNewMinStock] = useState('5');
  const [newUnit, setNewUnit] = useState('pcs');
  const [newShelf, setNewShelf] = useState('Rak A-01');

  // Filter logic
  const filteredParts = parts.filter((part) => {
    const matchSearch =
      part.name.toLowerCase().includes(search.toLowerCase()) ||
      part.partNumber.toLowerCase().includes(search.toLowerCase()) ||
      part.brand.toLowerCase().includes(search.toLowerCase());

    const matchVehicle =
      vehicleFilter === 'ALL'
        ? true
        : part.vehicleType === 'UNIVERSAL' || part.vehicleType === vehicleFilter;

    let matchStock = true;
    if (stockStatusFilter === 'OUT') {
      matchStock = part.stockQuantity === 0;
    } else if (stockStatusFilter === 'LOW') {
      matchStock = part.stockQuantity > 0 && part.stockQuantity <= part.minStockAlert;
    }

    return matchSearch && matchVehicle && matchStock;
  });

  const lowStockCount = parts.filter(
    (p) => p.stockQuantity > 0 && p.stockQuantity <= p.minStockAlert,
  ).length;
  const outOfStockCount = parts.filter((p) => p.stockQuantity === 0).length;

  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartForAdjust) return;

    const qty = parseInt(adjustQty, 10) || 0;
    if (qty <= 0) return;

    const updated = parts.map((p) => {
      if (p.id === selectedPartForAdjust.id) {
        const nextStock =
          adjustType === 'IN' ? p.stockQuantity + qty : Math.max(0, p.stockQuantity - qty);
        return { ...p, stockQuantity: nextStock };
      }
      return p;
    });

    setParts(updated);
    setShowAdjustModal(false);
    setSelectedPartForAdjust(null);
  };

  const handleCreatePart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartNumber || !newPartName) return;

    const newPart: SparePartItem = {
      id: `part-${Date.now()}`,
      partNumber: newPartNumber.toUpperCase(),
      name: newPartName,
      brand: newPartBrand || 'Genuine',
      vehicleType: newPartVType,
      category: newPartCategory,
      purchasePrice: parseInt(newBuyPrice, 10) || 50000,
      sellingPrice: parseInt(newSellPrice, 10) || 75000,
      stockQuantity: parseInt(newStock, 10) || 0,
      minStockAlert: parseInt(newMinStock, 10) || 5,
      unit: newUnit,
      shelfLocation: newShelf,
      supplierName: 'PT Astra Otoparts Tbk',
    };

    setParts([newPart, ...parts]);
    setShowAddPartModal(false);
    setNewPartNumber('');
    setNewPartName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-racing-500" />
            Inventori Sparepart & Supplier
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Kelola stok suku cadang, peringatan stok menipis, HPP/harga jual, dan distributor
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setNewPartNumber(`PRT-${Date.now().toString().slice(-5)}`);
              setShowAddPartModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-racing-500 hover:bg-racing-600 text-white font-bold text-xs shadow-glow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Sparepart</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Jenis Part</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {parts.length} SKU
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-emerald-600 font-semibold uppercase flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Stok Aman
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {parts.length - lowStockCount - outOfStockCount} Item
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-amber-500 font-semibold uppercase flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Stok Menipis
          </div>
          <div className="text-2xl font-black text-amber-500 mt-1">
            {lowStockCount} Item
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-rose-500 font-semibold uppercase flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5" /> Stok Habis (Urgent)
          </div>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {outOfStockCount} Item
          </div>
        </div>
      </div>

      {/* Main Tabs (Sparepart vs Supplier) */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('parts')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'parts'
              ? 'border-racing-500 text-racing-600 dark:text-racing-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          Katalog Sparepart ({parts.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('suppliers')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'suppliers'
              ? 'border-racing-500 text-racing-600 dark:text-racing-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Supplier Resmi ({suppliers.length})
        </button>
      </div>

      {activeTab === 'parts' ? (
        <div className="space-y-4">
          {/* Search, Vehicle toggle, and Stock alert filter */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari kode part, nama barang, merk, atau lokasi rak..."
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-racing-500"
                />
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-xs text-slate-500 hidden md:inline">Kesesuaian:</span>
                <VehicleTypeToggle value={vehicleFilter} onChange={setVehicleFilter} />
              </div>
            </div>

            {/* Quick Alert Filters */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 text-[11px] font-semibold">Filter Stok:</span>
              <button
                type="button"
                onClick={() => setStockStatusFilter('ALL')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  stockStatusFilter === 'ALL'
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Semua ({parts.length})
              </button>
              <button
                type="button"
                onClick={() => setStockStatusFilter('LOW')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  stockStatusFilter === 'LOW'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-amber-500/15 text-amber-500 hover:bg-amber-500/25'
                }`}
              >
                Menipis ({lowStockCount})
              </button>
              <button
                type="button"
                onClick={() => setStockStatusFilter('OUT')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  stockStatusFilter === 'OUT'
                    ? 'bg-rose-500 text-white'
                    : 'bg-rose-500/15 text-rose-500 hover:bg-rose-500/25'
                }`}
              >
                Habis ({outOfStockCount})
              </button>
            </div>
          </div>

          {/* Sparepart Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3.5 px-4">Kode Part & Lokasi</th>
                    <th className="py-3.5 px-4">Nama Barang & Brand</th>
                    <th className="py-3.5 px-4">Kategori</th>
                    <th className="py-3.5 px-4 text-right">Harga Beli (HPP)</th>
                    <th className="py-3.5 px-4 text-right">Harga Jual</th>
                    <th className="py-3.5 px-4 text-center">Stok Fisik</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                  {filteredParts.map((p) => {
                    const isOut = p.stockQuantity === 0;
                    const isLow = p.stockQuantity > 0 && p.stockQuantity <= p.minStockAlert;

                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-4 px-4 font-mono">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {p.partNumber}
                          </span>
                          <div className="text-[10px] text-slate-400 font-sans">
                            {p.shelfLocation}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{p.name}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <span>{p.brand}</span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1 font-medium">
                              {p.vehicleType === 'CAR' ? (
                                <Car className="w-3 h-3 text-racing-500" />
                              ) : p.vehicleType === 'MOTORCYCLE' ? (
                                <Bike className="w-3 h-3 text-yellow-500" />
                              ) : (
                                'Universal'
                              )}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                          {p.category}
                        </td>

                        <td className="py-4 px-4 text-right font-mono text-slate-500">
                          {formatRupiah(p.purchasePrice)}
                        </td>

                        <td className="py-4 px-4 text-right font-mono font-bold text-racing-600 dark:text-racing-400">
                          {formatRupiah(p.sellingPrice)}
                        </td>

                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-black border ${
                                isOut
                                  ? 'bg-rose-500/15 text-rose-500 border-rose-500/30'
                                  : isLow
                                  ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                                  : 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                              }`}
                            >
                              {p.stockQuantity} {p.unit}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5">
                              Min: {p.minStockAlert}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPartForAdjust(p);
                              setShowAdjustModal(true);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition-all text-xs"
                          >
                            <RefreshCw className="w-3 h-3 text-racing-500" />
                            <span>Sesuaikan</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Suppliers Tab */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suppliers.map((sup) => (
            <div
              key={sup.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-racing-500/10 text-racing-500 flex items-center justify-center mb-3">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  {sup.name}
                </h3>
                <p className="text-xs text-slate-500 mb-4">PIC: {sup.contactPerson}</p>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{sup.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{sup.email}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2">{sup.address}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Suku Cadang:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {sup.totalPartsSupplied} SKU
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stock Adjustment Modal */}
      <AnimatePresence>
        {showAdjustModal && selectedPartForAdjust && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setShowAdjustModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-racing-500" />
                Penyesuaian Stok Fisik
              </h2>
              <div className="text-xs text-slate-500 mb-4">
                {selectedPartForAdjust.partNumber} - {selectedPartForAdjust.name}
              </div>

              <form onSubmit={handleAdjustStock} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Tipe Mutasi *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAdjustType('IN')}
                      className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                        adjustType === 'IN'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      (+) Masuk / Restock
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdjustType('OUT')}
                      className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                        adjustType === 'OUT'
                          ? 'border-rose-500 bg-rose-500/10 text-rose-500'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      (-) Pengurangan / Rusak
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jumlah ({selectedPartForAdjust.unit}) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Stok saat ini: {selectedPartForAdjust.stockQuantity} {selectedPartForAdjust.unit}
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Catatan Mutasi
                  </label>
                  <input
                    type="text"
                    value={adjustNotes}
                    onChange={(e) => setAdjustNotes(e.target.value)}
                    placeholder="Contoh: Pengiriman DO No. 8812 dari Astra"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAdjustModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-racing-500 hover:bg-racing-600 text-white font-bold shadow-glow"
                  >
                    Update Stok
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Part Modal */}
      <AnimatePresence>
        {showAddPartModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setShowAddPartModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <Package className="w-5 h-5 text-racing-500" />
                Tambah Suku Cadang Baru
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Daftarkan sparepart baru ke inventori bengkel
              </p>

              <form onSubmit={handleCreatePart} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nomor Part (Unik) *
                    </label>
                    <input
                      type="text"
                      required
                      value={newPartNumber}
                      onChange={(e) => setNewPartNumber(e.target.value.toUpperCase())}
                      className="w-full font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Merk / Brand *
                    </label>
                    <input
                      type="text"
                      required
                      value={newPartBrand}
                      onChange={(e) => setNewPartBrand(e.target.value)}
                      placeholder="Pertamina / AHM / Denso"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Sparepart *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPartName}
                    onChange={(e) => setNewPartName(e.target.value)}
                    placeholder="Contoh: Oli Shell Helix HX7 10W-40 4L"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Kategori
                    </label>
                    <select
                      value={newPartCategory}
                      onChange={(e) => setNewPartCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    >
                      <option>Oli & Pelumas</option>
                      <option>Filter</option>
                      <option>Sistem Rem</option>
                      <option>Aki & Kelistrikan</option>
                      <option>Pengapian</option>
                      <option>Ban & Velg</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Kesesuaian Kendaraan
                    </label>
                    <select
                      value={newPartVType}
                      onChange={(e) => setNewPartVType(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    >
                      <option value="CAR">Mobil</option>
                      <option value="MOTORCYCLE">Motor</option>
                      <option value="UNIVERSAL">Universal</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Harga Beli / HPP (Rp) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newBuyPrice}
                      onChange={(e) => setNewBuyPrice(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Harga Jual (Rp) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newSellPrice}
                      onChange={(e) => setNewSellPrice(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Stok Fisik Awal
                    </label>
                    <input
                      type="number"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Batas Min. Alert
                    </label>
                    <input
                      type="number"
                      value={newMinStock}
                      onChange={(e) => setNewMinStock(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Satuan
                    </label>
                    <input
                      type="text"
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      placeholder="pcs / botol / set"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Lokasi Rak Penyimpanan
                  </label>
                  <input
                    type="text"
                    value={newShelf}
                    onChange={(e) => setNewShelf(e.target.value)}
                    placeholder="Contoh: Rak B-02"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddPartModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-racing-500 hover:bg-racing-600 text-white font-bold shadow-glow"
                  >
                    Simpan Sparepart
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
