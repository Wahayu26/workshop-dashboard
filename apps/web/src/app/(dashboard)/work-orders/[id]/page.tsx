'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  Car,
  Bike,
  CheckCircle2,
  Clock,
  Wrench,
  User,
  ShieldCheck,
  Plus,
  Trash2,
  DollarSign,
  ArrowRight,
  ChevronLeft,
  Receipt,
  AlertTriangle,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { formatRupiah, formatDateTimeIndo } from '@/lib/utils';

export type WOStage =
  | 'PENDING'
  | 'DIAGNOSING'
  | 'IN_PROGRESS'
  | 'QC'
  | 'COMPLETED'
  | 'PAID';

const STAGES: { key: WOStage; label: string; desc: string }[] = [
  { key: 'PENDING', label: 'Menunggu', desc: 'Antrian registrasi' },
  { key: 'DIAGNOSING', label: 'Diagnosa', desc: 'Inspeksi awal' },
  { key: 'IN_PROGRESS', label: 'Dikerjakan', desc: 'Pengerjaan mekanik' },
  { key: 'QC', label: 'QC & Test', desc: 'Uji coba jalan' },
  { key: 'COMPLETED', label: 'Selesai', desc: 'Siap bayar/ambil' },
  { key: 'PAID', label: 'Lunas', desc: 'Invoice kasir' },
];

