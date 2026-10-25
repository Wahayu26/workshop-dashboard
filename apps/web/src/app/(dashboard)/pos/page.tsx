'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Receipt,
  Car,
  Bike,
  Plus,
  Trash2,
  DollarSign,
  CreditCard,
  QrCode,
  Banknote,
  Building,
  CheckCircle2,
  Printer,
  Download,
  X,
  Search,
  Wrench,
  Package,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ClipboardList,
} from 'lucide-react';
import { formatRupiah, formatDateTimeIndo } from '@/lib/utils';

interface POSItem {
  id: string;
  type: 'SERVICE' | 'SPARE_PART';
  name: string;
  qty: number;
  price: number;
}

interface ReadyWO {
  id: string;
  woNumber: string;
  customerName: string;
  customerPhone: string;
  vehiclePlate: string;
  vehicleModel: string;
  vehicleType: 'CAR' | 'MOTORCYCLE';
  items: POSItem[];
}

const READY_WOS: ReadyWO[] = [
  {
    id: 'wo-1',
    woNumber: 'WO-20261025-001',
    customerName: 'Budi Darmawan',
    customerPhone: '0813-9988-1122',
    vehiclePlate: 'B 1452 SKA',
    vehicleModel: 'Toyota Avanza 1.5 Veloz',
    vehicleType: 'CAR',
    items: [
      { id: 'i1', type: 'SERVICE', name: 'Jasa Ganti Oli & 15 Titik Cek', qty: 1, price: 50000 },
      { id: 'i2', type: 'SERVICE', name: 'Tune Up Mesin (Carbon Cleaner)', qty: 1, price: 325000 },
      { id: 'i3', type: 'SPARE_PART', name: 'Pertamina Fastron Gold 10W-40 (4L)', qty: 1, price: 360000 },
      { id: 'i4', type: 'SPARE_PART', name: 'Filter Oli Avanza Original', qty: 1, price: 48000 },
    ],
  },
  {
    id: 'wo-2',
    woNumber: 'WO-20261025-002',
    customerName: 'Ahmad Fauzi',
    customerPhone: '0821-8877-6655',
    vehiclePlate: 'D 3344 BDG',
    vehicleModel: 'Honda Vario 160 CBS',
    vehicleType: 'MOTORCYCLE',
    items: [
      { id: 'i5', type: 'SERVICE', name: 'Servis CVT Komplit Matic & Greasing', qty: 1, price: 85000 },
      { id: 'i6', type: 'SERVICE', name: 'Jasa Ganti Oli Mesin & Gardan', qty: 1, price: 20000 },
      { id: 'i7', type: 'SPARE_PART', name: 'Enduro Matic 10W-30 0.8L', qty: 1, price: 55000 },
    ],
  },
];

