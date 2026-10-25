'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Receipt,
  DollarSign,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Car,
  Bike,
  Printer,
  ChevronRight,
  Eye,
  Calendar,
  X,
  CreditCard,
  Banknote,
  QrCode,
} from 'lucide-react';
import Link from 'next/link';
import { formatRupiah, formatDateTimeIndo } from '@/lib/utils';

interface InvoiceListItem {
  id: string;
  invoiceNumber: string;
  woNumber: string;
  customerName: string;
  customerPhone: string;
  vehiclePlate: string;
  vehicleModel: string;
  vehicleType: 'CAR' | 'MOTORCYCLE';
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'PAID' | 'PARTIAL' | 'UNPAID';
  paymentMethod?: string;
  paidAt: string;
}

const INITIAL_INVOICES: InvoiceListItem[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-20261024-008',
    woNumber: 'WO-20261024-005',
    customerName: 'Budi Darmawan',
    customerPhone: '0813-9988-1122',
    vehiclePlate: 'D 4567 KLA',
    vehicleModel: 'Yamaha NMAX 155 Connected',
    vehicleType: 'MOTORCYCLE',
    subtotal: 160000,
    taxAmount: 17600,
    totalAmount: 177600,
    paidAmount: 177600,
    paymentStatus: 'PAID',
    paymentMethod: 'QRIS',
    paidAt: '2026-10-24T14:20:00',
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-20261023-007',
    woNumber: 'WO-20261023-004',
    customerName: 'Dewi Lestari',
    customerPhone: '0857-1234-9988',
    vehiclePlate: 'B 8899 TAY',
    vehicleModel: 'Honda HR-V 1.5 SE',
    vehicleType: 'CAR',
    subtotal: 450000,
    taxAmount: 49500,
    totalAmount: 499500,
    paidAmount: 499500,
    paymentStatus: 'PAID',
    paymentMethod: 'BANK_TRANSFER',
    paidAt: '2026-10-23T16:10:00',
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-20261023-006',
    woNumber: 'WO-20261023-003',
    customerName: 'Hendrik Pratama',
    customerPhone: '0812-4455-8899',
    vehiclePlate: 'B 2233 PQR',
    vehicleModel: 'Pajero Sport Dakar',
    vehicleType: 'CAR',
    subtotal: 820000,
    taxAmount: 90200,
    totalAmount: 910200,
    paidAmount: 910200,
    paymentStatus: 'PAID',
    paymentMethod: 'CASH',
    paidAt: '2026-10-23T11:45:00',
  },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceListItem[]>(INITIAL_INVOICES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'UNPAID'>('ALL');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceListItem | null>(null);

  const filteredInvoices = invoices.filter((inv) => {
    const matchSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.woNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
      inv.vehiclePlate.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === 'ALL' ? true : inv.paymentStatus === statusFilter;

    return matchSearch && matchStatus;
  });

  const totalPaidRevenue = invoices
    .filter((i) => i.paymentStatus === 'PAID')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-racing-500" />
            Riwayat Invoice & Pembayaran Kasir
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Daftar transaksi penjualan jasa dan suku cadang yang telah diterbitkan
          </p>
        </div>

        <Link
          href="/pos"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-racing-500 hover:bg-racing-600 text-white font-bold text-xs shadow-glow transition-all active:scale-95"
        >
          <DollarSign className="w-4 h-4" />
          <span>Buka Kasir POS</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Omzet Kasir</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {formatRupiah(totalPaidRevenue)}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
            {invoices.length} Transaksi Selesai
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">Rata-Rata Nilai Tiket</div>
          <div className="text-2xl font-black text-racing-600 dark:text-racing-400 mt-1">
            {formatRupiah(Math.round(totalPaidRevenue / (invoices.length || 1)))}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Gabungan Mobil & Motor</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">Metode Terpopuler</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            QRIS & Transfer
          </div>
          <div className="text-[11px] text-blue-500 font-bold mt-1">70% Transaksi Non-Tunai</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor invoice, no. SPK, nama pelanggan, atau plat nomor..."
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-racing-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'ALL'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('PAID')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'PAID'
                ? 'bg-emerald-500 text-white'
                : 'bg-emerald-500/15 text-emerald-500'
            }`}
          >
            Lunas
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="py-3.5 px-4">No. Invoice & Waktu</th>
                <th className="py-3.5 px-4">No. SPK & Kendaraan</th>
                <th className="py-3.5 px-4">Pelanggan</th>
                <th className="py-3.5 px-4">Metode Bayar</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Total Tagihan</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-4 px-4 font-mono">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {inv.invoiceNumber}
                    </span>
                    <div className="text-[10px] text-slate-400">
                      {formatDateTimeIndo(inv.paidAt)}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {inv.vehicleType === 'CAR' ? (
                        <Car className="w-4 h-4 text-racing-500" />
                      ) : (
                        <Bike className="w-4 h-4 text-yellow-500" />
                      )}
                      <div>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {inv.vehiclePlate}
                        </span>
                        <div className="text-[10px] text-slate-500">{inv.woNumber}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {inv.customerName}
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-semibold text-slate-600 dark:text-slate-400 uppercase text-[11px]">
                      {inv.paymentMethod || 'TUNAI'}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      Lunas
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right font-mono font-black text-slate-900 dark:text-white">
                    {formatRupiah(inv.totalAmount)}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedInvoice(inv)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition-all text-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat Nota</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center border-b border-dashed border-slate-300 dark:border-slate-700 pb-3 mb-3">
                <div className="font-black text-base tracking-wider uppercase">BENGKELKU INVOICE</div>
                <div className="text-[10px] text-slate-500">Jl. Surya Sumantri No. 120, Bandung</div>
                <div className="text-[10px] text-slate-500">Telp: 0812-3456-7890</div>
              </div>

              <div className="font-mono text-xs space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Invoice:</span>
                  <span className="font-bold">{selectedInvoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">No. SPK:</span>
                  <span>{selectedInvoice.woNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pelanggan:</span>
                  <span>{selectedInvoice.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kendaraan:</span>
                  <span>{selectedInvoice.vehiclePlate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Waktu Bayar:</span>
                  <span>{formatDateTimeIndo(selectedInvoice.paidAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Metode:</span>
                  <span className="font-bold">{selectedInvoice.paymentMethod}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 font-bold text-sm">
                  <span>Total Dibayar:</span>
                  <span className="text-racing-600 font-mono">
                    {formatRupiah(selectedInvoice.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Cetak Nota
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-xs"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