export default function WorkOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const woId = params?.id as string;

  // Work order state
  const [currentStage, setCurrentStage] = useState<WOStage>('IN_PROGRESS');
  const [items, setItems] = useState([
    {
      id: 'item-1',
      type: 'SERVICE',
      name: 'Jasa Ganti Oli Mesin & 15 Titik Cek',
      qty: 1,
      price: 50000,
      discount: 0,
    },
    {
      id: 'item-2',
      type: 'SERVICE',
      name: 'Tune Up Mesin (Carbon Cleaner + Busi + Throttle Body)',
      qty: 1,
      price: 350000,
      discount: 25000,
    },
    {
      id: 'item-3',
      type: 'SPARE_PART',
      name: 'Pertamina Fastron Gold SAE 10W-40 (4 Liter)',
      qty: 1,
      price: 360000,
      discount: 0,
    },
    {
      id: 'item-4',
      type: 'SPARE_PART',
      name: 'Filter Oli Toyota Avanza / Rush Original',
      qty: 1,
      price: 48000,
      discount: 0,
    },
  ]);

  // QC inspection state
  const [qcNotes, setQcNotes] = useState('Uji jalan tarikan enteng, rem belakang sudah tidak berdecit.');
  const [qcPassed, setQcPassed] = useState(true);

  // Modal add item state
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItemType, setNewItemType] = useState<'SERVICE' | 'SPARE_PART'>('SERVICE');
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('50000');
  const [newItemQty, setNewItemQty] = useState('1');

  // Calculations
  const subtotalServices = items
    .filter((i) => i.type === 'SERVICE')
    .reduce((sum, i) => sum + i.price * i.qty - i.discount, 0);

  const subtotalParts = items
    .filter((i) => i.type === 'SPARE_PART')
    .reduce((sum, i) => sum + i.price * i.qty - i.discount, 0);

  const totalAmount = subtotalServices + subtotalParts;

  const currentStageIndex = STAGES.findIndex((s) => s.key === currentStage);

  const handleNextStage = () => {
    if (currentStageIndex < STAGES.length - 1) {
      setCurrentStage(STAGES[currentStageIndex + 1].key);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;

    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        type: newItemType,
        name: newItemName,
        qty: parseInt(newItemQty, 10) || 1,
        price: parseInt(newItemPrice, 10) || 0,
        discount: 0,
      },
    ]);
    setShowAddItemModal(false);
    setNewItemName('');
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Back and Status Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/work-orders"
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                WO-20261025-001
              </h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-racing-500/15 text-racing-600 dark:text-racing-400 border border-racing-500/30">
                Prioritas: Normal
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Dibuat: {formatDateTimeIndo('2026-10-25T09:15:00')} oleh Admin
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentStage !== 'PAID' && (
            <button
              type="button"
              onClick={handleNextStage}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-racing-500 to-racing-600 hover:from-racing-600 hover:to-racing-700 text-white font-bold text-xs shadow-glow transition-all active:scale-95"
            >
              <span>Majukan ke Tahap: {STAGES[Math.min(STAGES.length - 1, currentStageIndex + 1)].label}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {currentStage === 'COMPLETED' && (
            <Link
              href="/pos"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-glow transition-all active:scale-95"
            >
              <Receipt className="w-4 h-4" />
              <span>Buka Kasir & Bayar</span>
            </Link>
          )}
        </div>
      </div>

      {/* Visual Animated Stepper */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-card">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Progres Alur Pengerjaan Servis
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 relative">
          {STAGES.map((st, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div
                key={st.key}
                onClick={() => setCurrentStage(st.key)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  isCurrent
                    ? 'border-racing-500 bg-racing-500/10 shadow-sm'
                    : isCompleted
                    ? 'border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-slate-400">0{idx + 1}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : isCurrent ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-racing-500 animate-ping inline-block" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">{st.label}</div>
                <div className="text-[10px] text-slate-500 truncate">{st.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Grid: Info Pelanggan, Kendaraan & Mekanik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Kendaraan */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-card">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            <Car className="w-4 h-4 text-racing-500" />
            Kendaraan Servis
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-base font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
              B 1452 SKA
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-racing-500/15 text-racing-600 dark:text-racing-400">
              Mobil
            </span>
          </div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Toyota Avanza 1.5 Veloz (2021)
          </div>
          <div className="text-xs text-slate-500 mt-1">
            KM Odometer Masuk:{' '}
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
              42.520 KM
            </span>
          </div>
        </div>

        {/* Card 2: Pelanggan */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-card">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            <User className="w-4 h-4 text-racing-500" />
            Pemilik Kendaraan
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white">
            Budi Darmawan
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            0813-9988-1122 (WhatsApp)
          </div>
          <div className="text-xs text-slate-500 mt-1 truncate">
            Komp. Buah Batu Regency Blok C-12, Bandung
          </div>
        </div>

        {/* Card 3: Mekanik Penanggung Jawab */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-card">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            <Wrench className="w-4 h-4 text-racing-500" />
            Teknisi / Mekanik
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              MEK-001
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-white">
              Agus Santoso
            </span>
          </div>
          <div className="text-xs text-slate-500">Spesialisasi: Mobil Umum & Mesin Bensin</div>
          <div className="text-xs text-amber-500 font-bold mt-1">Rating Mekanik: ⭐ 4.9 / 5.0</div>
        </div>
      </div>

      {/* Keluhan & QC Inspection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-card">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Keluhan Pelanggan & Diagnosa Awal
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            Tarikan mesin terasa berat terutama saat tanjakan, ganti oli rutin 40.000 KM dan rem
            belakang agak berdecit saat pengereman pelan.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Catatan QC & Uji Coba Jalan
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500">
              QC Lolos (Passed)
            </span>
          </div>
          <textarea
            rows={2}
            value={qcNotes}
            onChange={(e) => setQcNotes(e.target.value)}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-racing-500"
          />
        </div>
      </div>

      {/* Work Order Items (Jasa Servis & Sparepart) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-racing-500" />
              Rincian Pekerjaan & Suku Cadang Terpakai
            </h2>
            <p className="text-xs text-slate-500">
              Item jasa servis dan sparepart yang dimasukkan ke tagihan SPK ini
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddItemModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-racing-500 hover:bg-racing-600 text-white font-bold text-xs shadow-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Item</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4">Tipe Item</th>
                <th className="py-3 px-4">Deskripsi Pekerjaan / Sparepart</th>
                <th className="py-3 px-4 text-center">Jumlah</th>
                <th className="py-3 px-4 text-right">Harga Satuan</th>
                <th className="py-3 px-4 text-right">Diskon</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {items.map((it) => {
                const lineTotal = it.price * it.qty - it.discount;
                return (
                  <tr
                    key={it.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          it.type === 'SERVICE'
                            ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {it.type === 'SERVICE' ? 'Jasa Servis' : 'Sparepart'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {it.name}
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold">{it.qty}</td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-slate-400">
                      {formatRupiah(it.price)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-rose-500">
                      {it.discount > 0 ? `-${formatRupiah(it.discount)}` : '-'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatRupiah(lineTotal)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(it.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                        aria-label="Hapus item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals Summary Footer */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Jasa: <span className="font-bold text-slate-900 dark:text-white">{formatRupiah(subtotalServices)}</span>{' '}
            • Sparepart: <span className="font-bold text-slate-900 dark:text-white">{formatRupiah(subtotalParts)}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Tagihan SPK:
            </span>
            <span className="text-2xl font-black text-racing-600 dark:text-racing-400 font-mono">
              {formatRupiah(totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Modal Tambah Item Baru */}
      <AnimatePresence>
        {showAddItemModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setShowAddItemModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <Plus className="w-5 h-5 text-racing-500" />
                Tambah Pekerjaan / Sparepart
              </h2>
              <p className="text-xs text-slate-500 mb-4">Tambahkan item ke SPK WO-20261025-001</p>

              <form onSubmit={handleAddItem} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Tipe Item *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewItemType('SERVICE')}
                      className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                        newItemType === 'SERVICE'
                          ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      <Wrench className="w-4 h-4" /> Jasa Servis
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewItemType('SPARE_PART')}
                      className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                        newItemType === 'SPARE_PART'
                          ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      <Car className="w-4 h-4" /> Suku Cadang
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Item / Pekerjaan *
                  </label>
                  <input
                    type="text"
                    required
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Contoh: Kampas Rem Belakang Tromol"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Harga Satuan (Rp) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Jumlah (Qty) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newItemQty}
                      onChange={(e) => setNewItemQty(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddItemModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-racing-500 hover:bg-racing-600 text-white font-bold shadow-glow"
                  >
                    Tambahkan ke SPK
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