export default function POSPage() {
  const [selectedWO, setSelectedWO] = useState<ReadyWO | null>(READY_WOS[0]);
  const [cartItems, setCartItems] = useState<POSItem[]>(READY_WOS[0].items);
  const [discount, setDiscount] = useState<number>(0);
  const [applyTax, setApplyTax] = useState<boolean>(true);

  // Payment states
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'TRANSFER' | 'QRIS'>('CASH');
  const [cashReceived, setCashReceived] = useState<string>('800000');
  const [bankTarget, setBankTarget] = useState<string>('BCA');
  const [transferRef, setTransferRef] = useState<string>('');

  // Receipt print modal state
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [completedInvoice, setCompletedInvoice] = useState<any>(null);

  // Calculations
  const subtotalServices = cartItems
    .filter((i) => i.type === 'SERVICE')
    .reduce((sum, i) => sum + i.price * i.qty, 0);

  const subtotalParts = cartItems
    .filter((i) => i.type === 'SPARE_PART')
    .reduce((sum, i) => sum + i.price * i.qty, 0);

  const subtotal = subtotalServices + subtotalParts;
  const taxableAmount = Math.max(0, subtotal - discount);
  const taxAmount = applyTax ? Math.round(taxableAmount * 0.11) : 0;
  const grandTotal = taxableAmount + taxAmount;

  const cashReceivedNum = parseInt(cashReceived, 10) || 0;
  const changeAmount = Math.max(0, cashReceivedNum - grandTotal);

  const handleSelectWO = (wo: ReadyWO) => {
    setSelectedWO(wo);
    setCartItems(wo.items);
    setCashReceived(String(Math.ceil((wo.items.reduce((s, i) => s + i.price * i.qty, 0) * 1.11) / 10000) * 10000));
  };

  const handleProcessPayment = () => {
    const invNumber = `INV-${Date.now().toString().slice(-6)}`;
    const invoiceData = {
      invoiceNumber: invNumber,
      woNumber: selectedWO?.woNumber || 'PENJUALAN-LANGSUNG',
      customerName: selectedWO?.customerName || 'Pelanggan Umum',
      vehiclePlate: selectedWO?.vehiclePlate || '-',
      vehicleModel: selectedWO?.vehicleModel || '-',
      items: cartItems,
      subtotalServices,
      subtotalParts,
      discount,
      taxAmount,
      grandTotal,
      paymentMethod,
      cashReceived: paymentMethod === 'CASH' ? cashReceivedNum : grandTotal,
      changeAmount: paymentMethod === 'CASH' ? changeAmount : 0,
      paidAt: new Date().toISOString(),
    };

    setCompletedInvoice(invoiceData);
    setShowPaymentModal(false);
    setShowReceiptModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-racing-500" />
            Kasir Cepat & Penagihan (POS Bengkel)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Terbitkan invoice dari SPK selesai, kalkulasi PPN 11%, dan cetak struk kasir thermal
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPaymentModal(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-racing-500 to-racing-600 hover:from-racing-600 hover:to-racing-700 text-white font-extrabold text-sm shadow-glow transition-all active:scale-95"
        >
          <DollarSign className="w-5 h-5" />
          <span>Proses Pembayaran ({formatRupiah(grandTotal)})</span>
        </button>
      </div>

      {/* Main Grid: Left SPK Selection vs Right Bill Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): SPK Siap Bayar List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4 text-racing-500" />
              Pilih SPK Siap Ditagihkan ({READY_WOS.length})
            </h2>

            <div className="space-y-2.5">
              {READY_WOS.map((wo) => {
                const isSelected = selectedWO?.id === wo.id;
                const woTotal = wo.items.reduce((s, i) => s + i.price * i.qty, 0);

                return (
                  <div
                    key={wo.id}
                    onClick={() => handleSelectWO(wo)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-racing-500 bg-racing-500/10 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                        {wo.woNumber}
                      </span>
                      <span className="text-xs font-black text-racing-600 dark:text-racing-400 font-mono">
                        {formatRupiah(woTotal)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <span className="p-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {wo.vehicleType === 'CAR' ? (
                          <Car className="w-3.5 h-3.5 text-racing-500" />
                        ) : (
                          <Bike className="w-3.5 h-3.5 text-yellow-500" />
                        )}
                      </span>
                      <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                        {wo.vehiclePlate}
                      </span>
                      <span className="text-xs text-slate-500">• {wo.vehicleModel}</span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                      <span>Pelanggan: {wo.customerName}</span>
                      <span>{wo.items.length} Item</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Bill Breakdown & Cart */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-card space-y-5">
            {/* Header Bill */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-racing-500">
                  {selectedWO?.woNumber || 'KASIR LANGSUNG'}
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Rincian Tagihan Servis & Sparepart
                </h2>
                <div className="text-xs text-slate-500 mt-0.5">
                  Pelanggan: <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedWO?.customerName}</span> ({selectedWO?.vehiclePlate})
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-slate-400">Total Tagihan</span>
                <div className="text-2xl font-black text-racing-600 dark:text-racing-400 font-mono">
                  {formatRupiah(grandTotal)}
                </div>
              </div>
            </div>

            {/* Cart Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-[11px] font-bold uppercase text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <th className="py-2.5">Item</th>
                    <th className="py-2.5 text-center">Tipe</th>
                    <th className="py-2.5 text-center">Qty</th>
                    <th className="py-2.5 text-right">Harga</th>
                    <th className="py-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">
                        {item.name}
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            item.type === 'SERVICE'
                              ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                              : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {item.type === 'SERVICE' ? 'Jasa' : 'Part'}
                        </span>
                      </td>
                      <td className="py-3 text-center font-bold">{item.qty}</td>
                      <td className="py-3 text-right font-mono text-slate-500">
                        {formatRupiah(item.price)}
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatRupiah(item.price * item.qty)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cost Breakdown & Tax / Discount Controls */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-3 text-xs border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal Jasa Servis:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {formatRupiah(subtotalServices)}
                </span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Subtotal Suku Cadang:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {formatRupiah(subtotalParts)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Potongan Diskon (Rp):</span>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-32 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-right font-mono text-xs font-bold focus:ring-2 focus:ring-racing-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={applyTax}
                    onChange={(e) => setApplyTax(e.target.checked)}
                    className="rounded border-slate-300 text-racing-500 focus:ring-racing-500"
                  />
                  <span>Terapkan Pajak PPN (11%)</span>
                </label>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {formatRupiah(taxAmount)}
                </span>
              </div>

              <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-700 text-sm font-black text-slate-900 dark:text-white">
                <span>Grand Total:</span>
                <span className="text-racing-600 dark:text-racing-400 font-mono text-lg">
                  {formatRupiah(grandTotal)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPaymentModal(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-racing-500 to-racing-600 hover:from-racing-600 hover:to-racing-700 text-white font-extrabold text-sm shadow-glow flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>Bayar Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-racing-500" />
                Pilih Metode Pembayaran
              </h2>
              <div className="text-xs text-slate-500 mb-4">
                Total Tagihan: <span className="font-bold text-racing-600 dark:text-racing-400 font-mono">{formatRupiah(grandTotal)}</span>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 font-bold text-xs transition-all ${
                    paymentMethod === 'CASH'
                      ? 'border-racing-500 bg-racing-500/10 text-racing-500 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500'
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                  <span>Tunai (Cash)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('TRANSFER')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 font-bold text-xs transition-all ${
                    paymentMethod === 'TRANSFER'
                      ? 'border-blue-500 bg-blue-500/10 text-blue-500 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500'
                  }`}
                >
                  <Building className="w-5 h-5" />
                  <span>Transfer Bank</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('QRIS')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 font-bold text-xs transition-all ${
                    paymentMethod === 'QRIS'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span>QRIS Dinamis</span>
                </button>
              </div>

              {/* Tab CASH Content */}
              {paymentMethod === 'CASH' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Uang Diterima dari Pelanggan (Rp) *
                    </label>
                    <input
                      type="number"
                      required
                      value={cashReceived}
                      onChange={(e) => setCashReceived(e.target.value)}
                      className="w-full text-base font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    />
                  </div>

                  {/* Quick Cash Buttons */}
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCashReceived(String(grandTotal))}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-[11px]"
                    >
                      Uang Pas
                    </button>
                    <button
                      type="button"
                      onClick={() => setCashReceived('500000')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-[11px]"
                    >
                      500.000
                    </button>
                    <button
                      type="button"
                      onClick={() => setCashReceived('800000')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-[11px]"
                    >
                      800.000
                    </button>
                    <button
                      type="button"
                      onClick={() => setCashReceived('1000000')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-[11px]"
                    >
                      1.000.000
                    </button>
                  </div>

                  {/* Change Calculation Box */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
                    <span className="font-bold text-emerald-800 dark:text-emerald-400">
                      Uang Kembalian:
                    </span>
                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      {formatRupiah(changeAmount)}
                    </span>
                  </div>
                </div>
              )}

              {/* Tab TRANSFER Content */}
              {paymentMethod === 'TRANSFER' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Pilih Rekening Tujuan Bengkel
                    </label>
                    <select
                      value={bankTarget}
                      onChange={(e) => setBankTarget(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    >
                      <option value="BCA">BCA - 0123-4567-89 (a.n PT BengkelKu Otomotif)</option>
                      <option value="MANDIRI">MANDIRI - 132-00-1122334-4 (a.n PT BengkelKu Otomotif)</option>
                      <option value="BRI">BRI - 0012-01-002233-50-1 (a.n PT BengkelKu Otomotif)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nomor Referensi Transfer / Ref ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={transferRef}
                      onChange={(e) => setTransferRef(e.target.value)}
                      placeholder="Contoh: MBCA-98124981"
                      className="w-full font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-racing-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Tab QRIS Content */}
              {paymentMethod === 'QRIS' && (
                <div className="space-y-3 text-center text-xs">
                  <div className="w-44 h-44 mx-auto p-3 bg-white rounded-2xl border border-slate-300 shadow-inner flex flex-col items-center justify-center">
                    <QrCode className="w-32 h-32 text-slate-900" />
                    <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase mt-1">
                      QRIS STANDAR BI
                    </span>
                  </div>
                  <div className="text-slate-500">
                    Scan menggunakan BCA Mobile, Livin, GoPay, OVO, atau ShopeePay
                  </div>
                  <div className="font-mono text-base font-black text-racing-600">
                    {formatRupiah(grandTotal)}
                  </div>
                </div>
              )}

              <div className="pt-6 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 mt-5">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleProcessPayment}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-racing-500 to-racing-600 hover:from-racing-600 hover:to-racing-700 text-white font-bold shadow-glow"
                >
                  Konfirmasi & Terbitkan Struk
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Thermal Receipt Print Modal */}
      <AnimatePresence>
        {showReceiptModal && completedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative max-h-[95vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 print:hidden"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Printable Thermal Receipt (80mm styling) */}
              <div id="thermal-receipt" className="font-mono text-xs text-slate-900 dark:text-slate-100 space-y-3">
                {/* Header */}
                <div className="text-center border-b border-dashed border-slate-300 dark:border-slate-700 pb-3">
                  <div className="font-black text-base tracking-wider uppercase">BENGKELKU SERVICE</div>
                  <div className="text-[10px] text-slate-500">Jl. Surya Sumantri No. 120, Bandung</div>
                  <div className="text-[10px] text-slate-500">Telp / WA: 0812-3456-7890</div>
                </div>

                {/* Meta */}
                <div className="text-[11px] space-y-0.5 border-b border-dashed border-slate-300 dark:border-slate-700 pb-2">
                  <div className="flex justify-between">
                    <span>No. Nota:</span>
                    <span className="font-bold">{completedInvoice.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>No. SPK:</span>
                    <span>{completedInvoice.woNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Waktu:</span>
                    <span>{formatDateTimeIndo(completedInvoice.paidAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plat Nomor:</span>
                    <span className="font-bold">{completedInvoice.vehiclePlate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pelanggan:</span>
                    <span>{completedInvoice.customerName}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-1.5 border-b border-dashed border-slate-300 dark:border-slate-700 pb-3 text-[11px]">
                  {completedInvoice.items.map((it: POSItem) => (
                    <div key={it.id}>
                      <div className="font-bold">{it.name}</div>
                      <div className="flex justify-between text-slate-500">
                        <span>
                          {it.qty} x {formatRupiah(it.price)}
                        </span>
                        <span className="text-slate-900 dark:text-white font-bold">
                          {formatRupiah(it.price * it.qty)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-1 text-[11px] border-b border-dashed border-slate-300 dark:border-slate-700 pb-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatRupiah(completedInvoice.subtotalServices + completedInvoice.subtotalParts)}</span>
                  </div>
                  {completedInvoice.discount > 0 && (
                    <div className="flex justify-between text-rose-500">
                      <span>Diskon:</span>
                      <span>-{formatRupiah(completedInvoice.discount)}</span>
                    </div>
                  )}
                  {completedInvoice.taxAmount > 0 && (
                    <div className="flex justify-between">
                      <span>PPN (11%):</span>
                      <span>{formatRupiah(completedInvoice.taxAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-black text-sm pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span>TOTAL:</span>
                    <span className="text-racing-600 dark:text-racing-400 font-mono">
                      {formatRupiah(completedInvoice.grandTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Metode:</span>
                    <span className="font-bold uppercase">{completedInvoice.paymentMethod}</span>
                  </div>
                  {completedInvoice.paymentMethod === 'CASH' && (
                    <>
                      <div className="flex justify-between text-slate-500">
                        <span>Bayar Tunai:</span>
                        <span>{formatRupiah(completedInvoice.cashReceived)}</span>
                      </div>
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                        <span>Kembalian:</span>
                        <span>{formatRupiah(completedInvoice.changeAmount)}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Footer */}
                <div className="text-center text-[10px] text-slate-500 space-y-1 pt-1">
                  <div>GARANSI SERVIS 7 HARI / 500 KM</div>
                  <div>Terima kasih atas kunjungan Anda!</div>
                  <div className="font-mono text-[9px]">Sistem POS: BengkelKu Cloud</div>
                </div>
              </div>

              {/* Print Actions */}
              <div className="pt-5 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 print:hidden">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Struk Thermal</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowReceiptModal(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-xs"
                >
                  Selesai
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
